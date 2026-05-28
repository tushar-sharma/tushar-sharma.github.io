module Jekyll
  class AllowedAdsList < Generator
    safe true
    priority :highest

    def generate(site)
      list_path = File.join(site.source, "_data", "allowedAds.list")
      site.data["allowedAds"] = []
      return unless File.exist?(list_path)

      site.data["allowedAds"] = File.readlines(list_path, chomp: true)
        .map { |line| line.sub(/#.*/, "").strip }
        .reject(&:empty?)
        .flat_map { |url| normalized_url_variants(url, site) }
        .uniq
    end

    private

    def normalized_url_variants(url, site)
      normalized_url = url.sub(/\A#{Regexp.escape(site.config["url"].to_s)}/, "")
      normalized_url = normalized_url.sub(/\A#{Regexp.escape(site.config["baseurl"].to_s)}/, "") if site.config["baseurl"]
      normalized_url = "/#{normalized_url}" unless normalized_url.start_with?("/")
      normalized_url = normalized_url.sub(%r!/index\.html\z!, "/")
      normalized_url = normalized_url.sub(%r!/\z!, "") unless normalized_url == "/"

      [normalized_url, "#{normalized_url}/"]
    end
  end
end
