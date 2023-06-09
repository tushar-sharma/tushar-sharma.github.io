document.addEventListener('DOMContentLoaded', function() {
    var copyButtons = document.querySelectorAll('.copy-button');
  
    copyButtons.forEach(function(button) {
      var codeBlock = button.previousElementSibling;
      var content = codeBlock.innerText;
  
      button.addEventListener('click', function() {
        var tempTextarea = document.createElement('textarea');
        tempTextarea.value = content;
  
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
  
        try {
          document.execCommand('copy');
          console.log('Text copied to clipboard');
          button.textContent = 'Copied!';
        } catch (err) {
          console.error('Failed to copy text: ', err);
          button.textContent = 'Copy';
        }
  
        document.body.removeChild(tempTextarea);
  
        setTimeout(function() {
          button.textContent = 'Copy';
        }, 2000);
      });
    });
  });
  