document.addEventListener("DOMContentLoaded", () => {
  fetch("json/cardsData.json")
    .then((response) => response.json())
    .then((data) => {
      const portfolioGrid = document.querySelector(".portfolio-grid");
      const techFiltersContainer = document.querySelector("#tech-filters");
      const typeFiltersContainer = document.querySelector("#type-filters");

      if (!portfolioGrid || !techFiltersContainer) return;

      if (typeFiltersContainer) typeFiltersContainer.classList.add("hidden");

      const projects = Array.isArray(data.projects) ? data.projects : [];

      // ---------- Helpers ----------
      const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight - 30;
      };

      const handleScroll = () => {
        document.querySelectorAll(".scroll-down").forEach((item) => {
          if (isInViewport(item)) item.classList.add("inView");
        });
      };

      // ---------- Tech filters ----------
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

        //  Techs reset button
        techFiltersContainer.appendChild(
          makeTechButton("All Techs", "all", true),
        );

        techs.forEach((tech) => {
          techFiltersContainer.appendChild(makeTechButton(tech, tech, false));
        });

        // Wire events
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

        filtered.forEach((project, index) => {
          const item = document.createElement("div");
          item.classList.add(
            "item",
            "scroll-down",
            `fade-in-bottom-${Math.min(index + 1, 3)}`,
          );

          const techBadges = (project.tech || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .map(
              (t) =>
                `<span class="tech-badge text-[11px] italic px-2 py-1 rounded-md border border-white/10">${t}</span>`,
            )
            .join("");
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
        <p class="text-white/90 text-sm leading-relaxed py-6">
          ${project.description}
        </p>

        <div class="flex gap-4 justify-center w-full pt-2">
          <a
            href="${project.github}"
            target="_blank"
            rel="noopener noreferrer"
            class="project-btn flex-1 px-4 py-2 border border-purple-500/60 text-purple-300 rounded-full font-medium
                   flex items-center justify-center gap-2
                   hover:shadow-lg hover:shadow-purple-500/25 hover:border-purple-400
                   transition-all duration-300 hover-scale"
          >
            <i class="fab fa-github"></i>
            GitHub
          </a>

          <a
            href="${project.live_demo}"
            target="_blank"
            rel="noopener noreferrer"
            class="project-btn flex-1 px-4 py-2 border border-purple-500/60 text-purple-300 rounded-full font-medium
                   flex items-center justify-center gap-2
                   hover:shadow-lg hover:shadow-purple-500/25 hover:border-purple-400
                   transition-all duration-300 hover-scale"
          >
            <svg
              class="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M14 3h7v7M21 3L10 14"/>
              <rect x="3" y="8" width="11" height="13" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Live Demo
          </a>
        </div>
      </div>
    </div>
  </div>
`;
          fragment.appendChild(item);
        });

        portfolioGrid.appendChild(fragment);
        handleScroll();
      };

      // ---------- Init ----------
      populateTechFilters();
      renderProjects(null);
      window.addEventListener("scroll", handleScroll);

      // Keep a small API for your AI assistant (tech-only now)
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
