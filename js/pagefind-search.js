const form = document.querySelector("#pagefind-search-form");
const input = document.querySelector("#pagefind-search-input");
const status = document.querySelector("#pagefind-search-status");
const results = document.querySelector("#pagefind-search-results");
const pagination = document.querySelector("#pagefind-search-pagination");
const pagefindUrl = new URL("../pagefind/pagefind.js", import.meta.url);
const pageSize = 12;
let resultRefs = [];
let activeQuery = "";
let currentPage = 1;
let searchVersion = 0;
let debounceTimer;
let pagefindPromise;

const loadPagefind = () => {
  pagefindPromise ||= import(pagefindUrl.href).then(async (pagefind) => {
    await pagefind.init();
    return pagefind;
  });
  return pagefindPromise;
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

const updateUrl = (query, page) => {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
  if (query && page > 1) url.searchParams.set("page", page); else url.searchParams.delete("page");
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
  setStatus(resultRefs.length
    ? `Showing ${start + 1}–${start + matches.length} of ${resultRefs.length} results for “${activeQuery}”.`
    : `No results found for “${activeQuery}”.`);
  if (scroll) status.scrollIntoView({ behavior: "smooth", block: "start" });
};

const runSearch = async (query, page = 1, updateHistory = true) => {
  const version = ++searchVersion;
  results.replaceChildren();
  pagination.hidden = true;
  resultRefs = [];
  activeQuery = query;
  if (updateHistory) updateUrl(query, page);
  if (!query) { setStatus("Enter a word, phrase, or code identifier to begin."); return; }
  form.setAttribute("aria-busy", "true");
  setStatus("Searching…");
  try {
    const pagefind = await loadPagefind();
    const response = await pagefind.search(query);
    if (version !== searchVersion) return;
    resultRefs = response.results;
    await renderPage(page);
  } catch (error) {
    console.error("Pagefind search failed", error);
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
pagination.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-page]");
  if (button && !button.disabled) await renderPage(Number(button.dataset.page), { scroll: true });
});

const initialParams = new URLSearchParams(window.location.search);
const initialQuery = initialParams.get("q")?.trim() || "";
const initialPage = Number.parseInt(initialParams.get("page"), 10) || 1;
input.value = initialQuery;
runSearch(initialQuery, initialPage, false);

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
  if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    input.focus();
  }
});
if ("requestIdleCallback" in window) window.requestIdleCallback(() => loadPagefind(), { timeout: 1500 });
