document.addEventListener("DOMContentLoaded", () => {
  fetch("json/cardsData.json")
    .then((response) => response.json())
    .then((data) => {
      const portfolioGrid = document.querySelector(".portfolio-grid");
      const techFiltersContainer = document.querySelector("#tech-filters");
      const typeFiltersContainer = document.querySelector("#type-filters");

      // Stop safely on pages without the projects section (about/contact pages)
      if (!portfolioGrid || !techFiltersContainer) return;

      // Hide type filters (you’re not using them right now)
      if (typeFiltersContainer) typeFiltersContainer.classList.add("hidden");

      const projects = Array.isArray(data.projects) ? data.projects : [];

      // ---------- Tech filters ----------
      const makeTechButton = (label, value, isActive) => {
        const button = document.createElement("button");
        button.className =
          "tech-filter px-3 py-1.5 text-sm border rounded-md transition-all duration-300 " +
          (isActive
            ? "active border-yellow-400 text-yellow-300 bg-yellow-400/10"
            : "border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-300");

        button.setAttribute("data-tech", value);
        button.type = "button";
        button.textContent = label;
        return button;
      };

      const populateTechFilters = () => {
        techFiltersContainer.innerHTML = "";

        const techSet = new Set();
        projects.forEach((project) => {
          (project.tech || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .forEach((t) => techSet.add(t));
        });

        const techs = Array.from(techSet).sort();

        if (techs.length === 0) {
          techFiltersContainer.classList.add("hidden");
          return;
        }

        techFiltersContainer.classList.remove("hidden");

        // Reset button
        techFiltersContainer.appendChild(
          makeTechButton("All Techs", "all", true),
        );

        techs.forEach((tech) => {
          techFiltersContainer.appendChild(makeTechButton(tech, tech, false));
        });

        // Wire events once
        techFiltersContainer.addEventListener("click", (e) => {
          const btn = e.target.closest(".tech-filter");
          if (!btn) return;

          document.querySelectorAll(".tech-filter").forEach((b) => {
            b.classList.remove(
              "active",
              "border-yellow-400",
              "text-yellow-300",
              "bg-yellow-400/10",
            );
            b.classList.add("border-gray-700", "text-gray-400");
          });

          btn.classList.add(
            "active",
            "border-yellow-400",
            "text-yellow-300",
            "bg-yellow-400/10",
          );
          btn.classList.remove("border-gray-700", "text-gray-400");

          const selectedTech = btn.getAttribute("data-tech");
          renderProjects(selectedTech === "all" ? null : selectedTech);
        });
      };

      // ---------- Render projects ----------
      const renderProjects = (tech) => {
        portfolioGrid.innerHTML = "";

        const filtered = projects.filter((project) => {
          if (!tech) return true;
          return (project.tech || "")
            .toLowerCase()
            .includes(tech.toLowerCase());
        });

        const fragment = document.createDocumentFragment();

        filtered.forEach((project) => {
          const item = document.createElement("div");
          item.classList.add("item");

          const techBadges = (project.tech || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .map(
              (t) =>
                `<span class="tech-badge text-[11px] italic px-2 py-1 rounded-md border border-white/10">${t}</span>`,
            )
            .join("");

          const githubUrl = (project.github || "").replace(/\.git$/i, "");
          const readmeUrl =
            (project.readme || "").trim() ||
            (githubUrl ? `${githubUrl}#readme` : "");

          const readMoreLink = readmeUrl
            ? ` <a
                  href="${readmeUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ml-2 inline underline text-yellow-300 hover:text-yellow-200 transition-colors"
                >Read more</a>`
            : "";

          item.innerHTML = `
            <div class="card-inner">
              <div class="card-front">
                <img src="${project.image}" alt="${project.title}" loading="lazy" />
                <div class="card-overlay">
                  <div class="space-y-3">
                    <h3 class="text-xl font-bold text-white">${project.title}</h3>
                    <div class="tech-badges flex flex-wrap gap-2">
                      ${techBadges}
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-back">
                <div class="content-wrapper space-y-5">
                  <p class="text-white/90 text-sm leading-relaxed pt-6">
                    ${project.description}${readMoreLink}
                  </p>

                  <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full pt-2 sm:items-stretch">
                    <a
                      href="${project.github}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="project-btn w-full sm:flex-1 h-11 px-4 border border-purple-500/60 text-purple-300 rounded-full font-medium
                             inline-flex items-center justify-center gap-2 whitespace-nowrap
                             hover:shadow-lg hover:shadow-purple-500/25 hover:border-purple-400
                             transition-all duration-300 hover-scale"
                    >
                      <i class="fab fa-github text-base leading-none"></i>
                      <span>GitHub</span>
                    </a>

                   <a
  href="${project.live_demo}"
  target="_blank"
  rel="noopener noreferrer"
  class="project-btn w-full sm:flex-1 h-11 px-4 border border-purple-500/60 text-purple-300 rounded-full font-medium
         inline-flex items-center justify-center gap-2 whitespace-nowrap
         hover:shadow-lg hover:shadow-purple-500/25 hover:border-purple-400
         transition-all duration-300 hover-scale"
>
 <i class="fas fa-arrow-up-right-from-square text-sm"></i>
<span>Live Demo</span>
 
</a>
                  </div>
                </div>
              </div>
            </div>
          `;

          fragment.appendChild(item);
        });

        portfolioGrid.appendChild(fragment);
      };

      // ---------- Init ----------
      populateTechFilters();
      renderProjects(null);

      // API for AI assistant (tech-only)
      window.portfolioFilters = {
        filterByTech: (tech) => {
          renderProjects(tech);
          return projects.filter((p) =>
            !tech
              ? true
              : (p.tech || "").toLowerCase().includes(tech.toLowerCase()),
          );
        },
        getProjects: () => projects,
      };
    })
    .catch((error) => console.error("Error loading JSON file:", error));
});
