function ready(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

ready(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
  inputs.forEach(function (input) {
    var targetName = input.getAttribute('data-filter-input');
    var scope = document.querySelector('[data-search-scope="' + targetName + '"]') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search]'));

    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        card.classList.toggle('is-filtered-out', value.length > 0 && haystack.indexOf(value) === -1);
      });
    });
  });
});

function setupMoviePlayer(sourceUrl) {
  var video = document.getElementById('movie-video');
  var button = document.getElementById('movie-play-button');
  var cover = document.querySelector('.player-cover');
  var hlsInstance = null;

  if (!video || !sourceUrl) {
    return;
  }

  function hideCover() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  }

  function startVideo() {
    hideCover();

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = sourceUrl;
      }
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.play().catch(function () {});
      }
      return;
    }

    if (!video.src) {
      video.src = sourceUrl;
    }
    video.play().catch(function () {});
  }

  if (button) {
    button.addEventListener('click', startVideo);
  }

  if (cover && cover !== button) {
    cover.addEventListener('click', startVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startVideo();
    }
  });

  video.addEventListener('play', hideCover);
}
