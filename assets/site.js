(function () {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            var opened = panel.classList.toggle('open');
            toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var heroIndex = 0;

    function showHero(index) {
        if (!slides.length) {
            return;
        }

        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === heroIndex);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === heroIndex);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showHero(heroIndex + 1);
        }, 5200);
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll('.card-filter'));
    filterInputs.forEach(function (input) {
        var scope = document.querySelector('[data-filter-scope]');
        var yearSelect = document.querySelector('.year-filter');

        function filterCards() {
            if (!scope) {
                return;
            }

            var keyword = input.value.trim().toLowerCase();
            var year = yearSelect ? yearSelect.value : '';
            var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-region')
                ].join(' ').toLowerCase();
                var cardYear = card.getAttribute('data-year') || '';
                var okKeyword = !keyword || text.indexOf(keyword) !== -1;
                var okYear = !year || cardYear.indexOf(year) !== -1;
                card.classList.toggle('is-hidden', !(okKeyword && okYear));
            });
        }

        input.addEventListener('input', filterCards);
        if (yearSelect) {
            yearSelect.addEventListener('change', filterCards);
        }
    });

    var searchInput = document.getElementById('siteSearchInput');
    var searchResults = document.getElementById('searchResults');

    function paramsQuery() {
        return new URLSearchParams(window.location.search).get('q') || '';
    }

    function searchItems(query) {
        var items = window.SEARCH_ITEMS || [];
        var q = query.trim().toLowerCase();

        if (!searchResults) {
            return;
        }

        if (!q) {
            searchResults.innerHTML = '';
            return;
        }

        var results = items.filter(function (item) {
            return item.text.indexOf(q) !== -1;
        }).slice(0, 80);

        searchResults.innerHTML = results.map(function (item) {
            return [
                '<a class="search-result-item" href="' + item.url + '">',
                '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '">',
                '<span>',
                '<h2>' + escapeHtml(item.title) + '</h2>',
                '<p>' + escapeHtml(item.meta) + '</p>',
                '</span>',
                '<span class="text-btn">观看</span>',
                '</a>'
            ].join('');
        }).join('');
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    if (searchInput) {
        var initial = paramsQuery();
        searchInput.value = initial;
        searchItems(initial);
        searchInput.addEventListener('input', function () {
            searchItems(searchInput.value);
        });
    }
})();
