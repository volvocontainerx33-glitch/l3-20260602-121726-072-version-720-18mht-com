(() => {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', () => {
            mobileNav.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let heroIndex = 0;

    const showHero = (index) => {
        if (!slides.length) {
            return;
        }

        heroIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, current) => {
            slide.classList.toggle('is-active', current === heroIndex);
        });
        dots.forEach((dot, current) => {
            dot.classList.toggle('is-active', current === heroIndex);
        });
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showHero(index));
    });

    if (slides.length > 1) {
        window.setInterval(() => showHero(heroIndex + 1), 5000);
    }

    const input = document.querySelector('[data-filter-input]');
    const typeSelect = document.querySelector('[data-filter-type]');
    const cards = Array.from(document.querySelectorAll('[data-card]'));

    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');

    if (input && queryParam) {
        input.value = queryParam;
    }

    const applyFilter = () => {
        const query = input ? input.value.trim().toLowerCase() : '';
        const type = typeSelect ? typeSelect.value : '';
        cards.forEach((card) => {
            const text = (card.getAttribute('data-search') || '').toLowerCase();
            const cardType = card.getAttribute('data-type') || '';
            const matchQuery = !query || text.includes(query);
            const matchType = !type || cardType === type;
            card.classList.toggle('is-hidden', !(matchQuery && matchType));
        });
    };

    if (input || typeSelect) {
        if (input) {
            input.addEventListener('input', applyFilter);
        }
        if (typeSelect) {
            typeSelect.addEventListener('change', applyFilter);
        }
        applyFilter();
    }
})();
