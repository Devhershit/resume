gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const setTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  }
};

setTheme(savedTheme || (prefersDark ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
}

const plane = document.querySelector(".airplane-fly");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (plane && !reduceMotion) {
  gsap.set(plane, { x: -140, y: 0, rotation: -8 });

  gsap.to(plane, {
    x: () => window.innerWidth + 180,
    duration: 14,
    repeat: -1,
    ease: "none"
  });

  gsap.to(plane, {
    y: 16,
    rotation: 4,
    duration: 2.3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

if (reduceMotion) {
  gsap.set(".reveal, .top-nav, .hero-title, .hero-subtitle, .hero-actions, .eyebrow", {
    clearProps: "all",
    opacity: 1
  });
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

if (!reduceMotion) {
  gsap.from(".top-nav", {
  y: -14,
  opacity: 0,
  duration: 0.75,
  ease: "power2.out"
  });

  gsap.from(".hero-title", {
  y: 22,
  opacity: 0,
  duration: 0.95,
  delay: 0.1,
  ease: "power2.out"
  });

  gsap.from(".hero-subtitle, .hero-actions, .eyebrow", {
  y: 14,
  opacity: 0,
  duration: 0.75,
  stagger: 0.1,
  delay: 0.2,
  ease: "power2.out"
  });

  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.from(element, {
      y: 22,
      opacity: 0,
      duration: 0.75,
      ease: "power1.out",
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        toggleActions: "play none none reverse",
        once: true
      }
    });
  });
}
