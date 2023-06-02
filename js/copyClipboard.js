document.addEventListener('DOMContentLoaded', function() {
  var copyButtons = document.querySelectorAll('.copy-button');

  copyButtons.forEach(function(button) {
    var codeBlock = button.previousElementSibling.querySelector('code');
    var clipboard = new ClipboardJS(button, {
      text: function() {
        return codeBlock.textContent;
      }
    });

    clipboard.on('success', function() {
      button.textContent = 'Copied!';
      setTimeout(function() {
        button.textContent = 'Copy';
      }, 2000);
    });

    clipboard.on('error', function() {
      button.textContent = 'Press Ctrl+C to copy';
    });
  });
});