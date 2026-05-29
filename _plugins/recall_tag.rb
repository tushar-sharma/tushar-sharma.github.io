require 'jekyll'

module Jekyll
  module Tags
    class RecallTag < Liquid::Block
      def initialize(tag_name, term, tokens)
        super
        @term = term.strip
      end

      def render(context)
        content = super
        site = context.registers[:site]
        # Access the markdown converter
        converter = site.find_converter_instance(Jekyll::Converters::Markdown)
        # Convert markdown to HTML and strip the surrounding <p> tags
        rendered_content = converter.convert(content).gsub(/<\/?p>/, '').strip
        
        "<span class=\"term-popover\">#{@term}<span class=\"popover-content\">#{rendered_content}</span></span>"
      end
    end
  end
end

Liquid::Template.register_tag('recall', Jekyll::Tags::RecallTag)
