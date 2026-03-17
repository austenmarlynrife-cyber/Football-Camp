const menuToggle = document.querySelector('.menu-toggle');
const slideoutMenu = document.querySelector('.slideout-menu');
const scrollBanner = document.getElementById('scroll-banner');
const scrollHeader = document.getElementById('scroll-header');
const pageBody = document.body;
const coverHero = document.querySelector('.cover-hero');
const embeddedVideo = document.querySelector('[data-video-embed]');
const isHomeCover = pageBody.classList.contains('home-cover');
const bannerPinnedVisible = !isHomeCover && scrollBanner && scrollBanner.classList.contains('visible');

if (menuToggle && slideoutMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = slideoutMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    slideoutMenu.setAttribute('aria-hidden', String(!isOpen));
  });
}

if (embeddedVideo) {
  const baseSrc = embeddedVideo.getAttribute('data-base-src');
  const autoplaySrc = embeddedVideo.getAttribute('data-autoplay-src');
  let autoplayEnabled = false;

  const syncVideoPlaybackMode = (shouldAutoplay) => {
    if (!baseSrc || !autoplaySrc) return;
    if (shouldAutoplay && !autoplayEnabled) {
      embeddedVideo.src = autoplaySrc;
      autoplayEnabled = true;
    } else if (!shouldAutoplay && autoplayEnabled) {
      embeddedVideo.src = baseSrc;
      autoplayEnabled = false;
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        syncVideoPlaybackMode(Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= 0.6));
      },
      { threshold: [0, 0.6, 1] }
    );

    observer.observe(embeddedVideo);
  }
}

const onScroll = () => {
  const threshold = isHomeCover && coverHero ? Math.max(260, Math.floor(coverHero.offsetHeight * 0.7)) : 260;
  const hasPassedCover = window.scrollY > threshold;

  if (isHomeCover && coverHero) {
    const fadeSpan = Math.max(360, Math.floor(coverHero.offsetHeight * 0.9));
    const progress = Math.min(1, Math.max(0, window.scrollY / fadeSpan));
    const heroOpacity = 1 - (progress * 0.88);
    const bgOpacity = progress * 0.22;

    pageBody.style.setProperty('--hero-athlete-opacity', heroOpacity.toFixed(3));
    pageBody.style.setProperty('--bg-athlete-opacity', bgOpacity.toFixed(3));
  }

  if (scrollBanner && !bannerPinnedVisible) {
    if (hasPassedCover) {
      scrollBanner.classList.add('visible');
    } else {
      scrollBanner.classList.remove('visible');
    }
  }

  if (scrollHeader && isHomeCover) {
    if (hasPassedCover) {
      scrollHeader.classList.add('visible');
    } else {
      scrollHeader.classList.remove('visible');
    }
  }

  if (isHomeCover) {
    if (hasPassedCover) {
      pageBody.classList.add('reveal-ui');
    } else {
      pageBody.classList.remove('reveal-ui');
      if (slideoutMenu) {
        slideoutMenu.classList.remove('open');
        slideoutMenu.setAttribute('aria-hidden', 'true');
      }
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }
};

window.addEventListener('scroll', onScroll);
onScroll();