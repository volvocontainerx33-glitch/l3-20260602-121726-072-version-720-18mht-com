(function () {
  function initPlayer(player) {
    var video = player.querySelector("video");
    var button = player.querySelector("[data-play-button]");
    var hlsSource = player.getAttribute("data-hls");
    var mp4Source = player.getAttribute("data-mp4");
    var usedFallback = false;

    function useMp4() {
      if (usedFallback || !mp4Source) {
        return;
      }
      usedFallback = true;
      video.src = mp4Source;
      video.load();
    }

    function setupSource() {
      if (!video || !hlsSource) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 60
        });
        hls.loadSource(hlsSource);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            hls.destroy();
            useMp4();
          }
        });
        window.setTimeout(function () {
          if (!video.currentSrc && mp4Source) {
            useMp4();
          }
        }, 1200);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsSource;
      } else {
        useMp4();
      }
    }

    setupSource();

    if (button) {
      button.addEventListener("click", function () {
        if (!video.currentSrc && mp4Source) {
          useMp4();
        }
        video.play().catch(function () {
          useMp4();
          video.play().catch(function () {});
        });
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });

    video.addEventListener("play", function () {
      player.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      player.classList.remove("is-playing");
    });
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-video-player]")).forEach(initPlayer);
})();
