const form = document.querySelector("#pagefind-search-form");
const input = document.querySelector("#pagefind-search-input");
const status = document.querySelector("#pagefind-search-status");
const results = document.querySelector("#pagefind-search-results");
const pagination = document.querySelector("#pagefind-search-pagination");
const modeInputs = [...document.querySelectorAll('input[name="mode"]')];
const pagefindUrl = new URL("../pagefind/pagefind.js", import.meta.url);
const fuzzyIndexUrl = new URL("../search/fuzzy-index.json", import.meta.url);
const pageSize = 12;
let resultRefs = [];
let activeQuery = "";
let activeMode = "keyword";
let currentPage = 1;
let searchVersion = 0;
let debounceTimer;
let pagefindPromise;
let fuzzyIndexPromise;

const tokenize = (text) => (text.toLocaleLowerCase().match(/[\p{L}\p{N}_$.-]+/gu) || [])
  .filter((token) => token.length > 1);

const loadPagefind = () => {
  pagefindPromise ||= import(pagefindUrl.href).then(async (pagefind) => {
    await pagefind.init();
    return pagefind;
  });
  return pagefindPromise;
};

const loadFuzzyIndex = () => {
  fuzzyIndexPromise ||= fetch(fuzzyIndexUrl).then(async (response) => {
    if (!response.ok) throw new Error(`Fuzzy index returned ${response.status}`);
    const payload = await response.json();
    const vocabulary = new Map();

    payload.documents.forEach((document, documentIndex) => {
      const weights = new Map();
      tokenize(document.content).forEach((token) => {
        weights.set(token, Math.min(3, (weights.get(token) || 0) + 1));
      });
      tokenize(document.title).forEach((token) => {
        weights.set(token, (weights.get(token) || 0) + 8);
      });
      weights.forEach((weight, token) => {
        if (!vocabulary.has(token)) vocabulary.set(token, []);
        vocabulary.get(token).push([documentIndex, weight]);
      });
    });

    return { documents: payload.documents, vocabulary };
  });
  return fuzzyIndexPromise;
};

const editDistanceWithin = (left, right, limit) => {
  if (Math.abs(left.length - right.length) > limit) return limit + 1;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    let rowMinimum = row;
    for (let column = 1; column <= right.length; column += 1) {
      const value = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
      current.push(value);
      rowMinimum = Math.min(rowMinimum, value);
    }
    if (rowMinimum > limit) return limit + 1;
    previous = current;
  }
  return previous[right.length];
};

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const fuzzyExcerpt = (content, matchedTokens) => {
  const lowerContent = content.toLocaleLowerCase();
  const positions = [...matchedTokens].map((token) => lowerContent.indexOf(token)).filter((position) => position >= 0);
  const center = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, center - 90);
  const end = Math.min(content.length, start + 260);
  let excerpt = `${start ? "…" : ""}${content.slice(start, end).trim()}${end < content.length ? "…" : ""}`;
  excerpt = escapeHtml(excerpt);
  const terms = [...matchedTokens].sort((a, b) => b.length - a.length).map(escapeHtml).map(escapeRegExp);
  if (terms.length) excerpt = excerpt.replace(new RegExp(`(${terms.join("|")})`, "giu"), "<mark>$1</mark>");
  return excerpt;
};

const fuzzySearch = async (query) => {
  const { documents, vocabulary } = await loadFuzzyIndex();
  const queryTokens = [...new Set(tokenize(query))];
  if (!queryTokens.length) return [];
  const scoredDocuments = new Map();

  queryTokens.forEach((queryToken, queryIndex) => {
    const limit = queryToken.length >= 8 ? 2 : 1;
    vocabulary.forEach((postings, candidate) => {
      let similarity = 0;
      if (candidate === queryToken) similarity = 3;
      else if (queryToken.length >= 3 && candidate.startsWith(queryToken)) similarity = 2;
      else if (queryToken.length >= 4 && editDistanceWithin(queryToken, candidate, limit) <= limit) similarity = 1;
      if (!similarity) return;

      postings.forEach(([documentIndex, weight]) => {
        const entry = scoredDocuments.get(documentIndex) || { score: 0, queryTokens: new Set(), matchedTokens: new Set() };
        entry.score += similarity * weight;
        entry.queryTokens.add(queryIndex);
        entry.matchedTokens.add(candidate);
        scoredDocuments.set(documentIndex, entry);
      });
    });
  });

  return [...scoredDocuments.entries()]
    .filter(([, entry]) => entry.queryTokens.size === queryTokens.length)
    .sort((left, right) => right[1].score - left[1].score)
    .map(([documentIndex, entry]) => {
      const document = documents[documentIndex];
      const result = {
        url: document.url,
        excerpt: fuzzyExcerpt(document.content, entry.matchedTokens),
        meta: { title: document.title, date: document.date, tags: document.tags },
      };
      return { data: async () => result };
    });
};

const setStatus = (message) => { status.textContent = message; };

const renderResult = (result) => {
  const item = document.createElement("article");
  item.className = "pagefind-search__result";
  const heading = document.createElement("h2");
  const link = document.createElement("a");
  link.href = result.url;
  link.textContent = result.meta.title || "Untitled post";
  heading.appendChild(link);
  const excerpt = document.createElement("p");
  excerpt.className = "pagefind-search__excerpt";
  excerpt.innerHTML = result.excerpt;
  const meta = document.createElement("p");
  meta.className = "pagefind-search__meta";
  const date = result.meta.date ? new Date(result.meta.date) : null;
  if (date && !Number.isNaN(date.valueOf())) {
    meta.textContent = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(date);
  }
  if (result.meta.tags) meta.textContent += `${meta.textContent ? " · " : ""}${result.meta.tags}`;
  item.append(heading);
  if (meta.textContent) item.append(meta);
  item.append(excerpt);
  return item;
};

const updateUrl = (query, page, mode = activeMode) => {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
  if (query && page > 1) url.searchParams.set("page", page); else url.searchParams.delete("page");
  if (mode === "fuzzy") url.searchParams.set("mode", mode); else url.searchParams.delete("mode");
  window.history.replaceState({}, "", url);
};

const createPageButton = (label, page, options = {}) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.dataset.page = page;
  if (options.current) button.setAttribute("aria-current", "page");
  if (options.label) button.setAttribute("aria-label", options.label);
  if (options.disabled) button.disabled = true;
  return button;
};

const renderPagination = (totalPages) => {
  pagination.replaceChildren();
  pagination.hidden = totalPages <= 1;
  if (totalPages <= 1) return;
  pagination.appendChild(createPageButton("Previous", currentPage - 1, { disabled: currentPage === 1, label: "Previous results page" }));
  const first = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const last = Math.min(totalPages, Math.max(currentPage + 2, 5));
  if (first > 1) {
    pagination.appendChild(createPageButton("1", 1, { label: "Results page 1" }));
    if (first > 2) pagination.append("…");
  }
  for (let page = first; page <= last; page += 1) {
    pagination.appendChild(createPageButton(String(page), page, { current: page === currentPage, label: `Results page ${page}` }));
  }
  if (last < totalPages) {
    if (last < totalPages - 1) pagination.append("…");
    pagination.appendChild(createPageButton(String(totalPages), totalPages, { label: `Results page ${totalPages}` }));
  }
  pagination.appendChild(createPageButton("Next", currentPage + 1, { disabled: currentPage === totalPages, label: "Next results page" }));
};

const renderPage = async (page, { scroll = false } = {}) => {
  const totalPages = Math.max(1, Math.ceil(resultRefs.length / pageSize));
  currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const matches = await Promise.all(resultRefs.slice(start, start + pageSize).map((match) => match.data()));
  results.replaceChildren(...matches.map(renderResult));
  renderPagination(totalPages);
  updateUrl(activeQuery, currentPage);
  if (resultRefs.length) {
    setStatus(`Showing ${start + 1}–${start + matches.length} of ${resultRefs.length} ${activeMode} results for “${activeQuery}”.`);
  } else if (activeMode === "keyword") {
    setStatus(`No keyword results for “${activeQuery}”. Try Fuzzy for spelling variations.`);
  } else {
    setStatus(`No fuzzy results found for “${activeQuery}”.`);
  }
  if (scroll) status.scrollIntoView({ behavior: "smooth", block: "start" });
};

const runSearch = async (query, page = 1, mode = activeMode, updateHistory = true) => {
  const version = ++searchVersion;
  activeQuery = query;
  activeMode = mode;
  results.replaceChildren();
  pagination.hidden = true;
  resultRefs = [];
  modeInputs.forEach((radio) => { radio.checked = radio.value === activeMode; });
  if (updateHistory) updateUrl(query, page, mode);
  if (!query) { setStatus("Enter a word, phrase, or code identifier to begin."); return; }
  form.setAttribute("aria-busy", "true");
  setStatus(activeMode === "fuzzy" ? "Loading fuzzy search…" : "Searching…");
  try {
    if (activeMode === "fuzzy") {
      resultRefs = await fuzzySearch(query);
    } else {
      const pagefind = await loadPagefind();
      resultRefs = (await pagefind.search(query)).results;
    }
    if (version !== searchVersion) return;
    await renderPage(page);
  } catch (error) {
    console.error("Search failed", error);
    setStatus("Search is temporarily unavailable. Please try again.");
  } finally {
    form.removeAttribute("aria-busy");
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  window.clearTimeout(debounceTimer);
  runSearch(input.value.trim(), 1);
});
input.addEventListener("input", () => {
  window.clearTimeout(debounceTimer);
  const query = input.value.trim();
  debounceTimer = window.setTimeout(() => runSearch(query, 1), query ? 180 : 0);
});
modeInputs.forEach((radio) => radio.addEventListener("change", () => {
  if (radio.checked) runSearch(input.value.trim(), 1, radio.value);
}));
pagination.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-page]");
  if (button && !button.disabled) await renderPage(Number(button.dataset.page), { scroll: true });
});

const initialParams = new URLSearchParams(window.location.search);
const initialQuery = initialParams.get("q")?.trim() || "";
const initialPage = Number.parseInt(initialParams.get("page"), 10) || 1;
const initialMode = initialParams.get("mode") === "fuzzy" ? "fuzzy" : "keyword";
input.value = initialQuery;
runSearch(initialQuery, initialPage, initialMode, false);

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
  if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    input.focus();
  }
});
if ("requestIdleCallback" in window) window.requestIdleCallback(() => loadPagefind(), { timeout: 1500 });
