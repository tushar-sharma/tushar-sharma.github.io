// Adding a query paramater.
var url_string = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search; //window.location.href
var url = new URL(url_string);
var q = url.searchParams.get("q"); 


const searchClient = algoliasearch('0XJJCPHPDY', '618de85a39ad952f6e4c506d3c752777');

const search = instantsearch({
  searchClient: algoliasearch('0XJJCPHPDY', '618de85a39ad952f6e4c506d3c752777'),
  indexName: 'test_TELETRABAJOS',
  routing: {
    stateMapping: {
      stateToRoute: function (uiState) {
        return {
          q: uiState['test_TELETRABAJOS'].query,
        };
      },
      routeToState: function (routeState) {
        return {
          test_TELETRABAJOS: {
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
    placeholder: 'Búsqueda',
    autofocus: false,
    searchAsYouType: true,
  })
);


search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      empty: 'No se han encontrado resultados',
      // https://caniuse.com/#feat=template-literals
      item: '<div class="my-3"><h3><a href="{{ permalink }}">{{{ _highlightResult.title.value }}}</a></h3><small class="text-muted">{{ summary }}</small></div>'
    },
    transformData: {
      item: function(data) {
        data.lastmod_date = new Date(data.lastmod*1000).toISOString().slice(0,10)
        // https://caniuse.com/#search=MAP
        const tags = data.tags.map(function(value) {
          return value.toLowerCase().replace(' ', '-')
        })
        data.tags_text = tags.join(', ')
        return data
      }
    }
  })
);



search.addWidget(
  instantsearch.widgets.stats({
    container: "#stats",
    templates: {
      body(hit) {
        return `<span role="img" aria-label="emoji">⚡️</span> <strong>${hit.nbHits}</strong> resultados encontrados ${
          hit.query != "" ? `for <strong>"${hit.query}"</strong>` : ``
        } in <strong>${hit.processingTimeMS}ms</strong>`;
      }
    }
  })
);

search.addWidgets([
  instantsearch.widgets.refinementList({
    container: document.querySelector('#filtros'),
    attribute: 'categorias',
  })
]);

search.addWidgets([
  instantsearch.widgets.refinementList({
    container: document.querySelector('#tagcloud'),
    attribute: 'etiquetas',
  })
]);


search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
    maxPages: 20,
    // default is to scroll to 'body', here we disable this behavior
    scrollTo: false
  })
);

search.start();
