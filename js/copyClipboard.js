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
          document.execCommand('copy');
          document.body.removeChild(tempTextarea);

          button.textContent = 'Copied!';
          setTimeout(function() {
              button.textContent = 'Copy';
          }, 2000);
      });
  });
});
