// Adding a query paramater.
var url_string = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search; //window.location.href
var url = new URL(url_string);
var q = url.searchParams.get("q"); 


const searchClient = algoliasearch('0XJJCPHPDY', '618de85a39ad952f6e4c506d3c752777');

const search = instantsearch({
  searchClient: algoliasearch('0XJJCPHPDY', '618de85a39ad952f6e4c506d3c752777'),
  indexName: 'randomwits',
  routing: {
    stateMapping: {
      stateToRoute: function (uiState) {
        return {
          q: uiState['randomwits'].query,
        };
      },
      routeToState: function (routeState) {
        return {
          randomwits: {
            query: routeState.q,
          },
        };
      },
    },
  },
});


search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'Search Randomwits...',
    autofocus: false,
    searchAsYouType: true,
  })
);


search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      empty: 'No results found',
      item: `
        <div class="my-3">
          <h3><a href="{{ url }}">{{{ _highlightResult.title.value }}}</a></h3>
          <small class="text-muted">{{ summary }}</small>
        </div>
      `
    },
    transformData: {
      item: function(data) {
        data.lastmod_date = new Date(data.lastmod * 1000).toISOString().slice(0, 10);
        const tags = data.tags.map(function(value) {
          return value.toLowerCase().replace(' ', '-');
        });
        data.tags_text = tags.join(', ');
        return data;
      }
    }
  })
);



search.addWidget(
  instantsearch.widgets.stats({
    container: "#stats",
    templates: {
      body(hit) {
        return `<span role="img" aria-label="emoji">⚡️</span> <strong>${hit.nbHits}</strong> Results found ${
          hit.query != "" ? `for <strong>"${hit.query}"</strong>` : ``
        } in <strong>${hit.processingTimeMS}ms</strong>`;
      }
    }
  })
);

search.addWidgets([
  instantsearch.widgets.refinementList({
    container: document.querySelector('#filtros'),
    attribute: 'categories',
  })
]);

search.addWidgets([
  instantsearch.widgets.refinementList({
    container: document.querySelector('#tagcloud'),
    attribute: 'labels',
  })
]);


search.addWidget(
  instantsearch.widgets.pagination({
    container: '.pagination-wrapper',
    maxPages: 10,
    // default is to scroll to 'body', here we disable this behavior
    scrollTo: false,
  })
);

search.start();
