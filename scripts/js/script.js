document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  if (!nav) return;

  function handleNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add("py-4", "shadow-lg");
      nav.classList.remove("py-6");
    } else {
      nav.classList.add("py-6");
      nav.classList.remove("py-4", "shadow-lg");
    }
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();
});
