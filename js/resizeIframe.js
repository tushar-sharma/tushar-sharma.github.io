(function() {
    var iframe;
    var isDecrypted = false;
  
    function resizeIframe() {
      if (iframe.contentWindow && iframe.contentWindow.document) {
        if (isDecrypted) {
          var height = Math.max(
            iframe.contentWindow.document.body.scrollHeight,
            iframe.contentWindow.document.documentElement.scrollHeight
          );
          iframe.style.height = (height + 20) + 'px'; // Add some buffer
        }
      }
    }
  
    function checkDecryption() {
      if (iframe.contentWindow && iframe.contentWindow.document) {
        // Check if the decryption was successful
        // Adjust this condition based on how StaticCrypt changes the DOM after decryption
        if (iframe.contentWindow.document.body.innerHTML.indexOf('password-form') === -1) {
          isDecrypted = true;
          resizeIframe();
        } else {
          // If not decrypted yet, check again after a short delay
          setTimeout(checkDecryption, 500);
        }
      }
    }
  
    function setupMutationObserver() {
      var observer = new MutationObserver(function(mutations) {
        if (isDecrypted) {
          resizeIframe();
        }
      });
      
      observer.observe(iframe.contentDocument.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
  
    function initIframeResizer() {
      iframe = document.getElementById('dynamicIframe');
      if (!iframe) {
        console.error('Iframe with id "dynamicIframe" not found');
        return;
      }
  
      iframe.onload = function() {
        checkDecryption();
        setupMutationObserver();
        
        // Additional checks to catch late-loading content
        setTimeout(checkDecryption, 1000);
        setTimeout(checkDecryption, 2000);
      };
  
      // Trigger resize when the window is resized, but only after decryption
      window.addEventListener('resize', function() {
        if (isDecrypted) {
          resizeIframe();
        }
      });
    }
  
    // Initialize the script when the DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initIframeResizer);
    } else {
      initIframeResizer();
    }
  })();