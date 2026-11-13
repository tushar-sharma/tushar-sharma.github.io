#!/usr/bin/env ruby

require "json"
require "nokogiri"
require "pathname"

site_dir = Pathname(ARGV.fetch(0, "_site")).expand_path
output_path = site_dir.join("search", "fuzzy-index.json")
documents = []

def page_url(site_dir, path)
  relative = path.relative_path_from(site_dir).to_s
  return "/" if relative == "index.html"
  return "/#{relative.delete_suffix("index.html")}" if relative.end_with?("/index.html")

  "/#{relative}"
end

site_dir.glob("**/*.html").sort.each do |path|
  document = Nokogiri::HTML(File.read(path))
  indexed_nodes = document.css("[data-pagefind-body]")
  next if indexed_nodes.empty?

  indexed_nodes.css("script, style, noscript").remove
  content = indexed_nodes.map(&:text).join(" ").gsub(/\s+/, " ").strip
  next if content.empty?

  title_node = document.at_css('[data-pagefind-meta~="title"]') || document.at_css("h1")
  date_node = document.at_css('[data-pagefind-meta~="date"]')
  tags_node = document.at_css('[data-pagefind-meta~="tags"]')
  documents << {
    id: documents.length,
    url: page_url(site_dir, path),
    title: title_node&.text&.strip || "Untitled post",
    date: date_node&.[]("content").to_s,
    tags: tags_node&.[]("content").to_s,
    content: content
  }
end

output_path.dirname.mkpath
File.write(output_path, JSON.generate({ version: 1, documents: documents }))
puts "Built fuzzy search index with #{documents.length} pages: #{output_path}"
