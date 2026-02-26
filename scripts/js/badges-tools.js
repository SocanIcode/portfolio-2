function renderBadgeSection({ url, key, title, containerSelector }) {
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      const container = document.querySelector(containerSelector);
      if (!container || !data || !Array.isArray(data[key])) return;

      const section = document.createElement("div");
      section.className = "mb-6";

      const heading = document.createElement("h3");
      heading.className = "text-xl font-semibold text-white mb-4";
      heading.textContent = title;

      const badgeContainer = document.createElement("div");
      badgeContainer.className = "flex flex-wrap gap-2 justify-center";

      data[key].forEach((item) => {
        const wrap = document.createElement("div");
        wrap.className =
          "transform hover:scale-105 transition-transform duration-200";

        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt;
        img.loading = "lazy";
        img.decoding = "async";
        img.className = "h-6 w-auto rounded shadow-sm";
        img.style.maxWidth = "120px";

        wrap.appendChild(img);
        badgeContainer.appendChild(wrap);
      });

      section.appendChild(heading);
      section.appendChild(badgeContainer);
      container.appendChild(section);
    })
    .catch((err) => console.error(`Error loading ${url}:`, err));
}

document.addEventListener("DOMContentLoaded", () => {
  renderBadgeSection({
    url: "json/badges.json",
    key: "badges",
    title: "Skills & Technologies",
    containerSelector: ".skills-descriptions",
  });

  renderBadgeSection({
    url: "json/tools.json",
    key: "tools",
    title: "Tools & Platforms",
    containerSelector: ".skills-descriptions",
  });
});
