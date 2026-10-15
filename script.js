const themeToggle = document.querySelector("#theme-toggle");
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");
let toastTimer;

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function setTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  try {
    window.localStorage.setItem("sakib-portfolio-theme", theme);
  } catch {
    showToast("Theme changed for this visit.");
  }
}

try {
  const savedTheme = window.localStorage.getItem("sakib-portfolio-theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.setAttribute("aria-label", "Switch to dark theme");
  }
} catch {
  // The portfolio keeps its default dark theme when browser storage is unavailable.
}

themeToggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("light-mode") ? "dark" : "light");
});

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

mainNav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
});

const navLinks = [...document.querySelectorAll(".nav-link")];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visibleSection) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visibleSection.target.id}`);
    });
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.15, 0.4] });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

document.querySelector("#current-year").textContent = new Date().getFullYear();

document.querySelectorAll('.hero-socials a[href="#contact"]').forEach((link) => {
  link.addEventListener("click", () => {
    showToast("Add your GitHub or LinkedIn profile link here.");
  });
});