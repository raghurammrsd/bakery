/* ============================================================
   script.js  —  Sweeto's Bakery 3D Landing Page (Trendy D2C)
   ============================================================ */

/* ── 1. THREE.JS FLOATING PARTICLES BACKGROUND ── */
(function initThree() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const count  = window.innerWidth < 600 ? 50 : 150;
  const geo    = new THREE.BufferGeometry();
  const pos    = new Float32Array(count * 3);
  const sizes  = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - .5) * 14;
    pos[i * 3 + 1] = (Math.random() - .5) * 10;
    pos[i * 3 + 2] = (Math.random() - .5) * 8;
    sizes[i]       = Math.random() * 5 + 1.5;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0xd49a37,
    size: 0.08,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - .5) * 0.8;
    mouse.y = (e.clientY / window.innerHeight - .5) * 0.6;
  });

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0005;
    points.rotation.x += 0.0002;
    camera.position.x += (mouse.x - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y - camera.position.y) * 0.05;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
})();

/* ── 2. GSAP PREMIUM ANIMATIONS ── */
document.addEventListener("DOMContentLoaded", (event) => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero Intro Animation
  const tl = gsap.timeline();
  tl.from(".hero-badge", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" })
    .from(".gsap-hero", { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.4")
    .from(".trust-item", { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.4")
    .from(".gsap-hero-card", { x: 50, opacity: 0, duration: 1, ease: "power4.out", rotationY: 15 }, "-=0.8");

  // Scroll Animations for Sections
  gsap.utils.toArray('.section-label, .section-title, .section-sub').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 85%" },
      y: 40, opacity: 0, duration: 0.8, ease: "power3.out"
    });
  });

  // Staggered Cards
  gsap.utils.toArray('.category-grid, .product-grid, .specials-grid, .why-grid').forEach(grid => {
    gsap.from(grid.children, {
      scrollTrigger: { trigger: grid, start: "top 80%" },
      y: 50, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out"
    });
  });

  // Gallery Masonry Stagger
  gsap.from('.gsap-gallery', {
    scrollTrigger: { trigger: '.gallery-grid', start: "top 75%" },
    scale: 0.8, opacity: 0, duration: 0.7, stagger: 0.05, ease: "back.out(1.2)"
  });

  // Parallax floating emojis
  gsap.utils.toArray('.floaty').forEach(el => {
    gsap.to(el, {
      yPercent: -150,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 }
    });
  });
});

/* ── 3. NAVBAR SCROLL EFFECT ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── 4. HAMBURGER MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ── 5. 3D TILT CARDS (Desktop) ── */
function initTilt() {
  if (window.innerWidth < 1024) return;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotY   = ((x - cx) / cx) * 8;
      const rotX   = -((y - cy) / cy) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
initTilt();
window.addEventListener('resize', initTilt, { passive: true });

/* ── 6. HERO CARD MOUSE PARALLAX ── */
const heroCard = document.querySelector('.hero-card-inner');
if (heroCard && window.innerWidth >= 1024) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - .5) * 20;
    const y = (e.clientY / window.innerHeight - .5) * 20;
    heroCard.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
}

/* ── 7. PRODUCT TABS ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.product-grid').forEach(g => {
      g.classList.toggle('hidden', g.id !== 'tab-' + tab);
    });
    ScrollTrigger.refresh();
  });
});

/* ── 8. WHATSAPP ORDER HELPER ── */
const WA_NUMBER = '919876543210'; 
window.waOrder = function(btn) {
  const card = btn.closest('[data-wa]');
  const item = card ? card.dataset.wa : 'bakery products';
  const msg  = encodeURIComponent(`Hi! I am inquiring about: ${item}`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
};
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    const msg = encodeURIComponent(`Hi! I am interested in: ${card.dataset.wa}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  });
});

/* ── 9. CAKE BUILDER ── */
const builderState = { size: '½ KG', flavour: 'Chocolate', design: 'Simple', occasion:'Birthday', message: '', qty: 1 };
const flavourEmojis = { 'Chocolate':'🍫', 'Vanilla':'🤍', 'Butterscotch':'🍯', 'Red Velvet':'❤️' };


/* ── 10. MODAL ── */
window.openCustomizer = function() { document.getElementById('customizerModal')?.classList.add('open'); };
window.closeCustomizer = function() { document.getElementById('customizerModal')?.classList.remove('open'); };
document.getElementById('modalClose')?.addEventListener('click', closeCustomizer);
document.getElementById('customizerModal')?.addEventListener('click', e => { if (e.target.id === 'customizerModal') closeCustomizer(); });

/* ── 11. GALLERY LIGHTBOX ── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img') ? item.querySelector('img').src : null;
    if (!src) return;
    const lb = document.createElement('div');
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(20,10,0,.9);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;cursor:pointer;opacity:0;transition:opacity 0.3s;backdrop-filter:blur(10px);';
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'max-width:100%;max-height:90vh;border-radius:24px;box-shadow:0 30px 80px rgba(0,0,0,.6);transform:scale(0.9);transition:transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);';
    lb.appendChild(img);
    document.body.appendChild(lb);
    requestAnimationFrame(() => { lb.style.opacity = '1'; img.style.transform = 'scale(1)'; });
    lb.addEventListener('click', () => {
      lb.style.opacity = '0'; img.style.transform = 'scale(0.9)';
      setTimeout(() => lb.remove(), 300);
    });
  });
});

/* ── 12. FLOATING WA BUTTON ── */
const floatWa = document.getElementById('floatWa');
if (floatWa) {
  window.addEventListener('scroll', () => {
    floatWa.style.opacity = window.scrollY > 400 ? '1' : '0';
    floatWa.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    floatWa.style.transform = window.scrollY > 400 ? 'translateY(0)' : 'translateY(20px)';
  }, { passive: true });
  floatWa.style.opacity = '0';
  floatWa.style.pointerEvents = 'none';
  floatWa.style.transform = 'translateY(20px)';
  floatWa.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
}


/* ── 13. PARALLAX SCROLLING FOR OUR WORK (GALLERY) ── */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll('.gallery-item').forEach(container => {
      const img = container.querySelector('img');
      if (img) {
        // Ensure container can hide overflow
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        
        // Create parallax wrapper to prevent CSS hover transform conflicts
        const wrapper = document.createElement('div');
        wrapper.className = 'parallax-wrapper';
        wrapper.style.position = 'absolute';
        wrapper.style.top = '-20%'; // Oversize for scroll room
        wrapper.style.left = '0';
        wrapper.style.width = '100%';
        wrapper.style.height = '140%'; // 40% extra height
        
        // Move img into wrapper
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        // Reset img styles to fill wrapper
        img.style.position = 'relative';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.top = '0';
        img.style.objectFit = 'cover';
        
        // GSAP Parallax Scrub
        gsap.to(wrapper, {
          yPercent: 25, // Move the image down as we scroll down
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom", // when top of container hits bottom of viewport
            end: "bottom top",   // when bottom of container hits top of viewport
            scrub: 1.5           // smooth scrubbing
          }
        });
      }
    });
  }, 200); // Slight delay to ensure DOM is ready
});


/* ── 14. PREMIUM SWIPER CAROUSEL WITH 3D TILT ── */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper('.mySwiper', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 40,
      loop: true,
      grabCursor: true,
      speed: 800, // Smooth dragging speed
      on: {
        sliderMove: function () {
          const dragText = document.getElementById('dragText');
          if(dragText) dragText.style.opacity = '0';
        }
      }
    });

    // 3D Tilt Effect on Active Slide
    document.querySelectorAll('.swiper-slide').forEach(slide => {
      slide.addEventListener('mousemove', e => {
        if (!slide.classList.contains('swiper-slide-active')) return;
        const rect = slide.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        
        // Calculate rotation limits
        const rotX = ((y - cy) / cy) * -15; // Max 15deg tilt
        const rotY = ((x - cx) / cx) * 15;
        
        const inner = slide.querySelector('.tilt-inner');
        if (inner) {
          inner.style.transform = `perspective(1000px) scale(1.08) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }
      });
      
      slide.addEventListener('mouseleave', () => {
        const inner = slide.querySelector('.tilt-inner');
        if (inner) {
          // Reset to default active state
          inner.style.transform = slide.classList.contains('swiper-slide-active') ? 'scale(1.08) rotateX(0) rotateY(0)' : 'scale(1) rotateX(0) rotateY(0)';
        }
      });
    });

    // Dynamic Spotlight Background Effect
    const spotlightSection = document.querySelector('.dark-spotlight-section');
    if (spotlightSection) {
      spotlightSection.addEventListener('mousemove', e => {
        const rect = spotlightSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const spotlight = spotlightSection.querySelector('.spotlight');
        if (spotlight) {
          spotlight.style.setProperty('--x', `${x}px`);
          spotlight.style.setProperty('--y', `${y}px`);
        }
      });
    }
  }
});

/* ── 14. PREMIUM SWIPER CAROUSEL WITH 3D TILT (ULTIMATE FIXED) ── */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper('.mySwiper', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 40,
      loop: true,
      grabCursor: true,
      speed: 3000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      },
      on: {
        sliderMove: function () {
          const dragText = document.getElementById('dragText');
          if(dragText) dragText.style.opacity = '0';
        }
      }
    });

    // Make sure it starts!
    setTimeout(() => { if(swiper.autoplay) swiper.autoplay.start(); }, 500);

    // Advanced 3D Tilt with GSAP (Butter smooth, no CSS conflicts)
    const container = document.querySelector('.mySwiper');
    if (container) {
      
      const handleMove = (e) => {
        // Support both mouse and touch
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const slide = e.target.closest('.swiper-slide-active');
        if (!slide) return;
        
        const rect = slide.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        
        // 3D calculation
        const rotX = ((y - cy) / cy) * -20; // 20deg max tilt
        const rotY = ((x - cx) / cx) * 20;
        
        const inner = slide.querySelector('.tilt-inner');
        if (inner && typeof gsap !== 'undefined') {
          gsap.to(inner, {
            duration: 0.4,
            rotationX: rotX,
            rotationY: rotY,
            scale: 1.15, // Zoom in
            transformPerspective: 1000,
            ease: "power2.out"
          });
        }
      };

      const handleLeave = (e) => {
        const slide = e.target.closest('.swiper-slide-active');
        if (!slide) return;
        const inner = slide.querySelector('.tilt-inner');
        if (inner && typeof gsap !== 'undefined') {
          gsap.to(inner, {
            duration: 0.7,
            rotationX: 0,
            rotationY: 0,
            scale: 1.08, // Return to default active scale
            ease: "elastic.out(1, 0.5)"
          });
        }
      };

      container.addEventListener('mousemove', handleMove);
      container.addEventListener('touchmove', handleMove);
      container.addEventListener('mouseout', handleLeave);
      container.addEventListener('touchend', handleLeave);
    }
  }
});



/* ── 16. PREMIUM IMAGE PARALLAX (OUR WORK) ── */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Select all parallax images
    const plxImages = document.querySelectorAll('.plx-img');
    
    plxImages.forEach(img => {
      // The image moves from yPercent: -15 to yPercent: 15 as you scroll past the frame
      gsap.to(img, {
        yPercent: 30, // Moves it down relative to its starting position
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement, // The frame
          start: "top bottom", // When top of frame hits bottom of screen
          end: "bottom top",   // When bottom of frame hits top of screen
          scrub: true          // Smoothly ties animation to scrollbar
        }
      });
    });
  }
});
