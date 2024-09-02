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
cleanbranch:
	git branch --merged master | grep -v '^\*' | xargs -n 1 git branch -D
copy:
	rm -fr tag
	cp  CNAME _site/
	cp  sitemap.xml _site/
	cp .nojekyll _site/
	cp robots.txt _site/
	cp loaderio-7f4b60e67a3aaee0ab4eb4633167d793.txt _site/
	rm -f scripts/habit.log
verify:
	@echo "Verifying copied files..."
	@test -d tag && echo "tag directory: OK" || echo "tag directory: Missing"
	@test -f _site/sitemap.xml && echo "sitemap.xml: OK" || echo "sitemap.xml: Missing"
	@test -f _site/CNAME && echo "CNAME: OK" || echo "CNAME: Missing"
	@test -f _site/.nojekyll && echo ".nojekyll: OK" || echo ".nojekyll: Missing"
	@test -f _site/robots.txt && echo "robots.txt: OK" || echo "robots.txt: Missing"
	@test ! -f scripts/habit.log && echo "scripts/habit.log: OK" || echo "scripts/habit.log: Still present"
