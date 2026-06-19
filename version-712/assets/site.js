(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function startSlider() {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        showSlide(index);
        startSlider();
      });
    });

    if (slides.length > 1) {
      startSlider();
    }
  }

  var filterInput = document.querySelector('[data-filter-input]');

  if (filterInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    filterInput.addEventListener('input', function () {
      var value = filterInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search-text') || '').toLowerCase();
        card.classList.toggle('hide', value !== '' && text.indexOf(value) === -1);
      });
    });
  }

  var searchParams = new URLSearchParams(window.location.search);
  var query = searchParams.get('q');

  if (query && filterInput) {
    filterInput.value = query;
    filterInput.dispatchEvent(new Event('input'));
  }
})();

function initMoviePlayer(url) {
  var video = document.querySelector('[data-video-player]');
  var cover = document.querySelector('[data-play-cover]');
  var loaded = false;
  var hls = null;

  if (!video || !cover || !url) {
    return;
  }

  function loadVideo() {
    if (loaded) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }

    loaded = true;
  }

  function playVideo() {
    loadVideo();
    cover.classList.add('hidden');
    video.controls = true;
    var playTask = video.play();

    if (playTask && typeof playTask.catch === 'function') {
      playTask.catch(function () {
        cover.classList.remove('hidden');
      });
    }
  }

  cover.addEventListener('click', playVideo);
  video.addEventListener('click', function () {
    if (!loaded) {
      playVideo();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
}
