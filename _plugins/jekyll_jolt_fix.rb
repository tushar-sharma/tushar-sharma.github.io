# Monkey patch to fix jekyll-jolt bug with integer values
# See: https://github.com/helpscout/jekyll-jolt/issues
# The prop? method in jekyll-jolt doesn't handle integer values properly

module Jekyll
  module Tags
    class TemplateBlock < Liquid::Block
      # Override the prop? method to handle non-string values
      def prop?(variable = "")
        return false unless variable.respond_to?(:=~)
        (variable =~ PROPS_REGEXP) != nil
      end
    end
  end
end
