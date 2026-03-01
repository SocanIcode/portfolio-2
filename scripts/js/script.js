document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll only for # links that exist on the current page
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return; // IMPORTANT: do nothing if section isn't on this page

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Navbar padding change on scroll (safe)
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
