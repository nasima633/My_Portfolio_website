
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const moonIcon = '<path d="M20.2 15.4A8.3 8.3 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"/>';
    const sunIcon = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
    let savedTheme = null;
    try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (e) {}
    if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
    function updateThemeButton() {
      const light = root.dataset.theme === 'light';
      themeIcon.innerHTML = light ? sunIcon : moonIcon;
      themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    }
    updateThemeButton();
    themeToggle.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (e) {}
      updateThemeButton();
    });

    // Mobile navigation menu.
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    }));

    // Mouse-following glow + soft directional shadow on the hero card.
    const heroVisual = document.getElementById('heroVisual');
    const profileCard = document.getElementById('profileCard');
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (finePointer) {
      heroVisual.addEventListener('pointermove', event => {
        const rect = profileCard.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 7;
        const rotateX = (0.5 - y) * 7;
        profileCard.style.setProperty('--mx', `${x * 100}%`);
        profileCard.style.setProperty('--my', `${y * 100}%`);
        profileCard.style.setProperty('--ry', `${rotateY}deg`);
        profileCard.style.setProperty('--rx', `${rotateX}deg`);
        profileCard.style.setProperty('--card-shadow', `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(40, 135, 230, .12)`);
      });
      heroVisual.addEventListener('pointerleave', () => {
        profileCard.style.setProperty('--mx', '50%');
        profileCard.style.setProperty('--my', '35%');
        profileCard.style.setProperty('--ry', '0deg');
        profileCard.style.setProperty('--rx', '0deg');
        profileCard.style.setProperty('--card-shadow', '0 0 0 rgba(101,184,255,0)');
      });
    }

    // Create a small field of slow, softly twinkling stars in every major section.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      document.querySelectorAll('main section').forEach(section => {
        let starField = section.querySelector('.star-field');
        if (!starField) {
          starField = document.createElement('div');
          starField.className = 'star-field';
          starField.setAttribute('aria-hidden', 'true');
          section.prepend(starField);
        }
        const count = section.classList.contains('hero') ? 24 : 18;
        for (let i = 0; i < count; i++) {
          const star = document.createElement('span');
          star.className = 'star';
          star.style.left = `${3 + Math.random() * 94}%`;
          star.style.top = `${5 + Math.random() * 90}%`;
          star.style.setProperty('--size', `${1.5 + Math.random() * 2.2}px`);
          star.style.setProperty('--duration', `${10 + Math.random() * 12}s`);
          star.style.setProperty('--twinkle', `${3.5 + Math.random() * 4.5}s`);
          star.style.setProperty('--dx', `${-10 + Math.random() * 20}px`);
          star.style.setProperty('--dy', `${-15 + Math.random() * 30}px`);
          star.style.animationDelay = `${-Math.random() * 10}s, ${-Math.random() * 5}s`;
          starField.appendChild(star);
        }
      });
    }

    // Reveal sections gently as they enter the viewport.
    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach(item => observer.observe(item));
    } else {
      revealItems.forEach(item => item.classList.add('visible'));
    }

    // Highlight the active navigation item while scrolling.
    const sections = document.querySelectorAll('main section[id]');
    const navAnchors = navLinks.querySelectorAll('a');
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navAnchors.forEach(anchor => {
              anchor.classList.toggle('active', anchor.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      }, { rootMargin: '-25% 0px -60% 0px' });
      sections.forEach(section => sectionObserver.observe(section));
    }

    // Contact form creates a draft in the visitor's default email app.
   
// Contact form validation and email draft.
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm && formNote) {
  const nameInput = contactForm.elements.name;
  const emailInput = contactForm.elements.email;
  const subjectInput = contactForm.elements.subject;
  const messageInput = contactForm.elements.message;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate fields and display browser validation messages.
  function validateContactForm() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    nameInput.setCustomValidity('');
    emailInput.setCustomValidity('');
    subjectInput.setCustomValidity('');
    messageInput.setCustomValidity('');

    if (name.length < 2) {
      nameInput.setCustomValidity(
        'Please enter your name using at least 2 characters.'
      );
    }

    if (!emailPattern.test(email)) {
      emailInput.setCustomValidity(
        'Please enter a valid email address.'
      );
    }

    if (subject.length < 3) {
      subjectInput.setCustomValidity(
        'Please enter a subject using at least 3 characters.'
      );
    }

    if (message.length < 10) {
      messageInput.setCustomValidity(
        'Please enter a message using at least 10 characters.'
      );
    }

    return contactForm.checkValidity();
  }

  // Clear custom validation errors as the visitor corrects their input.
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      input.setCustomValidity('');
      formNote.textContent = '';
    });

    input.addEventListener('blur', () => {
      validateContactForm();
    });
  });

  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateContactForm()) {
      contactForm.reportValidity();
      formNote.textContent =
        'Please check your entries and correct any highlighted fields.';
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    const emailBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      'Message:',
      message
    ].join('\n');

    const mailtoLink =
      `mailto:nasimaalizada00@gmail.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(emailBody)}`;

    formNote.textContent =
      'Opening your email application. If it does not open, check your default email settings.';

    window.location.href = mailtoLink;
  });
}

