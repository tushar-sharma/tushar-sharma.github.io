require "jekyll-paginate-v2"

module Jekyll
  module PaginateV2
    module Generator
      module PaginationExcludeLogs
        LOG_PATH_PATTERN = /(daily-log|daily-logs|dialy-logs|weekly-log|weekly-logs)/i
        LOG_TITLE_PATTERN = /\b(daily|weekly)\s+logs?\b/i

        def paginate(template, config, site_title, all_posts, all_tags, all_categories, all_locales)
          if config["exclude_log_posts"]
            filtered_posts = all_posts.reject { |post| log_post?(post) }
            all_posts = filtered_posts
            all_categories = PaginationIndexer.index_posts_by(filtered_posts, "categories")
            all_categories["posts"] = filtered_posts
            all_tags = PaginationIndexer.index_posts_by(filtered_posts, "tags")
            all_locales = PaginationIndexer.index_posts_by(filtered_posts, "locale")
          end

          super(template, config, site_title, all_posts, all_tags, all_categories, all_locales)
        end

        private

        def log_post?(post)
          return true if post.data["is_log"]

          identifiers = [
            post.path,
            post.data["title"],
            post.data["slug"],
            post.basename_without_ext
          ].compact.join(" ")

          identifiers.match?(LOG_PATH_PATTERN) || identifiers.match?(LOG_TITLE_PATTERN)
        end
      end

      PaginationModel.prepend(PaginationExcludeLogs)
    end
  end
end
