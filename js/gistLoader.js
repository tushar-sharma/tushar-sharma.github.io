/**
 * Gist Loader with Caching
 * Fetches GitHub gist embeds using JSONP, caches results,
 * and renders with GitHub's original styling.
 */
(function() {
  // Cache for gist embed data by gistId+fileName
  const embedCache = {};
  // Promises for in-flight requests
  const fetchPromises = {};
  // Track if stylesheet is loaded
  let stylesheetLoaded = false;
  // Counter for unique callback names
  let callbackCounter = 0;

  /**
   * Load GitHub's gist stylesheet (only once)
   */
  function loadStylesheet(url) {
    if (stylesheetLoaded) return;

    const existing = document.querySelector(`link[href="${url}"]`);
    if (existing) {
      stylesheetLoaded = true;
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    stylesheetLoaded = true;
  }

  /**
   * Fetch gist embed using JSONP (required by GitHub)
   */
  function fetchGistEmbed(gistId, fileName) {
    const cacheKey = `${gistId}:${fileName}`;

    if (embedCache[cacheKey]) {
      return Promise.resolve(embedCache[cacheKey]);
    }

    if (fetchPromises[cacheKey]) {
      return fetchPromises[cacheKey];
    }

    fetchPromises[cacheKey] = new Promise((resolve, reject) => {
      const callbackName = `gistCallback_${callbackCounter++}`;
      const script = document.createElement('script');

      // Cleanup function
      const cleanup = () => {
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };

      // Set timeout for request
      const timeout = setTimeout(() => {
        cleanup();
        delete fetchPromises[cacheKey];
        reject(new Error('Request timed out'));
      }, 10000);

      // JSONP callback
      window[callbackName] = (data) => {
        clearTimeout(timeout);
        cleanup();
        embedCache[cacheKey] = data;
        delete fetchPromises[cacheKey];
        resolve(data);
      };

      // Handle script load error
      script.onerror = () => {
        clearTimeout(timeout);
        cleanup();
        delete fetchPromises[cacheKey];
        reject(new Error('Failed to load gist'));
      };

      // GitHub's JSONP endpoint
      script.src = `https://gist.github.com/tushar-sharma/${gistId}.json?file=${encodeURIComponent(fileName)}&callback=${callbackName}`;
      document.head.appendChild(script);
    });

    return fetchPromises[cacheKey];
  }

  /**
   * Extract plain text content from gist HTML for copy functionality
   */
  function extractTextContent(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const lines = [];
    temp.querySelectorAll('.blob-code-inner').forEach(el => {
      lines.push(el.textContent);
    });

    return lines.join('\n');
  }

  /**
   * Initialize and load all gist containers on the page
   */
  async function initGists() {
    const containers = document.querySelectorAll('.gist-container');

    if (containers.length === 0) return;

    // Collect all fetch promises
    const fetchTasks = [];

    containers.forEach(container => {
      const gistId = container.dataset.gistId;
      const fileName = container.dataset.gistFile;

      const task = fetchGistEmbed(gistId, fileName)
        .then(data => ({ container, data, error: null }))
        .catch(error => ({ container, data: null, error }));

      fetchTasks.push(task);
    });

    // Wait for all fetches
    const results = await Promise.all(fetchTasks);

    // Process results
    results.forEach(({ container, data, error }) => {
      const copyButton = container.querySelector('.copy-button');
      const loadingEl = container.querySelector('.gist-loading');

      if (error) {
        if (loadingEl) {
          loadingEl.textContent = `Error loading gist: ${error.message}`;
          loadingEl.classList.add('gist-error');
        }
        return;
      }

      // Load the stylesheet (only happens once)
      if (data.stylesheet) {
        loadStylesheet(data.stylesheet);
      }

      // Remove loading indicator
      if (loadingEl) {
        loadingEl.remove();
      }

      // Insert the gist HTML before the copy button
      const gistWrapper = document.createElement('div');
      gistWrapper.innerHTML = data.div;
      if (copyButton) {
        container.insertBefore(gistWrapper.firstChild, copyButton);
      } else {
        container.appendChild(gistWrapper.firstChild);
      }

      // Store text content for copy functionality
      container.dataset.content = extractTextContent(data.div);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGists);
  } else {
    initGists();
  }
})();
