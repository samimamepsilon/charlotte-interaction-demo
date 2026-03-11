// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Log that script is loading
console.log("script.js file loaded");

// Theme switching functionality
function toggleTheme() {
  const container = $(".container");
  const themeText = $("#themeText");
  const currentTheme = container.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  container.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeText.textContent = newTheme === "light" ? "Dark Theme" : "Light Theme";
}

// Tab switching functionality
function switchTab(tabName) {
  $$(".h3-t").forEach(tab => tab.classList.remove("tab1"));
  $$(".content-section").forEach(section => section.style.display = "none");
  
  $(`[data-tab="${tabName}"]`)?.classList.add("tab1");
  $(`[data-content="${tabName}"]`).style.display = "flex";
  updateTabIndicator();
  applyToggleSizeState();
}

function applyToggleSizeState() {
  const toggleItems = $$(".toggle-size .toggle-item");
  const activeIndex = Array.from(toggleItems).findIndex(b => b.classList.contains("is-selected"));
  const hideLeft = activeIndex === 1;
  const header2 = $(".header2");
  if (header2) header2.classList.toggle("artboard-expanded", hideLeft);
  const activeSection = $(".content-section[style*='flex']");
  if (!activeSection) return;
  const leftDiv = activeSection.querySelector(".left-div");
  const canvasDiv = activeSection.querySelector(".canvas");
  if (leftDiv) leftDiv.style.display = hideLeft ? "none" : "";
  if (canvasDiv) canvasDiv.style.gridColumn = hideLeft ? "span 8" : "";
}

// Sliding indicator for tab bar
function updateTabIndicator() {
  const tabBar = $(".header-3-tabs");
  const selected = $(".h3-t.tab1");
  if (!tabBar || !selected) return;
  tabBar.style.setProperty("--indicator-width", `${selected.offsetWidth}px`);
  tabBar.style.setProperty("--indicator-left", `${selected.offsetLeft - 4}px`);
}

// Sliding indicator for icon toggle size control
function updateToggleSizeIndicator() {
  const container = $(".toggle-size");
  const selected = $(".toggle-size .toggle-item.is-selected");
  if (!container || !selected) return;
  container.style.setProperty("--toggle-size-width", `${selected.offsetWidth}px`);
  container.style.setProperty("--toggle-size-left", `${selected.offsetLeft - 4}px`);
}

// Generic chevron toggle function — simple display show/hide
function createChevronToggle(targetAttribute) {
  return function() {
    const targetId = this.getAttribute(`data-${targetAttribute}-target`);
    const targetElement = $(`[data-${targetAttribute}-child="${targetId}"]`);
    if (!targetElement) return;

    const isVisible = getComputedStyle(targetElement).display !== "none";
    targetElement.style.display = isVisible ? "none" : "flex";

    const icon = this.querySelector(".chevron-icon");
    if (icon) {
      icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
    }
  };
}

// Timeline chevron functionality (special case due to additional elements)
function handleTimelineChevron() {
  const timelineContainer = this.closest(".timeline-ele-container");
  if (!timelineContainer) return; // Not a timeline chevron
  
  const branches = timelineContainer.querySelectorAll(".timeline-ele-branch");
  if (!branches || branches.length === 0) return;
  
  const isVisible = getComputedStyle(branches[0]).display !== "none";

  // Toggle branches
  branches.forEach(branch => branch.style.display = isVisible ? "none" : "flex");

  // Toggle additional timeline elements
  const timelineElement = this.closest(".timeline-container");
  const timelineIndex = Array.from($$(".timeline-container")).indexOf(timelineElement);
  const timelineNumber = timelineIndex + 1;

  $$(`.middle-t .timeline-element.additional[data-timeline="${timelineNumber}"]`)
    .forEach(element => element.style.display = isVisible ? "none" : "flex");

  // Rotate icon
  const icon = this.querySelector(".chevron-icon");
  if (icon) {
    icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
  }
}

// Toggle a parent section by selector prefix and rotate chevron (used for legal-text, click-index, rating)
function toggleParentByPrefix(prefix) {
  const children = $$(`.legal-text-child[data-legal-child^="${prefix}"]`);
  if (!children.length) return;
  const isVisible = getComputedStyle(children[0]).display !== "none";
  children.forEach(el => (el.style.display = isVisible ? "none" : "flex"));
  const icon = this.querySelector(".chevron-icon");
  if (icon) icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
}

// Legal text chevron functionality (special case for parent/child logic)
function handleLegalChevron() {
  const targetId = this.getAttribute("data-legal-target");
  const parentPrefixes = {
    "legal-text-1": "legal-text",
    "click-index-1": "click-index",
    "rating-1": "rating"
  };
  if (parentPrefixes[targetId]) {
    toggleParentByPrefix.call(this, parentPrefixes[targetId]);
  } else {
    // Simple show/hide for legal content panels (no animation)
    const targetElement = $(`[data-legal-child="${targetId}"]`);
    if (!targetElement) return;
    const isVisible = getComputedStyle(targetElement).display !== "none";
    targetElement.style.display = isVisible ? "none" : "flex";
    const icon = this.querySelector(".chevron-icon");
    if (icon) icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
  }
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", init);
} else {
  // DOM is already ready
  init();
}

function init() {
  console.log("Script loaded and DOM ready");
  
  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  const container = $(".container");
  const themeText = $("#themeText");
  
  if (!container || !themeText) {
    console.error("Required elements not found!");
    return;
  }
  
  container.setAttribute("data-theme", savedTheme);
  themeText.textContent = savedTheme === "light" ? "Dark Theme" : "Light Theme";

  // Event listeners
  const themeToggle = $("#themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
    console.log("Theme toggle button attached");
  } else {
    console.warn("Theme toggle button not found");
  }
  
  const tabs = $$(".h3-t");
  console.log(`Found ${tabs.length} tabs`);
  tabs.forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.getAttribute("data-tab")));
  });

  // Chevron event listeners - attach handlers in order of specificity
  // First, attach specific handlers (these take priority)
  const legalChevrons = $$(".legal-chevron");
  console.log(`Found ${legalChevrons.length} legal chevrons`);
  legalChevrons.forEach(btn => btn.addEventListener("click", handleLegalChevron));
  
  const designChevrons = $$(".design-chevron");
  console.log(`Found ${designChevrons.length} design chevrons`);
  designChevrons.forEach(btn => {
    btn.addEventListener("click", createChevronToggle("design"));
  });
  
  // Then attach timeline handler only to chevron buttons that aren't design or legal
  const allChevrons = $$(".chevron-button");
  let timelineCount = 0;
  allChevrons.forEach(btn => {
    // Only attach if it doesn't already have a more specific handler
    if (!btn.classList.contains("design-chevron") && !btn.classList.contains("legal-chevron")) {
      btn.addEventListener("click", handleTimelineChevron);
      timelineCount++;
    }
  });
  console.log(`Attached timeline handler to ${timelineCount} timeline chevrons`);

  // Eye toggle buttons
  $$(".t-btn.eye").forEach(btn => {
    btn.addEventListener("click", function() {
      this.classList.toggle("hidden");
    });
  });

  // Lock toggle buttons
  $$(".t-btn.lock").forEach(btn => {
    btn.addEventListener("click", function() {
      this.classList.toggle("unlocked");
    });
  });

  // Artboard selector
  const groups = $$('.artboard-selector-group');
  groups.forEach(group => {
    const artboards = group.querySelectorAll('.artboard-selector');
    artboards.forEach(artboard => {
      artboard.addEventListener('click', () => {
        artboards.forEach(b => b.classList.remove('selected'));
        artboard.classList.add('selected');
      });
    });
  });

  // Initialize with Design tab active
  switchTab("design");

  // Initialize icon toggle size control
  const toggleItems = $$(".toggle-size .toggle-item");
  toggleItems.forEach(btn => {
    btn.addEventListener("click", () => {
      toggleItems.forEach(b => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      updateToggleSizeIndicator();
      applyToggleSizeState();
    });
  });
  updateToggleSizeIndicator();

  // Keep indicators in sync on window resize
  window.addEventListener("resize", () => {
    updateTabIndicator();
    updateToggleSizeIndicator();
  });

  console.log("Initialization complete!");
}

