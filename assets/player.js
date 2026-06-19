(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('.js-player'));

    players.forEach(function (wrap) {
        var video = wrap.querySelector('video');
        var cover = wrap.querySelector('.player-cover');
        var stream = wrap.getAttribute('data-stream');
        var prepared = false;

        function prepare() {
            if (prepared || !video || !stream) {
                return;
            }

            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                return;
            }

            video.src = stream;
        }

        function play() {
            prepare();
            if (cover) {
                cover.classList.add('hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                if (cover) {
                    cover.classList.add('hidden');
                }
            });
            video.addEventListener('loadedmetadata', function () {
                if (cover && !video.paused) {
                    cover.classList.add('hidden');
                }
            });
        }
    });
})();
