const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

$$(".fade-up").forEach((el) => observer.observe(el));

const header = $("#mainHeader");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

const menuToggle = $("#mobileMenuToggle");
const navMenu = $("#navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("open");
    }
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("open");
    });
  });
}

$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = $(this.getAttribute("href"));
    if (!target) return;

    e.preventDefault();

    const offset = 80;
    const top = target.offsetTop - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  });
});

const form = $("#contactForm");
const submitBtn = $("#submitBtn");

if (form && submitBtn) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = $("#name").value.trim();
    const email = $("#email").value.trim();

    if (!name || !email) {
      showToast("Preencha nome e email.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Email inválido.", "error");
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      await new Promise((r) => setTimeout(r, 1500));

      showToast("Mensagem enviada com sucesso!");
      form.reset();

      submitBtn.classList.remove("loading");
      submitBtn.classList.add("success");
    } catch {
      showToast("Erro ao enviar.", "error");
      submitBtn.classList.remove("loading");
      submitBtn.classList.add("error");
    }

    setTimeout(() => {
      submitBtn.classList.remove("success", "error");
      submitBtn.disabled = false;
    }, 2500);
  });
}

const newsletterBtn = $(".newsletter-btn");
const newsletterInput = $(".newsletter-input");

if (newsletterBtn && newsletterInput) {
  function handleNewsletter() {
    const email = newsletterInput.value.trim();

    if (!email) {
      showToast("Digite seu email.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Email inválido.", "error");
      return;
    }

    showToast("Inscrição realizada!");
    newsletterInput.value = "";
  }

  newsletterBtn.addEventListener("click", handleNewsletter);

  newsletterInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNewsletter();
    }
  });
}
