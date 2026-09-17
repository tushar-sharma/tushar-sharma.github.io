document.addEventListener('DOMContentLoaded', function() {
  function inferLanguage(target) {
    var classes = [target.className || ''];
    var languageContainer = target.closest('[class*="language-"]');

    if (target.parentElement) {
      classes.push(target.parentElement.className || '');
    }

    if (languageContainer) {
      classes.push(languageContainer.className || '');
    }

    var joined = classes.join(' ');
    var match = joined.match(/language-([a-z0-9_+-]+)/i);
    if (!match) {
      match = joined.match(/highlight-source-([a-z0-9_+-]+)/i);
    }

    if (!match) {
      return 'code';
    }

    return match[1].replace(/[-_]/g, ' ');
  }

  function titleCase(value) {
    return value.replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
  }

  function formatLanguageLabel(value) {
    var normalized = value.toLowerCase();
    var labels = {
      bash: 'Shell',
      sh: 'Shell',
      shell: 'Shell',
      zsh: 'Shell',
      yaml: 'YAML',
      yml: 'YAML',
      json: 'JSON',
      xml: 'XML',
      html: 'HTML',
      css: 'CSS',
      js: 'JavaScript',
      javascript: 'JavaScript',
      ts: 'TypeScript',
      typescript: 'TypeScript',
      py: 'Python',
      python: 'Python',
      java: 'Java',
      scala: 'Scala',
      kotlin: 'Kotlin',
      groovy: 'Groovy',
      make: 'Makefile',
      text: 'Plaintext',
      plaintext: 'Plaintext',
      txt: 'Plaintext',
      hocon: 'HOCON'
    };

    return labels[normalized] || titleCase(value);
  }

  function trimBoundaryBlankLines(lines) {
    while (lines.length > 1 && lines[0].trim() === '') {
      lines.shift();
    }

    while (lines.length > 1 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }

    return lines;
  }

  function buildLineTable(pre) {
    var rawHtml = pre.innerHTML.replace(/\r\n/g, '\n').replace(/\n+$/g, '');
    var rawText = pre.textContent.replace(/\r\n/g, '\n').replace(/\n+$/g, '');
    var htmlLines = trimBoundaryBlankLines(rawHtml.split('\n'));
    var textLines = trimBoundaryBlankLines(rawText.split('\n'));
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');

    table.className = 'code-frame__table';

    textLines.forEach(function(_, index) {
      var row = document.createElement('tr');
      var gutter = document.createElement('td');
      var codeCell = document.createElement('td');
      var lineHtml = htmlLines[index] || '';

      gutter.className = 'code-frame__gutter';
      gutter.textContent = String(index + 1);

      codeCell.className = 'code-frame__code-cell';
      codeCell.innerHTML = lineHtml.length === 0 ? '&nbsp;' : lineHtml;

      row.appendChild(gutter);
      row.appendChild(codeCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);

    return {
      table: table,
      text: textLines.join('\n')
    };
  }

  function enhanceLocalCodeBlocks() {
    var blocks = document.querySelectorAll('div.highlight');

    blocks.forEach(function(block) {
      if (block.classList.contains('code-frame')) {
        return;
      }

      var pre = block.querySelector('pre');
      if (!pre) {
        return;
      }

      var enhanced = buildLineTable(pre);
      var label = formatLanguageLabel(inferLanguage(pre));
      var header = document.createElement('div');
      var labelEl = document.createElement('span');
      var button = document.createElement('button');
      var scroll = document.createElement('div');

      block.classList.add('code-frame');
      block.setAttribute('data-copy-content', enhanced.text);

      header.className = 'code-frame__header';
      labelEl.className = 'code-frame__label';
      labelEl.textContent = label;

      button.className = 'copy-button code-frame__copy';
      button.type = 'button';
      button.textContent = 'Copy';

      scroll.className = 'code-frame__scroll';
      scroll.appendChild(enhanced.table);

      header.appendChild(labelEl);
      header.appendChild(button);

      block.innerHTML = '';
      block.appendChild(header);
      block.appendChild(scroll);
    });
  }

  function getCopyText(button) {
    var frame = button.closest('.code-frame');
    if (frame && frame.dataset.copyContent) {
      return frame.dataset.copyContent;
    }

    var legacyContainer = button.closest('.code-block');
    if (legacyContainer && legacyContainer.dataset.content) {
      return legacyContainer.dataset.content;
    }

    var previous = button.previousElementSibling;
    return previous ? previous.innerText : '';
  }

  function setCopiedState(button, label) {
    button.textContent = label;
    setTimeout(function() {
      button.textContent = 'Copy';
    }, 1600);
  }

  function copyText(button, content) {
    if (!content) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(content)
        .then(function() {
          setCopiedState(button, 'Copied');
        })
        .catch(function() {
          fallbackCopy(button, content);
        });
      return;
    }

    fallbackCopy(button, content);
  }

  function fallbackCopy(button, content) {
    var tempTextarea = document.createElement('textarea');

    tempTextarea.value = content;
    tempTextarea.setAttribute('readonly', '');
    tempTextarea.style.position = 'absolute';
    tempTextarea.style.left = '-9999px';

    document.body.appendChild(tempTextarea);
    tempTextarea.select();

    try {
      document.execCommand('copy');
      setCopiedState(button, 'Copied');
    } catch (err) {
      button.textContent = 'Copy failed';
      setTimeout(function() {
        button.textContent = 'Copy';
      }, 1600);
    }

    document.body.removeChild(tempTextarea);
  }

  enhanceLocalCodeBlocks();

  document.addEventListener('click', function(event) {
    var button = event.target.closest('.copy-button');
    if (!button) {
      return;
    }

    copyText(button, getCopyText(button));
  });
});
  
