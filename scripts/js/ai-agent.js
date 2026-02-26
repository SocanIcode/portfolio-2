// Simple local AI-like assistant (rule-based) to parse short queries and apply filters
// This is intentionally lightweight and runs entirely in the browser.

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("ai-toggle");
  const panel = document.getElementById("ai-panel");
  const closeBtn = document.getElementById("ai-close");
  const form = document.getElementById("ai-form");
  const input = document.getElementById("ai-input");
  const messages = document.getElementById("ai-messages");

  if (!toggle) return;

  function appendMessage(text, self = false) {
    const el = document.createElement("div");
    el.className = self ? "ai-msg ai-msg-self" : "ai-msg ai-msg-bot";
    // Use smaller font and chat bubble style
    el.innerHTML = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  // Welcome message
  let greeted = false;
  function greet() {
    if (!greeted) {
      appendMessage(
        `<b>Hi, I'm azeb!</b><br>Welcome to my portfolio 👋<br>Ask me about my projects, e.g.:<br><span class='ai-hint'>'show school projects with React'</span> or <span class='ai-hint'>'show all'</span>.`,
        false
      );
      greeted = true;
    }
  }

  // Toggle open/close on button click, and close on outside click
  let panelOpen = false;
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (panelOpen) {
      panel.setAttribute("aria-hidden", "true");
      panel.style.display = "none";
      panelOpen = false;
    } else {
      panel.setAttribute("aria-hidden", "false");
      panel.style.display = "block";
      greet();
      input.focus();
      panelOpen = true;
    }
  });
  // Close if click outside panel
  document.addEventListener("mousedown", (e) => {
    if (
      panelOpen &&
      !panel.contains(e.target) &&
      e.target !== toggle
    ) {
      panel.setAttribute("aria-hidden", "true");
      panel.style.display = "none";
      panelOpen = false;
    }
  });
  closeBtn.addEventListener("click", () => {
    panel.setAttribute("aria-hidden", "true");
    panel.style.display = "none";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, true);
    input.value = "";

    // Small talk and positive responses
    const lower = text.toLowerCase();
    if (
      /(hi|hello|hey|welcome|who are you|your name|about you)/.test(
        lower
      )
    ) {
      appendMessage(
        "Hi! I'm azeb, your portfolio guide. Ask me about my projects or filter by type or technology!"
      );
      return;
    }
    if (/thank(s| you)/.test(lower)) {
      appendMessage(
        "You're welcome! 😊 If you want to see a project, just ask."
      );
      return;
    }
    if (/how are you/.test(lower)) {
      appendMessage(
        "I'm doing great, thank you! How can I help you explore my work?"
      );
      return;
    }

    // Project filtering logic
    if (lower.includes("show all") || lower === "all") {
      appendMessage("Showing all my projects:");
      const res = window.portfolioFilters.filter("all", null);
      if (res.length > 0) {
        appendMessage(
          `I have ${res.length} projects. Let me know if you want to filter by technology or type!`
        );
      } else {
        appendMessage(
          "Oops, I couldn't find any projects right now."
        );
      }
      return;
    }

    // detect type (school, ai, personal)
    const types = ["school", "ai", "personal"];
    let detectedType = null;
    types.forEach((t) => {
      if (lower.includes(t)) detectedType = t;
    });

    // detect tech: look for common tech keywords in the input
    const possibleTechs = [
      "react",
      "next.js",
      "next",
      "tailwind",
      "html",
      "css",
      "javascript",
      "typescript",
      "scss",
      "bootstrap",
      "firebase",
      "stripe",
      "clerk",
    ];
    let detectedTech = null;
    possibleTechs.forEach((tech) => {
      if (lower.includes(tech)) detectedTech = tech;
    });

    if (detectedType) {
      appendMessage(
        `Here are my <b>${detectedType}</b> projects${
          detectedTech ? ` using <b>${detectedTech}</b>` : ""
        }:`
      );
      const res = window.portfolioFilters.filter(
        detectedType,
        detectedTech
      );
      if (res.length > 0) {
        appendMessage(
          `I found ${res.length} project${
            res.length > 1 ? "s" : ""
          }. Want to know more about any of them?`
        );
      } else {
        appendMessage(
          "Sorry, I couldn't find any projects matching that filter. Try another technology or type!"
        );
      }
      return;
    }

    // fallback: if user asks for a tech only
    if (detectedTech) {
      appendMessage(
        `Looking for projects using <b>${detectedTech}</b>...`
      );
      const res = window.portfolioFilters.filter("all", detectedTech);
      if (res.length > 0) {
        appendMessage(
          `I found ${res.length} project${
            res.length > 1 ? "s" : ""
          }. Want to filter by type too?`
        );
      } else {
        appendMessage(
          "Sorry, I couldn't find any projects with that technology. Try another tech or type!"
        );
      }
      return;
    }

    // otherwise, respond with guidance
    appendMessage(
      "I'm not sure what you mean, but you can ask things like:<br><span class='ai-hint'>'show school projects with React'</span> or <span class='ai-hint'>'show all'</span>."
    );
  });
});
