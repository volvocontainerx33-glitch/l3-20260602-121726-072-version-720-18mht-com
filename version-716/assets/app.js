(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function setHero(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('active', current === index);
      });
    }

    function runHero() {
      clearInterval(timer);
      timer = setInterval(function () {
        setHero(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setHero(Number(dot.getAttribute('data-hero-dot')) || 0);
        runHero();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        setHero(index - 1);
        runHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setHero(index + 1);
        runHero();
      });
    }

    setHero(0);
    runHero();
  }

  var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-card-scope]'));
  var localSearch = document.querySelector('[data-local-search]') || document.querySelector('[data-library-search]');
  var filterBar = document.querySelector('[data-filter-bar]');
  var empty = document.querySelector('[data-filter-empty]');
  var activeFilter = 'all';

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function applyFilters() {
    var query = normalize(localSearch ? localSearch.value : '');
    var visible = 0;
    scopes.forEach(function (scope) {
      Array.prototype.slice.call(scope.querySelectorAll('[data-card]')).forEach(function (card) {
        var text = normalize(card.getAttribute('data-title'));
        var type = normalize(card.getAttribute('data-type'));
        var matchText = !query || text.indexOf(query) !== -1;
        var matchFilter = activeFilter === 'all' || type.indexOf(normalize(activeFilter)) !== -1 || text.indexOf(normalize(activeFilter)) !== -1;
        var show = matchText && matchFilter;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });
    });
    if (empty) {
      empty.classList.toggle('show', visible === 0);
    }
  }

  if (localSearch) {
    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
      localSearch.value = params.get('q');
    }
    localSearch.addEventListener('input', applyFilters);
  }

  if (filterBar) {
    Array.prototype.slice.call(filterBar.querySelectorAll('[data-filter-value]')).forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter-value') || 'all';
        Array.prototype.slice.call(filterBar.querySelectorAll('[data-filter-value]')).forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilters();
      });
    });
  }

  if (scopes.length) {
    applyFilters();
  }
})();
