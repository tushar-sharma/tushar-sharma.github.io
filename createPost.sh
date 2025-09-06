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
read -p "Enter the image id from unsplash " image_variable;
read -p "Enter the author name: " author_variable
touch _posts/$postdate-$file_variable.md
cat <<EOF > _posts/$postdate-$file_variable.md
---
layout: post
title: $post_variable
image: https://unsplash.com/photos/$image_variable/download?w=437
thumb: https://unsplash.com/photos/$image_variable/download?w=437
author: $author_variable
category: blog
published: false
---

Dear Vishi, dear logs for today.<!-- truncate_here -->

Dear Vishi, dear logs for today.
EOF
exit 0

echo 'Done!'"
