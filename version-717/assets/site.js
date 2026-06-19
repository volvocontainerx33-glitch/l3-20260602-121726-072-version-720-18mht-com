(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    var carousel = document.querySelector("[data-carousel]");
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
      var prev = carousel.querySelector(".hero-prev");
      var next = carousel.querySelector(".hero-next");
      var index = 0;
      var timer = null;

      function show(target) {
        index = (target + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }

      function start() {
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function restart() {
        window.clearInterval(timer);
        start();
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-target")) || 0);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }

      start();
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    var filters = Array.prototype.slice.call(document.querySelectorAll(".local-filter"));

    function filterCards(input) {
      var scope = document.querySelector(".filter-scope");
      if (!scope) {
        return;
      }
      var query = input.value.trim().toLowerCase();
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-genre") || "",
          card.textContent || ""
        ].join(" ").toLowerCase();
        card.classList.toggle("is-hidden-card", query && text.indexOf(query) === -1);
      });
    }

    filters.forEach(function (input) {
      if (initialQuery && input.classList.contains("search-query-input")) {
        input.value = initialQuery;
      }
      input.addEventListener("input", function () {
        filterCards(input);
      });
      if (input.value) {
        filterCards(input);
      }
    });
  });
})();
