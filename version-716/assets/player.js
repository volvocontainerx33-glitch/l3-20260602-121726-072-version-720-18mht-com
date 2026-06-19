(function () {
  var player = document.querySelector('[data-player]');
  if (!player) {
    return;
  }

  var video = player.querySelector('video');
  var playButton = player.querySelector('[data-play]');
  var streamUrl = player.getAttribute('data-stream');
  var ready = false;
  var hls = null;

  function prepareVideo() {
    if (ready || !video || !streamUrl) {
      return;
    }
    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return;
    }

    video.src = streamUrl;
  }

  function startVideo() {
    prepareVideo();
    player.classList.add('is-playing');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (playButton) {
    playButton.addEventListener('click', startVideo);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        startVideo();
      }
    });
    video.addEventListener('play', function () {
      player.classList.add('is-playing');
    });
  }

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
