/* =============================================
   PINKO SA - JavaScript principal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar scroll effect --- */
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* --- Hamburger menu toggle (mobile) --- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar__links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Cerrar menu al hacer clic en un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });

    // Cerrar menu al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });
  }

  /* --- Smooth scroll para links de ancla --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* --- Intersection Observer para animaciones de entrada --- */
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos animables
  const animatedElements = document.querySelectorAll(
    '.service-card, .about__stat, .about__image, .values__item, .fade-in'
  );

  animatedElements.forEach(el => observer.observe(el));

  /* --- Active nav link en scroll --- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.querySelectorAll('a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* --- Contact form handler --- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const nombre = formData.get('nombre')?.trim();
      const email = formData.get('email')?.trim();
      const mensaje = formData.get('mensaje')?.trim();

      // Remover mensajes previos
      const prevMsg = contactForm.querySelector('.form__message');
      if (prevMsg) prevMsg.remove();

      // Validacion basica
      if (!nombre || !email || !mensaje) {
        showFormMessage('Por favor, complete todos los campos obligatorios.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage('Por favor, ingrese un email valido.', 'error');
        return;
      }

      // Simular envio
      const submitBtn = contactForm.querySelector('.form__submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showFormMessage('Mensaje enviado correctamente. Nos pondremos en contacto pronto.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  function showFormMessage(text, type) {
    const msgEl = document.createElement('div');
    msgEl.className = `form__message form__message--${type}`;
    msgEl.textContent = text;
    contactForm.appendChild(msgEl);

    // Auto-remover despues de 6 segundos
    setTimeout(() => {
      if (msgEl.parentNode) {
        msgEl.style.opacity = '0';
        msgEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => msgEl.remove(), 300);
      }
    }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});
