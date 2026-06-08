document.addEventListener("DOMContentLoaded", () => {
  // 1. Sticky Navbar Effect
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 2. Reveal Elements on Scroll
  const revealElements = document.querySelectorAll("[data-reveal]");
  const revealOnScroll = () => {
    revealElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight * 0.85) {
        el.classList.add("revealed");
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Run once on load

  // 3. Counter Animation for Impact Stats
  const counters = document.querySelectorAll(".counter");
  const animateCounters = () => {
    counters.forEach((counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;
        const speed = 200; // The lower the slower
        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };

      // Trigger animation when visible
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            updateCount();
            observer.unobserve(counter);
          }
        },
        { threshold: 1 },
      );
      observer.observe(counter);
    });
  };
  animateCounters();

  // 4. Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksWrapper = document.querySelector(".nav-links-wrapper");
  if (navToggle && navLinksWrapper) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navLinksWrapper.classList.toggle("open");
      // animate hamburger to X
      navToggle.classList.toggle("open");
    });

    // close mobile menu when link clicked
    navLinksWrapper.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (navLinksWrapper.classList.contains("open")) {
          navLinksWrapper.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.classList.remove("open");
        }
      });
    });
  }

  // 4. Form Submission Handling
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button");
      const originalText = btn.innerText;

      btn.innerText = "Sending...";
      btn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        alert("Thank you for your message! We will get back to you soon.");
        contactForm.reset();
        btn.innerText = originalText;
        btn.disabled = false;
      }, 1500);
    });
  }

  // 5. Smooth Scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: "smooth",
        });
      }
    });
  });
});
