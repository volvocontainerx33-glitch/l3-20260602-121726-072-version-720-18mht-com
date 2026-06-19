(function () {
  var input = document.querySelector("[data-search-input]");
  var results = document.querySelector("[data-search-results]");
  var params = new URLSearchParams(window.location.search);
  var query = params.get("q") || "";

  if (input) {
    input.value = query;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function card(movie) {
    return [
      "<article class=\"movie-card\">",
      "<a class=\"poster\" href=\"" + escapeHtml(movie.url) + "\">",
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
      "</a>",
      "<div class=\"movie-info\">",
      "<div class=\"movie-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>",
      "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>",
      "<p>" + escapeHtml(movie.oneLine) + "</p>",
      "<div class=\"tag-row\"><span>" + escapeHtml(movie.genre) + "</span></div>",
      "</div>",
      "</article>"
    ].join("");
  }

  function render(value) {
    if (!results || !window.SEARCH_MOVIES) {
      return;
    }

    var words = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) {
      return;
    }

    var matched = window.SEARCH_MOVIES.filter(function (movie) {
      var haystack = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine].join(" ").toLowerCase();
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    }).slice(0, 120);

    var content = matched.length
      ? "<div class=\"section-head\"><div><span class=\"eyebrow\">搜索结果</span><h2>相关片单</h2></div></div><div class=\"movie-grid catalog-grid\">" + matched.map(card).join("") + "</div>"
      : "<div class=\"text-panel\"><h2>暂无匹配内容</h2><p>可尝试输入影片名、地区、年份、类型或标签中的关键词。</p></div>";

    results.innerHTML = content;
  }

  render(query);
})();
