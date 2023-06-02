# create a new post and fill the template

# the contents of ~/.postname:
#!/bin/zsh

################
# Get our info #
################
yearmonth=`date "+%Y/%m"`
postdate=`date "+%Y-%m-%d"`
jekylldate=`date "+%Y-%m-%d"`
read -p "Enter the file name: " file_variable;
read -p "Enter the post name: " post_variable;
read -p "Enter the image url from Unsplash: " image_variable;
read -p "Enter the author name: " author_variable;
touch _posts/$postdate-$file_variable.md
cat <<EOF > _posts/$postdate-$file_variable.md
---
layout: post
date: $jekylldate
title: $post_variable
image: https://unsplash.com/photos/$image_variable/download?w=800
thumb: https://unsplash.com/photos/$image_variable/download?w=800
author: $author_variable;
---

.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>
EOF
exit 0

echo 'Done!'"
