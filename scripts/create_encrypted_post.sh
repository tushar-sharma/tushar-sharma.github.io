#!/usr/bin/env bash

set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

for dependency in git pandoc npx; do
  if ! command -v "$dependency" >/dev/null 2>&1; then
    echo "Required command not found: $dependency" >&2
    exit 1
  fi
done

post_date="$(date +%Y-%m-%d)"
display_date="$(date '+%B %-d, %Y')"
slug="${post_date}-daily-logs-${post_date}"
private_dir="$repo_root/.private-posts"
draft="$private_dir/$slug.md"
encrypted_output="$repo_root/encrypted/$slug.html"
wrapper="$repo_root/_posts/$slug.md"

mkdir -p "$private_dir" "$repo_root/encrypted"

if [[ ! -f "$draft" ]]; then
  printf '%s\n' \
    "# Daily logs for $display_date" \
    '' \
    'Write the private entry here. This file is ignored by Git.' \
    > "$draft"
  echo "Created private draft: $draft"
fi

editor="${VISUAL:-${EDITOR:-vi}}"
read -r -a editor_command <<< "$editor"
"${editor_command[@]}" "$draft"

if [[ ! -s "$draft" ]]; then
  echo "The private draft is empty; nothing was encrypted." >&2
  exit 1
fi

temporary_dir="$(mktemp -d "${TMPDIR:-/tmp}/randomwits-encrypted-post.XXXXXX")"
trap 'rm -rf "$temporary_dir"' EXIT

plain_html="$temporary_dir/$slug.html"
generated_dir="$temporary_dir/generated"

pandoc --standalone "$draft" --output "$plain_html"

echo
echo "Enter the encryption password when StatiCrypt prompts you."
echo "Use a unique password with at least 16 random characters."
echo "The password is not saved by this repository."
echo

npx --yes staticrypt@3.3.0 "$plain_html" \
  --directory "$generated_dir" \
  --config false

generated_html="$generated_dir/$slug.html"
if [[ ! -s "$generated_html" ]]; then
  echo "StatiCrypt did not produce the expected encrypted file." >&2
  exit 1
fi

if ! grep -q 'staticryptEncryptedMsgUniqueVariableName' "$generated_html"; then
  echo "Refusing to publish: the generated file does not contain a StatiCrypt payload." >&2
  exit 1
fi

if ! grep -q '"isRememberEnabled":false' "$generated_html"; then
  echo "Refusing to publish: StatiCrypt enabled browser password remembering." >&2
  exit 1
fi

cp "$generated_html" "$encrypted_output"

printf '%s\n' \
  '---' \
  'layout: post' \
  "title: Daily logs for $display_date" \
  'category: blog' \
  'tags:' \
  '  - letters' \
  'hidden: true' \
  'sitemap: false' \
  '---' \
  '' \
  '<iframe' \
  '  id="dynamicIframe"' \
  '  style="position: relative; width: 100%; height: 400px;"' \
  "  src=\"{{ root_url }}/encrypted/$slug.html\"" \
  '  frameborder="0"' \
  '  scrolling="no"' \
  '  title="Encrypted daily log"' \
  '></iframe>' \
  '' \
  '<script src="{{ root_url }}/js/resizeIframe.js"></script>' \
  > "$wrapper"

if git check-ignore -q "$encrypted_output"; then
  echo "Refusing to stage: encrypted output is unexpectedly ignored." >&2
  exit 1
fi

git add "$encrypted_output" "$wrapper"

echo
echo "Encrypted post created and staged:"
echo "  $encrypted_output"
echo "  $wrapper"
echo
echo "Plaintext remains ignored at:"
echo "  $draft"
echo
echo "Review with: git diff --cached"
