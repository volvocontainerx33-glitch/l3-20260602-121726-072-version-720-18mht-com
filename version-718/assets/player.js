(function () {
  var video = document.getElementById("movie-player");
  var overlay = document.querySelector(".player-overlay");
  var button = document.querySelector(".player-start");
  if (!video || typeof playerUrl !== "string" || !playerUrl) {
    return;
  }

  var loaded = false;
  var hls = null;

  function loadVideo() {
    if (loaded) {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playerUrl;
      loaded = true;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true });
      hls.loadSource(playerUrl);
      hls.attachMedia(video);
      loaded = true;
      return;
    }
    video.src = playerUrl;
    loaded = true;
  }

  function playVideo() {
    loadVideo();
    if (overlay) {
      overlay.classList.add("hidden");
    }
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      playVideo();
    });
  }
  if (overlay) {
    overlay.addEventListener("click", playVideo);
  }
  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  });
  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("hidden");
    }
  });
  window.addEventListener("beforeunload", function () {
    if (hls && typeof hls.destroy === "function") {
      hls.destroy();
    }
  });
})();
