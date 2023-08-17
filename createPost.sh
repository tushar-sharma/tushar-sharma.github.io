# create a new post and fill the template

# the contents of ~/.postname:
#!/bin/zsh

################
# Get our info #
################
read -p "Enter the file name: " file_variable;
read -p "Enter the post name: " post_variable;
read -p "Enter the image name " image_variable;
read -p "Enter the author name: " author_variable;
touch _posts/$postdate-$file_variable.md
cat <<EOF > _posts/$postdate-$file_variable.md
---
layout: post
title: $post_variable
image: /img/$image_variable
thumb: /img/$image_variable
author: $author_variable;
category: blog
published: false
---

.<!-- truncate_here -->
EOF
exit 0

echo 'Done!'"
