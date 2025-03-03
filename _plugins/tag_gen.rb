module Jekyll
  class TagIndex < Page    
    def initialize(site, base, dir, tag, page_num, total_pages, posts)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag_index.html')
      self.data['tag'] = tag
      self.data['title'] = "Posts Tagged: #{tag}" + (page_num > 1 ? " (Page #{page_num})" : "")
      self.data['posts'] = posts
      self.data['paginator'] = {
        'page'          => page_num,
        'per_page'      => site.config['pagination']['per_page'],
        'total_pages'   => total_pages,
        'previous_page' => page_num > 1 ? page_num - 1 : nil,
        'next_page'     => page_num < total_pages ? page_num + 1 : nil
      }
    end
  end

  class TagGenerator < Generator
    safe true
    
    def generate(site)
      return unless site.layouts.key?('tag_index')
      tag_base_dir = 'tag'
      site.tags.each do |tag, posts|
        paginate_tag(site, tag, posts, tag_base_dir)
      end
    end

    def paginate_tag(site, tag, posts, tag_base_dir)
      per_page = site.config['pagination']['per_page'].to_i
      total_pages = (posts.size.to_f / per_page).ceil
      (1..total_pages).each do |page_num|
        paginated_posts = posts[((page_num - 1) * per_page), per_page]
        # For page 1, URL: /tag/<tag>/ ; for other pages: /tag/<tag>/pageX/
        dir = page_num == 1 ? File.join(tag_base_dir, tag) : File.join(tag_base_dir, tag, "page#{page_num}")
        write_tag_index(site, dir, tag, page_num, total_pages, paginated_posts)
      end
    end
  
    def write_tag_index(site, dir, tag, page_num, total_pages, posts)
      index = TagIndex.new(site, site.source, dir, tag, page_num, total_pages, posts)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
    end
  end
end
