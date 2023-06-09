document.addEventListener('DOMContentLoaded', function() {
    var copyButtons = document.querySelectorAll('.copy-button');
  
    copyButtons.forEach(function(button) {
      var codeBlock = button.previousElementSibling;
      var content = codeBlock.innerText;

      // Remove leading spaces from each line
      const resultString = content
      .split('\n')
      .map(line => line.substring(1))
      .join('\n')

      content = resultString.replace(/(\n\s*\n)+/g, '\n\n');

  
      button.addEventListener('click', function() {
        var tempTextarea = document.createElement('textarea');
        tempTextarea.value = content;
  
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
  
        try {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(content)
              .then(function() {
                console.log('Text copied to clipboard');
                button.textContent = 'Copied!';
                setTimeout(function() {
                  button.textContent = 'Copy';
                }, 2000);
              })
              .catch(function(err) {
                console.error('Failed to copy text: ', err);
                button.textContent = 'Copy';
              })
              .finally(function() {
                document.body.removeChild(tempTextarea);
              });
          } else {
            throw new Error('Clipboard API not available');
          }
        } catch (err) {
          console.error('Failed to copy text: ', err);
          button.textContent = 'Copy';
          document.body.removeChild(tempTextarea);
        }
      });
    });
  });
  