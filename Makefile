oldserve:
	JEKYLL_ENV=production bundle exec jekyll serve
clean:
	rm -fr tag
	cp -r _site/tag .
	cp _site/sitemap.xml .
add:
	git add tag
	git add sitemap.xml
oldbuild:
	JEKYLL_ENV=production bundle exec jekyll build
build:
	chmod -R 777 *
	docker-compose up build
serve:
	chmod -R 777 *
	docker-compose up serve
copy:
	cp -r sitemap.xml _site/
	cp -r CNAME _site/
	cp .nojekyll _site/
	cp robots.txt _site/
