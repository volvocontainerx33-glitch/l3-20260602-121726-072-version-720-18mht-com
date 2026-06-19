(() => {
    const video = document.querySelector('[data-player-video]');
    const overlay = document.querySelector('[data-player-overlay]');
    const button = document.querySelector('[data-player-button]');
    const source = typeof currentVideoSource !== 'undefined' ? currentVideoSource : '';
    let hls = null;

    const loadSource = () => {
        if (!video || !source || video.dataset.ready === '1') {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }

        video.dataset.ready = '1';
    };

    const startPlay = () => {
        if (!video) {
            return;
        }

        loadSource();

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        const promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }
    };

    if (button) {
        button.addEventListener('click', startPlay);
    }

    if (video) {
        video.addEventListener('click', () => {
            if (video.paused) {
                startPlay();
            }
        });
    }

    window.addEventListener('beforeunload', () => {
        if (hls) {
            hls.destroy();
        }
    });
})();
