/* ============================================
   AHMED RIZWAN — PORTFOLIO SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initMobileMenu();
  initTypingEffect();
  initCountUp();
  initAvatarTilt();
  initCustomCursor();
  initShootingStars();
  initExplodingCommits();
});

/* ---------- Particle Canvas Background ---------- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
      ctx.fill();
    }
  }

  function createParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animFrame = requestAnimationFrame(animate);
  }

  createParticles();
  animate();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    createParticles();
    animate();
  });
}

/* ---------- Navbar Scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section[id]');

  window.addEventListener('scroll', () => {
    // Scroll background
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- Skill Bars Animation ---------- */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.getAttribute('data-width');
        target.style.width = width + '%';
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(bar => observer.observe(bar));
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = navLinksContainer.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Typing Effect ---------- */
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const strings = [
    'Mobile Application Developer',
    'Flutter Specialist',
    'Android Native Developer',
    'Cross-Platform Expert'
  ];

  let strIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const current = strings[strIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      strIdx = (strIdx + 1) % strings.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ---------- Count Up Animation ---------- */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(ease * target);
          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ---------- Interactive 3D Avatar Tilt (Face Follows Cursor) ---------- */
function initAvatarTilt() {
  const avatar = document.querySelector('.hero-avatar');
  const wrapper = document.querySelector('.hero-avatar-wrapper');
  if (!avatar || !wrapper) return;

  // Ensure initial transitions and transform styles are set
  avatar.style.transition = 'transform 0.15s ease-out';
  avatar.style.transformStyle = 'preserve-3d';

  window.addEventListener('mousemove', (e) => {
    // Get viewport coordinates of the avatar center
    const rect = avatar.getBoundingClientRect();
    const avatarCenterX = rect.left + rect.width / 2;
    const avatarCenterY = rect.top + rect.height / 2;

    // Distance from cursor to avatar center
    const deltaX = e.clientX - avatarCenterX;
    const deltaY = e.clientY - avatarCenterY;

    // Normalize coordinates (clamped between -1 and 1) based on standard screen sensitivity range
    const maxDistance = 600; 
    const normX = Math.max(-1, Math.min(1, deltaX / maxDistance));
    const normY = Math.max(-1, Math.min(1, deltaY / maxDistance));

    // Calculate rotation angles (max tilt angle of 18 degrees)
    const maxTilt = 18;
    const rotateY = normX * maxTilt;
    const rotateX = -normY * maxTilt; // Inverse y-axis for proper gaze tracking direction

    // Apply the 3D rotation and a subtle zoom on hover
    avatar.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  // Smoothly reset rotation when mouse leaves the document window
  document.addEventListener('mouseleave', () => {
    avatar.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    avatar.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });

  // Re-enable snappy tracking transition when mouse enters the window again
  document.addEventListener('mouseenter', () => {
    avatar.style.transition = 'transform 0.15s ease-out';
  });
}

/* ---------- Custom Glow Cursor Trail ---------- */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const glow = document.querySelector('.custom-cursor-glow');
  if (!dot || !glow) return;

  let mouseX = 0, mouseY = 0; // Actual mouse position
  let dotX = 0, dotY = 0;     // Animated dot position
  let glowX = 0, glowY = 0;   // Animated glow position

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Main animation loop for custom cursor with elegant trailing lag (lerp)
  function animateCursor() {
    // Linear interpolation formula: current + (target - current) * speed factor
    // Dot is very snappy (speed = 0.25)
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;

    // Glow has a smooth trailing lag (speed = 0.08)
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;

    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    requestAnimationFrame(animateCursor);
  }
  
  // Start the animation loop
  requestAnimationFrame(animateCursor);

  // Setup hover interaction state classes
  const hoverables = document.querySelectorAll('a, button, .project-card, .btn, .nav-links a, .hamburger, .timeline-card');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      glow.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      glow.classList.remove('hover');
    });
  });

  // Hide the cursor elements if the mouse leaves the document window entirely
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    glow.style.opacity = '1';
  });
}

/* ---------- Interactive Shooting Stars / Falling Asteroids Effect ---------- */
function initShootingStars() {
  const container = document.querySelector('.shooting-stars-container');
  if (!container) return;

  function spawnStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';

    // Random starting position in the upper-right area of the screen
    const startX = Math.random() * 60 + 35; // 35% to 95% from left
    const startY = Math.random() * 45 - 15; // -15% to 30% from top (starts slightly off-screen)
    
    star.style.left = `${startX}%`;
    star.style.top = `${startY}%`;

    // Randomize speed/duration (8s to 12s for a slow, elegant, majestic drift)
    const duration = Math.random() * 4 + 8;
    star.style.animationDuration = `${duration}s`;

    // Randomize size/scale of the star (0.6 to 1.3)
    const scale = Math.random() * 0.7 + 0.6;
    star.style.transform = `rotate(-45deg) scale(${scale})`;

    container.appendChild(star);

    // 25% chance of exploding mid-air
    const willExplode = Math.random() < 0.25;
    let explosionTimeout;

    if (willExplode) {
      // Explode at a random point in its flight (between 30% and 60% of total duration)
      const explodePercent = Math.random() * 0.3 + 0.3; 
      const explodeDelay = duration * 1000 * explodePercent;

      explosionTimeout = setTimeout(() => {
        explodeStar(star);
      }, explodeDelay);
    }

    // Remove the element once the animation ends to keep DOM clean
    star.addEventListener('animationend', () => {
      if (explosionTimeout) clearTimeout(explosionTimeout);
      star.remove();
    });
  }

  function explodeStar(starEl) {
    // Get live position of the leading tip (bottom-left corner of the rotated bounding box)
    const rect = starEl.getBoundingClientRect();
    const headX = rect.left;
    const headY = rect.bottom;

    // Spawn 15 to 22 glowing star spark particles bursting outward
    const sparkCount = Math.floor(Math.random() * 8) + 15;
    
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'star-spark';
      
      // Initial positions at the leading head coordinates
      spark.style.left = `${headX}px`;
      spark.style.top = `${headY}px`;

      // Random math distribution: angle (0 to 360) and distance (40px to 110px)
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 70 + 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      spark.style.setProperty('--tx', `${tx}px`);
      spark.style.setProperty('--ty', `${ty}px`);

      container.appendChild(spark);

      // Clean up spark node
      spark.addEventListener('animationend', () => {
        spark.remove();
      });
    }

    // Remove the original shooting star
    starEl.remove();
  }

  // Spawn initial star, and then queue up future spawns at random intervals (every 2 to 5 seconds)
  spawnStar();

  function queueNextStar() {
    const delay = Math.random() * 3000 + 2000; // 2s to 5s
    setTimeout(() => {
      spawnStar();
      queueNextStar();
    }, delay);
  }

  queueNextStar();
}

/* ---------- Exploding Commits Background Effect ---------- */
function initExplodingCommits() {
  const container = document.querySelector('.shooting-stars-container');
  if (!container) return;

  const commitMessages = [
    'feat: added custom cursor trail',
    'fix: removed project duplication',
    'feat: interactive 3D avatar tilt',
    'style: glassmorphic cards',
    'refactor: optimized mobile layout',
    'feat: added WhatsApp contact link',
    'git commit -m "Update brand logo"',
    'git push origin main...',
    'merge: branch feature/avatar-3d',
    'chore: updated local dev assets',
    'feat: scroll reveal active',
    'style: added modern neon glow accents',
    'git checkout -b feature/neon-glow',
    'commit db31bdf: interactive particles',
    'commit a59e01b: cursor spot glow',
    'commit 791d62f: added social links'
  ];

  const shardCharacters = ['{', '}', ';', '=>', 'git', 'push', 'commit', 'feat', 'fix', '+', '-', 'const', 'let', '()', '[]', '0', '1'];

  function spawnCommit() {
    const el = document.createElement('div');
    el.className = 'exploding-commit';

    // Choose random commit message
    const msg = commitMessages[Math.floor(Math.random() * commitMessages.length)];
    el.textContent = msg;

    // Random horizontal position (10% to 75%)
    const posX = Math.random() * 65 + 10;
    el.style.left = `${posX}%`;

    // Random vertical starting position (65vh to 80vh)
    const posY = Math.random() * 15 + 65;
    el.style.top = `${posY}vh`;

    container.appendChild(el);

    // Schedule explosion just before the floatUpToExplode animation finishes (takes 3s)
    setTimeout(() => {
      explodeCommit(el, posX, posY);
    }, 2850);
  }

  function explodeCommit(commitEl, xPercent, yPercent) {
    // Get final pixel position of the commit element for particle spawns
    const rect = commitEl.getBoundingClientRect();
    const pixelX = rect.left + rect.width / 2;
    const pixelY = rect.top + rect.height / 2;

    // Spawn 10 to 14 code syntax shard particles exploding outwards
    const shardCount = Math.floor(Math.random() * 5) + 10;
    
    for (let i = 0; i < shardCount; i++) {
      const shard = document.createElement('div');
      shard.className = 'commit-shard';
      
      // Select random code syntax character
      shard.textContent = shardCharacters[Math.floor(Math.random() * shardCharacters.length)];
      
      // Set initial positions
      shard.style.left = `${pixelX}px`;
      shard.style.top = `${pixelY}px`;

      // Random math distribution: angle (0 to 360) and distance (60px to 140px)
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 + 60;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = Math.random() * 360 - 180;

      // Set CSS variables for transition translate values
      shard.style.setProperty('--tx', `${tx}px`);
      shard.style.setProperty('--ty', `${ty}px`);
      shard.style.setProperty('--rot', `${rot}deg`);

      container.appendChild(shard);

      // Clean up shard after animation
      shard.addEventListener('animationend', () => {
        shard.remove();
      });
    }

    // Remove the original text element
    commitEl.remove();
  }

  // Spawn first commit, then schedule next spawns at rare intervals (every 14s to 22s)
  // to prevent screen cluttering and keep it as a premium Easter egg
  setTimeout(spawnCommit, 5000);

  function queueNextCommit() {
    const delay = Math.random() * 8000 + 14000; // 14s to 22s
    setTimeout(() => {
      spawnCommit();
      queueNextCommit();
    }, delay);
  }

  queueNextCommit();
}
