document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkModeToggle");
  const currentMode = localStorage.getItem("theme");

  function updateButtonLabel(isDark) {
    if (toggleBtn) {
      toggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = currentMode === "dark" || (!currentMode && prefersDark);

  if (isDark) {
    document.body.classList.add("dark-mode");
  }
  updateButtonLabel(isDark);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const darkModeEnabled = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", darkModeEnabled ? "dark" : "light");
      updateButtonLabel(darkModeEnabled);
    });
  }
});
