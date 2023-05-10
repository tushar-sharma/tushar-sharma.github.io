create:
	bash createPost.sh
serve:
	JEKYLL_ENV=production bundle exec jekyll serve --trace
clean:
	rm -fr tag
	cp -r _site/tag .
	cp _site/sitemap.xml .
add:
	git add tag
	git add sitemap.xml
build:
	JEKYLL_ENV=production bundle exec jekyll build
	$(MAKE) copy
copy:
	rm -fr tag
	cp -r _site/tag .
	cp  sitemap.xml _site/
	cp  CNAME _site/
	cp .nojekyll _site/
	cp robots.txt _site/
	cp loaderio-7f4b60e67a3aaee0ab4eb4633167d793.txt _site/
	rm -f scripts/habit.log
