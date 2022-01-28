build:
	JEKYLL_ENV=production bundle exec jekyll build
	cp CNAME _site/
	touch _site/.nojekyll
serve:
	JEKYLL_ENV=production bundle exec jekyll serve
clean:
	rm -fr tag
	cp -r _site/tag .
	cp _site/sitemap.xml .
add:
	git add tag
	git add sitemap.xml
copy:
	cp -r sitemap.xml _site/
	cp -r CNAME _site/
	cp .nojekyll _site/
