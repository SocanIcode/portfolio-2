document.addEventListener("DOMContentLoaded", () => {
  fetch("json/cardsData.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const portfolioGrid = document.querySelector(".portfolio-grid");
      const techFiltersContainer = document.querySelector("#tech-filters");
      const typeFiltersContainer = document.querySelector("#type-filters");
      const projects = data.projects;

      // Standardize project types and collect available types
      const availableTypes = new Set();
      projects.forEach((p) => {
        // If a project doesn't have a type, default to 'other'
        if (!p.type) p.type = "other";
        availableTypes.add(p.type);
      });

      // Always provide 'all' in type filters
      availableTypes.add("all");

      // Create type filter cards (school, ai, personal, all)
      const typeOrder = ["all", "school", "ai", "personal", "other"];
      typeOrder.forEach((type) => {
        if (!availableTypes.has(type)) return;
        const card = document.createElement("button");
        card.classList.add(
          "type-card",
          "px-4",
          "py-2",
          "rounded-lg",
          "text-sm",
          "font-medium",
          "bg-white/5",
          "text-white",
          "hover:scale-105",
          "transition-all",
        );
        card.setAttribute("data-type", type);
        // Friendly label
        const label =
          type === "all"
            ? "All Projects"
            : type.charAt(0).toUpperCase() + type.slice(1);
        card.textContent = label;
        typeFiltersContainer.appendChild(card);
      });

      // Set activeType for combined filtering (must be declared before use)
      let activeType = "all";

      // Mark 'all' as active visually on initial load and populate tech filters
      const defaultCard = document.querySelector('.type-card[data-type="all"]');
      if (defaultCard) {
        defaultCard.classList.add("active", "ring-2", "ring-teal-500");
      }

      // Populate tech filters for the initial active type
      populateTechFilters(activeType);

      // Extract unique technologies (will be populated when a type is selected)
      function populateTechFilters(forType) {
        techFiltersContainer.innerHTML = "";
        const techSet = new Set();
        projects
          .filter((p) => forType === "all" || p.type === forType)
          .forEach((project) => {
            const techs = project.tech.split(",");
            techs.forEach((tech) => techSet.add(tech.trim()));
          });

        const allTechs = Array.from(techSet).sort();
        if (allTechs.length === 0) {
          techFiltersContainer.classList.add("hidden");
          return;
        }

        techFiltersContainer.classList.remove("hidden");

        // Add a reset 'All Techs' button
        const resetBtn = document.createElement("button");
        resetBtn.className =
          "tech-filter px-3 py-1.5 text-sm text-gray-400 border border-gray-700 rounded-md hover:border-teal-500 hover:text-teal-400 transition-all duration-300 active";
        resetBtn.setAttribute("data-tech", "all");
        resetBtn.textContent = "All Techs";
        techFiltersContainer.appendChild(resetBtn);

        allTechs.forEach((tech) => {
          const button = document.createElement("button");
          button.classList.add(
            "tech-filter",
            "px-3",
            "py-1.5",
            "text-sm",
            "text-gray-400",
            "border",
            "border-gray-700",
            "rounded-md",
            "hover:border-teal-500",
            "hover:text-teal-400",
            "transition-all",
            "duration-300",
          );
          button.setAttribute("data-tech", tech);
          button.textContent = tech;
          techFiltersContainer.appendChild(button);
        });

        // Wire tech filter events
        document.querySelectorAll(".tech-filter").forEach((button) => {
          button.addEventListener("click", () => {
            document.querySelectorAll(".tech-filter").forEach((btn) => {
              btn.classList.remove(
                "active",
                "border-teal-500",
                "text-teal-400",
                "bg-teal-500/10",
              );
              btn.classList.add("border-gray-700", "text-gray-400");
            });
            button.classList.add(
              "active",
              "border-teal-500",
              "text-teal-400",
              "bg-teal-500/10",
            );
            button.classList.remove("border-gray-700", "text-gray-400");

            const selectedTech = button.getAttribute("data-tech");
            filterProjects(
              activeType,
              selectedTech === "all" ? null : selectedTech,
            );
          });
        });
      }

      // Type card click handlers
      document.querySelectorAll(".type-card").forEach((card) => {
        card.addEventListener("click", () => {
          document
            .querySelectorAll(".type-card")
            .forEach((c) =>
              c.classList.remove("active", "ring-2", "ring-teal-500"),
            );
          card.classList.add("active", "ring-2", "ring-teal-500");
          const selectedType = card.getAttribute("data-type");
          activeType = selectedType;
          // Populate tech filters for this type
          populateTechFilters(activeType);
          // Reset tech active state by showing all techs
          filterProjects(activeType, null);
        });
      });

      function filterProjects(type, tech) {
        portfolioGrid.innerHTML = ""; // Clear current projects

        const filteredProjects = projects.filter((project) => {
          const typeMatches = type === "all" || project.type === type;
          const techMatches =
            !tech || project.tech.toLowerCase().includes(tech.toLowerCase());
          return typeMatches && techMatches;
        });

        filteredProjects.forEach((project, index) => {
          const item = document.createElement("div");
          item.classList.add(
            "item",
            "scroll-down",
            `fade-in-bottom-${index + 1}`,
          );
          item.innerHTML = `
            <div class="card-inner">
              <div class="card-front">
                <img src="${project.image}" alt="portfolio image" />
                <div class="card-overlay">
                  <h3 class="text-xl font-bold text-white mb-2">${
                    project.title
                  }</h3>
                  <div class="tech-badges">
                    ${project.tech
                      .split(", ")
                      .map((tech) => `<span class="tech-badge">${tech}</span>`)
                      .join("")}
                  </div>
                </div>
              </div>
              <div class="card-back">
                <div class="content-wrapper">
                  <h3 class="text-xl font-bold text-white mb-4">${
                    project.title
                  }</h3>
                  <p class="text-white text-sm mb-4">${project.description}</p>
                  <div class="flex gap-4 justify-center">
                  <a href="${project.github}" class="project-btn github-btn" target="_blank" rel="noopener noreferrer">
                   <a href="${project.live_demo}" class="project-btn demo-btn" target="_blank" rel="noopener noreferrer">
                      <!-- Inline SVG external-link icon to avoid relying on external icon fonts -->
                      <svg class="icon-external" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
          portfolioGrid.appendChild(item);
        });

        // Re-run the viewport check for new items
        handleScroll();
      }

      // Expose a small API so other UI (like the AI assistant) can apply filters or get projects
      window.portfolioFilters = {
        filter: (typeArg, techArg) => {
          // allow callers to pass null or undefined to keep current behavior
          const t = typeArg || activeType || "all";
          // update UI active state for type-cards
          try {
            document.querySelectorAll(".type-card").forEach((c) => {
              if (c.getAttribute("data-type") === t) {
                c.classList.add("active", "ring-2", "ring-teal-500");
              } else {
                c.classList.remove("active", "ring-2", "ring-teal-500");
              }
            });
          } catch (e) {}
          activeType = t;
          populateTechFilters(activeType);
          filterProjects(activeType, techArg || null);
          // return current filtered projects for simple reporting
          return projects.filter((project) => {
            const typeMatches =
              activeType === "all" || project.type === activeType;
            const techMatches =
              !techArg ||
              project.tech.toLowerCase().includes(techArg.toLowerCase());
            return typeMatches && techMatches;
          });
        },
        getProjects: () => projects,
        populateTechs: (t) => populateTechFilters(t || activeType),
      };

      // Initial load - show all projects (type=all, no tech filter)
      filterProjects(activeType, null);

      // Function to check if element is in viewport
      function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
        );
      }

      // Function to handle scroll event
      function handleScroll() {
        const items = document.querySelectorAll(".scroll-down");
        items.forEach((item) => {
          if (isInViewport(item)) {
            item.classList.add("inView");
          }
        });
      }

      window.addEventListener("scroll", handleScroll);
    })
    .catch((error) => {
      console.error("Error loading JSON file:", error);
    });
});

// Function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to handle scroll event
