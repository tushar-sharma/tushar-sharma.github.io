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
read -p "Enter the image name " image_variable;
read -p "Enter the author name: " author_variable
touch _posts/$postdate-$file_variable.md
cat <<EOF > _posts/$postdate-$file_variable.md
---
layout: post
title: $post_variable
image: /img/$image_variable
thumb: /img/$image_variable
author: $author_variable
category: blog
published: false
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->
EOF
exit 0

echo 'Done!'"
