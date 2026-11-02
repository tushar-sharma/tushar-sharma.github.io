# text_to_speech.py
import click
import os
import re
from bs4 import BeautifulSoup
from markdown import markdown
import logging
from google.cloud import texttospeech
import functools
from glob import glob
from pydub import AudioSegment

logging.basicConfig(filename="logging.info",
                    level=logging.INFO,
                    format='%(asctime)s %(levelname)s %(message)s')

def clean_text(text):
    # get rid of the Hugo preamble
    text = text.decode('utf8').split("<!--begin_of_post -->")
    heading = re.search('title:(.*)\n', text[0]).group(1)
    text = ''.join(text[1]).strip()
    text = text.split("<!--end_of_post -->")[0]
    text = heading + "!\n\n" + text
    # remove ## heading in markdown
    text = re.sub(r'(#)+(.*)\n', '\\2. ', text)
    # get rid of superfluous newlines, as that counts towards our API limits
    text = re.sub('\n+', ' ', text)
    # we're hacking our way around the markdown by converting to html first,
    # just because BeautifulSoup makes life so easy
    html = markdown(text)
    #logging.info(html)
    html = re.sub(r'<sup>(.*?)</sup>', ' ', html)
    html = re.sub(r'<pre>(.*?)</pre>', ' ', html)
    #html = re.sub(r'<blockquote>(.*?)</blockquote>', ' ', html)

    # this removes some artifacts from Hugo shortcodes
    html = re.sub(r'{{}}', '', html)
    html = re.sub(r'\[\^.*?\]', ' ', html)

    #html = re.sub(r'#|##|###', " ", html)
    # mardkdown
    soup = BeautifulSoup(html, "html.parser")
    text = ''.join(soup.findAll(text=True))
    # remove jekyll markdown
    # get rid of superfluous whitespace
    return re.sub(r'\s+', ' ', text)


@click.command()
@click.argument('filename', type=click.File('rb'))
def text_to_speech(filename):
    name = os.path.basename(filename.name).replace('.md', '')
    data = filename.read()

    text = clean_text (data)

    logging.info(text)


    # initialize the API client
    client = texttospeech.TextToSpeechClient()
    step = 5000
    for j, i in enumerate(range(0, len(text), step)):
        synthesis_input = texttospeech.types.SynthesisInput(text=text[i:i+step])
        voice = texttospeech.types.VoiceSelectionParams(
            language_code='en-US',
            name='en-US-Wavenet-B'
        )
        audio_config = texttospeech.types.AudioConfig(
            audio_encoding=texttospeech.enums.AudioEncoding.MP3
        )
        logging.info(f'Synthesizing speech for {name}_{j}')
        response = client.synthesize_speech(synthesis_input, voice,
                                            audio_config)
        with open(f'{name}_{j}.mp3', 'wb') as out:
            # Write the response to the output file.
            out.write(response.audio_content)
            logging.info(f'Audio content written to file "{name}_{j}.mp3"')

    mp3_segments = sorted(glob(f'{name}_*.mp3'))
    segments = [AudioSegment.from_mp3(f) for f in mp3_segments]

    logging.info(f'Stitching together {len(segments)} mp3 files for {name}')
    audio = functools.reduce(lambda a, b: a + b, segments)

    logging.info(f'Exporting {name}.mp3')
    audio.export(f'static/audio/{name}.mp3', format='mp3')
    logging.info(f'Exporting {name}.ogg')
    audio.export(f'static/audio/{name}.ogg', format='ogg')

    logging.info('Removing intermediate files')
    for f in mp3_segments:
        os.remove(f)

if __name__ == '__main__':
    text_to_speech()
