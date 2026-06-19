(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }
    }

    var searchInput = document.querySelector('[data-page-search]');
    var searchList = document.querySelector('[data-search-list]');

    if (searchInput && searchList) {
        var items = Array.prototype.slice.call(searchList.children);
        searchInput.addEventListener('input', function () {
            var query = searchInput.value.trim().toLowerCase();
            items.forEach(function (item) {
                var text = item.textContent.toLowerCase() + ' ' + Array.prototype.map.call(item.attributes, function (attr) {
                    return attr.value.toLowerCase();
                }).join(' ');
                item.classList.toggle('is-filter-hidden', query && text.indexOf(query) === -1);
            });
        });
    }

    var playerShell = document.querySelector('[data-video-url]');
    if (playerShell) {
        var video = playerShell.querySelector('video');
        var playButton = playerShell.querySelector('[data-play]');
        var sourceUrl = playerShell.getAttribute('data-video-url');
        var playerReady = false;
        var hlsInstance = null;

        function attachVideo() {
            if (!video || !sourceUrl || playerReady) {
                return;
            }
            playerReady = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else {
                video.src = sourceUrl;
            }
        }

        function startVideo() {
            attachVideo();
            if (playButton) {
                playButton.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    if (playButton) {
                        playButton.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (playButton && video) {
            playButton.addEventListener('click', startVideo);
            video.addEventListener('click', function () {
                if (video.paused) {
                    startVideo();
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
