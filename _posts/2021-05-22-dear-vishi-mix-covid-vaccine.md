---
layout: post
title: Dear Vishi, can you mix Covid Vaccine?
category: blog
tags:
  - diary
  - letters
name: dear-vishi
thumb: https://unsplash.com/photos/npjP0dCtoxo/download?w=437
image: https://unsplash.com/photos/npjP0dCtoxo/download?w=437
published: true
---

Today the sleep was better. Yesterday I was sleep deprived. Hunger is the best ingredient to make any food delicious. Likewise a sound sleep is like a `manna from heaven` for me.<!-- truncate_here -->

Today the sleep was better. Yesterday I was sleep deprived. Hunger is the best ingredient to make any food delicious. Likewise a sound sleep is like a `manna from heaven` for me.

I hope you are spending time honing SQL skills. I hope you are making some progress in the online course at [Educative.io](https://www.educative.io/courses/introductory-guide-to-sql/). There's also another resource [SQLZoo](https://sqlzoo.net/) that has some fun exercise that you can explore. Next week we can take a SQL quiz together to see how well we fare against each other. 


## Health

### Meditation

I practiced meditation for 15 minutes today. The [background music](https://www.youtube.com/watch?v=ubNfkpbxXUs&list=LL&index=1) was that of rain. The murmur of the raindrops, the roar of the thunder, the michief of the winds, plays a combined symphony which fascinated me as a child. My early childhood was spent in Jodhpur. During rains, children would come out of their cages, and played in the muddy puddles thanks to the rampant potholes of Indian roads. I envied them how they get drenched in rain and mirth. Now I have grown old enough to let myself escape under the canopy of sky when the clouds bleed. I pity some, who flee at a whisper of a raindrop to a shelter, missing one of the greatest joy in the world.

> "Some people walk in the rain, others just get wet." - Roger Miller


### Mixing Covid Vaccine

I have booked my United Airline flight from Delhi to Charlotte this June. Since I was departing in less than a month, I was in a dilemma if I should delay taking Covid vaccine in India since I wont be available for second dose. 

Due to an unforseen event, India is currently battling second Covid wave which is very devastating. US has banned the entry of most of visa types from India thanks to [Presendential Proclamation](https://www.whitehouse.gov/briefing-room/presidential-actions/2021/04/30/a-proclamation-on-the-suspension-of-entry-as-nonimmigrants-of-certain-additional-persons-who-pose-a-risk-of-transmitting-coronavirus-disease-2019/). It's not yet known when the travel ban will be revoked. 

So I've decided to get vaccinated in India preferrably [Covidshield](https://en.wikipedia.org/wiki/Oxford%E2%80%93AstraZeneca_COVID-19_vaccine). If the US revokes the travel Indian travel ban, I can take my second dose preferrably Pfizer vaccine in US. Or else I'll take my second dose of Covidshield in India itself. Though it's not yet conclusively clear if mixing vaccine is safe, however preliminary data shows it might produce more [antibodies](https://www.nature.com/articles/d41586-021-01359-3).

Earlier I wanted to get vaccinated with Pfizer or Moderna in USA since it has more than [90 percent efficacy](https://www.cdc.gov/mmwr/volumes/70/wr/mm7018e1.htm). Covidshield has efficacy around [63%](https://www.who.int/news-room/feature-stories/detail/the-oxford-astrazeneca-covid-19-vaccine-what-you-need-to-know). Sometimes it's wise to forego choices when there's a pandemic and [scarcity](https://www.fortuneindia.com/macro/scarcity-hit-india-looks-for-imported-vaccines/105492) of vaccine in India.

In the meantime, getting a first dose of vaccine in India is an uphill task. Most of my family is already vaccinated with Covidshield. I am still trying to find vaccination slots online for past two days but alas no luck. Most of the time either the [Cowin](https://www.cowin.gov.in/) website's server crashes or the slots are already booked. 


Hopefully  I'll get my first coronavirus vaccine dose soon. At least its better to have some immunity than nothing even if I miss my second dose due to some unforseen event.


### Warts

It has been several months since I noticed warts on my toes. It's not paintful, but it look like a black dot. 

Earlier I thoguht it would disappear on its own, but it has persisted. So I had to consult a doctor. Due to Covid-19 restriction, it's better to schedule a doctor appointment online. You pay doctor fee using [Google Pay](https://en.wikipedia.org/wiki/Google_Pay). After the payment,  the doctor video calls you through WhatsApp. 

Salicyclic acid is the often recommended as first medication against plantar warts. Earlier I was using Salicylix SF6 which contains 6% Salicyclic acid. The results were not satisfactory. 

Currently, the doctor has recommended to use Watnil Salalin lotion which contains 16.7% Salicyclic acid. I will update if this treatment is effective. The doctor also advised to take Zinc tablets to [boost immunity](https://www.ouh.nhs.uk/patient-guide/leaflets/files/14029Pzinc.pdf) against warts.




## Code

### Poetry

I had a python project where I was trying to setup in a new laptop. I ran the following command

```bash
$ poetry install
```
Poetry crashed with the following error

```bash
Creating virtualenv usa in /home/project/.venv    
  ModuleNotFoundError  
  No module named 'virtualenv.seed.via_app_data'
  at <frozen importlib._bootstrap>:973 in _find_and_load_unlocked
```


My laptop has Ubuntu 20.04 LTS. 

```bash
$ poetry env info

Virtualenv
Python:         3.8.5
Implementation: CPython
Valid:          True

System
Platform: linux
OS:       posix
Python:   /usr

```

```bash
$ poetry --version
Poetry version 1.1.4
```

If you remove `python3-virtualenv` then `poetry` seems to work.

```bash
$ sudo apt remove --purge python3-virtualenv
```

