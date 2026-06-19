(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");
  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;
    var timer = null;

    function showHero(next) {
      index = next % slides.length;
      if (index < 0) {
        index = slides.length - 1;
      }
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function startHero() {
      timer = window.setInterval(function () {
        showHero(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        showHero(i);
        startHero();
      });
    });

    if (slides.length > 1) {
      startHero();
    }
  }

  var filterForm = document.querySelector("[data-filter-form]");
  if (filterForm) {
    var input = document.querySelector("[data-filter-input]");
    var yearSelect = document.querySelector("[data-year-select]");
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-filter-list] .filter-item"));

    function filterItems() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var y = yearSelect ? yearSelect.value : "";
      items.forEach(function (item) {
        var text = [item.dataset.title, item.dataset.genre, item.dataset.tags].join(" ").toLowerCase();
        var passText = !q || text.indexOf(q) !== -1;
        var passYear = !y || item.dataset.year === y;
        item.style.display = passText && passYear ? "" : "none";
      });
    }

    filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      filterItems();
    });
    if (input) {
      input.addEventListener("input", filterItems);
    }
    if (yearSelect) {
      yearSelect.addEventListener("change", filterItems);
    }
  }

  var resultBox = document.querySelector("[data-search-results]");
  if (resultBox && window.movieSearchIndex) {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get("q") || "").trim().toLowerCase();
    var formInput = document.querySelector(".search-page-form input");
    if (formInput) {
      formInput.value = params.get("q") || "";
    }
    var results = q
      ? window.movieSearchIndex.filter(function (item) {
          return [item.title, item.year, item.region, item.genre, item.one].join(" ").toLowerCase().indexOf(q) !== -1;
        }).slice(0, 120)
      : [];
    if (!q) {
      resultBox.innerHTML = '<div class="empty-state">输入关键词查找影片、地区、年份或类型。</div>';
      return;
    }
    if (!results.length) {
      resultBox.innerHTML = '<div class="empty-state">没有找到匹配影片。</div>';
      return;
    }
    resultBox.innerHTML = results.map(function (item) {
      return '<a class="mini-card" href="' + item.url + '">' +
        '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy">' +
        '<span><strong>' + item.title + '</strong><em>' + item.year + ' · ' + item.region + ' · ' + item.genre + '</em><em>' + item.one + '</em></span>' +
        '</a>';
    }).join("");
  }
})();
