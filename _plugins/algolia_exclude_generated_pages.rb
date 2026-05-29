module Jekyll
  module Algolia
    module Hooks
      def self.should_be_excluded?(filepath)
        normalized = filepath.to_s.sub(%r!\A\./!, '')

        normalized.start_with?('tag/', 'tags/')
      end
    end
  end
end
