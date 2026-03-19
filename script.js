const menuToggle = document.querySelector('.menu-toggle');
const slideoutMenu = document.querySelector('.slideout-menu');
const scrollBanner = document.getElementById('scroll-banner');
const scrollHeader = document.getElementById('scroll-header');
const pageBody = document.body;
const coverHero = document.querySelector('.cover-hero');
const embeddedVideo = document.querySelector('[data-video-embed]');
const scrollHeaderNav = document.querySelector('.scroll-header-nav');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const campGallery = document.getElementById('camp-gallery');
const galleryLightbox = document.getElementById('gallery-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxClose = document.querySelector('.lightbox-close');
const isHomeCover = pageBody.classList.contains('home-cover');
const bannerPinnedVisible = !isHomeCover && scrollBanner && scrollBanner.classList.contains('visible');

const ensureNavLink = (navElement, href, label) => {
  if (!navElement) return null;
  const existing = Array.from(navElement.querySelectorAll('a')).find((link) => link.getAttribute('href') === href);
  if (existing) return existing;
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  navElement.appendChild(link);
  return link;
};

const meetCoachesMenuLink = ensureNavLink(slideoutMenu, 'meet-coaches.html', 'Meet Our Coaches');
const donateMenuLink = ensureNavLink(slideoutMenu, 'donate.html', 'Donate');
const donateHeaderLink = ensureNavLink(scrollHeaderNav, 'donate.html', 'Donate');
const meetCoachesHeaderLink = ensureNavLink(scrollHeaderNav, 'meet-coaches.html', 'Meet The Coaches');

if (donateHeaderLink && scrollHeaderNav) {
  donateHeaderLink.classList.add('banner-donate-link');
  const registerHeaderLink = Array.from(scrollHeaderNav.querySelectorAll('a')).find(
    (link) => (link.getAttribute('href') || '').toLowerCase() === 'registration.html'
  );
  if (registerHeaderLink && registerHeaderLink !== donateHeaderLink) {
    scrollHeaderNav.insertBefore(donateHeaderLink, registerHeaderLink);
  }
}

if (currentPage.toLowerCase() === 'donate.html' && donateHeaderLink && scrollHeaderNav) {
  Array.from(scrollHeaderNav.querySelectorAll('a')).forEach((link) => link.classList.remove('is-active'));
  donateHeaderLink.classList.add('is-active');
}

if (currentPage.toLowerCase() === 'meet-coaches.html' && meetCoachesHeaderLink && scrollHeaderNav) {
  Array.from(scrollHeaderNav.querySelectorAll('a')).forEach((link) => link.classList.remove('is-active'));
  meetCoachesHeaderLink.classList.add('is-active');
}

if (currentPage.toLowerCase() === 'donate.html' && donateMenuLink && slideoutMenu) {
  donateMenuLink.setAttribute('aria-current', 'page');
}

if (currentPage.toLowerCase() === 'meet-coaches.html' && meetCoachesMenuLink && slideoutMenu) {
  meetCoachesMenuLink.setAttribute('aria-current', 'page');
}

const scrollHeaderToggle = document.querySelector('.scroll-header-toggle');

const toggleMenu = (triggerBtn) => {
  const isOpen = slideoutMenu.classList.toggle('open');
  if (menuToggle) menuToggle.setAttribute('aria-expanded', String(isOpen));
  if (scrollHeaderToggle) scrollHeaderToggle.setAttribute('aria-expanded', String(isOpen));
  slideoutMenu.setAttribute('aria-hidden', String(!isOpen));
};

if (menuToggle && slideoutMenu) {
  menuToggle.addEventListener('click', () => toggleMenu(menuToggle));
}

if (scrollHeaderToggle && slideoutMenu) {
  scrollHeaderToggle.addEventListener('click', () => toggleMenu(scrollHeaderToggle));
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

const sponsorTierInputs = document.querySelectorAll('input[name="Sponsorship Tier"]');
const customAmountInput = document.querySelector('input[name="Custom Sponsorship Amount"]');
const sponsorIntakeForm = document.querySelector('.sponsor-intake-form');
const legacyCoachCards = document.querySelectorAll('.legacy-coach-card');

if (sponsorTierInputs.length && customAmountInput) {
  const syncCustomAmountState = () => {
    const selectedTier = Array.from(sponsorTierInputs).find((input) => input.checked);
    const isCustom = Boolean(selectedTier && selectedTier.value === 'Custom Amount');
    customAmountInput.disabled = !isCustom;
    customAmountInput.required = isCustom;
    if (!isCustom) {
      customAmountInput.value = '';
    }
  };

  sponsorTierInputs.forEach((input) => input.addEventListener('change', syncCustomAmountState));
  syncCustomAmountState();
}

if (sponsorIntakeForm) {
  sponsorIntakeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const endpoint = sponsorIntakeForm.getAttribute('action');
    if (!endpoint) return;

    const submitButton = sponsorIntakeForm.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton ? submitButton.textContent : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(sponsorIntakeForm)
      });

      const redirectTarget = sponsorIntakeForm.getAttribute('data-success-redirect') || 'sponsor-submitted.html';
      window.location.href = redirectTarget;
    } catch (error) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText || 'Send Sponsor Registration';
      }

      sponsorIntakeForm.submit();
    }
  });
}

if (legacyCoachCards.length) {
  legacyCoachCards.forEach((card) => {
    card.addEventListener('click', () => {
      const willFlipOpen = !card.classList.contains('is-flipped');

      legacyCoachCards.forEach((otherCard) => {
        otherCard.classList.remove('is-flipped');
        otherCard.setAttribute('aria-pressed', 'false');
      });

      if (willFlipOpen) {
        card.classList.add('is-flipped');
        card.setAttribute('aria-pressed', 'true');
      }
    });
  });
}

if (campGallery && galleryLightbox && lightboxImage) {
  const galleryImages = Array.from(campGallery.querySelectorAll('img'));
  let currentIndex = 0;

  const renderLightboxImage = () => {
    const activeImage = galleryImages[currentIndex];
    if (!activeImage) return;
    lightboxImage.src = activeImage.src;
    lightboxImage.alt = activeImage.alt || 'Camp gallery photo';
  };

  const openLightbox = (startIndex) => {
    currentIndex = startIndex;
    renderLightboxImage();
    galleryLightbox.classList.add('open');
    galleryLightbox.setAttribute('aria-hidden', 'false');
    pageBody.classList.add('lightbox-open');
  };

  const closeLightbox = () => {
    galleryLightbox.classList.remove('open');
    galleryLightbox.setAttribute('aria-hidden', 'true');
    pageBody.classList.remove('lightbox-open');
    lightboxImage.src = '';
  };

  const showPrevious = () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    renderLightboxImage();
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    renderLightboxImage();
  };

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrevious);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNext);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  galleryLightbox.addEventListener('click', (event) => {
    if (event.target === galleryLightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    const isOpen = galleryLightbox.classList.contains('open');
    if (!isOpen) return;

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      showPrevious();
    } else if (event.key === 'ArrowRight') {
      showNext();
    }
  });
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