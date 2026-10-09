/* =========================================================================
   BAVA'S BIRTHDAY SURPRISE — script.js
   Vanilla JavaScript + Bootstrap 5. Handles:
   1. Floating hearts + stars
   2. Welcome screen / gift box opening
   3. Smooth scrolling with navbar offset
   4. Photo gallery modal (lightbox)
   5. Scroll reveal animations
   6. Interactive birthday cake + confetti
   7. "Send a Hug" heart burst
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------ tiny helpers */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const random = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const HEARTS = ['❤️', '🩷', '💗', '🎀', '💖', '❤️', '🩷', '♥️'];


  /* ======================================================================
     1. BACKGROUND FLOATING HEARTS
     ====================================================================== */
  function createFloatingHearts(count = 14) {
    const layer = $('#heartsLayer');
    if (!layer) return;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = HEARTS[i % HEARTS.length];
      heart.style.left = random(0, 100) + '%';
      heart.style.fontSize = random(14, 34) + 'px';
      heart.style.animationDuration = random(11, 23) + 's';
      heart.style.animationDelay = random(0, 12) + 's';
      layer.appendChild(heart);
    }
  }


  /* ======================================================================
     2. WELCOME SCREEN — open the gift and reveal the site
     ====================================================================== */
  const welcome = $('#welcome');
  const mainSite = $('#mainSite');
  const giftBox = $('#giftBox');
  const openBtn = $('#openBtn');
  let opening = false;

  function openSurprise() {
    if (opening) return;
    opening = true;

    giftBox.classList.add('is-open');           // lid flies off
    confettiBurst(30);

    // Give the little animation a moment, then reveal the website.
    window.setTimeout(function () {
      welcome.classList.add('is-leaving');
      mainSite.classList.remove('d-none');
      document.body.classList.remove('no-scroll');
      window.scrollTo({ top: 0, behavior: 'auto' });

      window.setTimeout(function () {
        welcome.classList.add('d-none');
        observeReveals();                        // reveal what is visible now
      }, 750);
    }, 1200);
  }

  if (openBtn) openBtn.addEventListener('click', openSurprise);


  /* ======================================================================
     3. SMOOTH SCROLLING (with sticky navbar offset)
     ====================================================================== */
  function scrollToTarget(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    const nav = $('.main-nav');
    const offset = nav ? nav.offsetHeight + 6 : 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  // Buttons like "A Little Message For You"
  $$('.scroll-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      scrollToTarget(btn.dataset.target);
    });
  });

  // Navbar links + brand
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      e.preventDefault();
      scrollToTarget(id);

      // Close the mobile menu after tapping a link
      const openMenu = $('.navbar-collapse.show');
      if (openMenu && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(openMenu).hide();
      }
    });
  });


  /* ======================================================================
     4. PHOTO GALLERY MODAL (lightbox)
     ====================================================================== */
  const photoModalEl = $('#photoModal');
  let photoModal = null;
  if (photoModalEl && window.bootstrap) {
    photoModal = new window.bootstrap.Modal(photoModalEl);
  }

  $$('.gallery-item[data-img]').forEach(function (item) {
    item.addEventListener('click', function () {
      const img = $('#photoModalImg');
      const caption = $('#photoModalCaption');
      const src = item.dataset.img;
      const text = item.dataset.caption || '';

      img.src = src;
      img.alt = text || 'Our memory';
      caption.textContent = text;

      if (photoModal) photoModal.show();
    });
  });


  /* ======================================================================
     5. SCROLL REVEAL ANIMATIONS
     ====================================================================== */
  let revealObserver = null;

  function observeReveals() {
    if (!revealObserver) return;
    $$('.reveal:not(.is-visible)').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  function initRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    observeReveals();
  }


  /* ======================================================================
     6. MIDNIGHT STARS
     ====================================================================== */
  function createStars(count = 42) {
    const layer = $('#stars');
    if (!layer) return;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('i');
      star.style.top = random(0, 100) + '%';
      star.style.left = random(0, 100) + '%';
      star.style.animationDelay = random(0, 3) + 's';
      star.style.transform = 'scale(' + random(0.5, 1.5).toFixed(2) + ')';
      layer.appendChild(star);
    }
  }


  /* ======================================================================
     7. INTERACTIVE BIRTHDAY CAKE
     ====================================================================== */
  const blowBtn = $('#blowBtn');
  const cakeWish = $('#cakeWish');
  let blown = false;

  if (blowBtn) {
    blowBtn.addEventListener('click', function () {
      if (blown) return;
      blown = true;

      // Extinguish the flames
      $$('.cake .flame').forEach(function (flame) {
        flame.classList.add('is-out');
      });

      // Little puffs of smoke
      $$('.cake .candle').forEach(function (candle, i) {
        const smoke = document.createElement('span');
        smoke.className = 'smoke';
        smoke.style.animationDelay = (i * 0.1) + 's';
        candle.appendChild(smoke);
        window.setTimeout(function () { smoke.remove(); }, 2000);
      });

      // Reveal the wish + celebrate
      cakeWish.classList.add('show');
      confettiBurst(46);

      blowBtn.textContent = 'Wish sent with love 💗';
      blowBtn.disabled = true;
    });
  }


  /* ======================================================================
     8. FINAL SURPRISE — "Send a Hug"
     ====================================================================== */
  const hugBtn = $('#hugBtn');
  const hugMsg = $('#hugMsg');

  if (hugBtn) {
    hugBtn.addEventListener('click', function () {
      hugMsg.textContent = 'Sending my Bava the biggest hug from his little Chinnapilla! ❤️🥹';
      hugBurst(hugBtn, 26);
    });
  }


  /* ======================================================================
     9. CONFETTI + HUG HEART EFFECTS
     ====================================================================== */
  const CONFETTI = ['❤️', '💗', '🎉', '✨', '🎀', '🩷', '💖', '🥳'];

  function confettiBurst(count) {
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti';
      piece.textContent = pick(CONFETTI);
      piece.style.left = random(0, 100) + 'vw';
      piece.style.fontSize = random(14, 32) + 'px';
      piece.style.animationDuration = random(2.4, 4.6) + 's';
      piece.style.animationDelay = random(0, 0.6) + 's';
      document.body.appendChild(piece);
      window.setTimeout(function () { piece.remove(); }, 5200);
    }
  }

  function hugBurst(fromEl, count) {
    const rect = fromEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'fly-heart';
      heart.textContent = pick(['❤️', '🤗', '💗', '🩷', '💖']);

      const angle = Math.random() * Math.PI * 2;
      const dist = random(120, 340);

      heart.style.left = cx + 'px';
      heart.style.top = cy + 'px';
      heart.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      heart.style.setProperty('--dy', (Math.sin(angle) * dist - 80) + 'px');
      heart.style.setProperty('--rot', random(-360, 360) + 'deg');

      document.body.appendChild(heart);
      window.setTimeout(function () { heart.remove(); }, 2100);
    }
  }


  /* ======================================================================
     INIT
     ====================================================================== */
  createFloatingHearts(14);
  createStars(42);
  initRevealObserver();

  // Make sure reveals that are already on screen (if any) show up.
  window.addEventListener('load', observeReveals);

});
