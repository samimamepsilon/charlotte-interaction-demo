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
}

// Generic chevron toggle function
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

// Legal text chevron functionality (special case for parent/child logic)
function handleLegalChevron() {
  const targetId = this.getAttribute("data-legal-target");
  
  if (targetId === "legal-text-1") {
    // Parent chevron for Legal Text - toggle legal text children only
    const legalTextChildren = $$('.legal-text-child[data-legal-child^="legal-text"]');
    const isVisible = legalTextChildren.length > 0 && getComputedStyle(legalTextChildren[0]).display !== "none";
    
    legalTextChildren.forEach(child => child.style.display = isVisible ? "none" : "flex");
    
    const icon = this.querySelector(".chevron-icon");
    if (icon) {
      icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
    }
  } else if (targetId === "click-index-1") {
    // Parent chevron for Click Index - toggle click index children only
    const clickIndexChildren = $$('.legal-text-child[data-legal-child^="click-index"]');
    const isVisible = clickIndexChildren.length > 0 && getComputedStyle(clickIndexChildren[0]).display !== "none";
    
    clickIndexChildren.forEach(child => child.style.display = isVisible ? "none" : "flex");
    
    const icon = this.querySelector(".chevron-icon");
    if (icon) {
      icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
    }
  } else if (targetId === "rating-1") {
    // Parent chevron for Rating - toggle rating children only
    const ratingChildren = $$('.legal-text-child[data-legal-child^="rating"]');
    const isVisible = ratingChildren.length > 0 && getComputedStyle(ratingChildren[0]).display !== "none";
    
    ratingChildren.forEach(child => child.style.display = isVisible ? "none" : "flex");
    
    const icon = this.querySelector(".chevron-icon");
    if (icon) {
      icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
    }
  } else {
    // Child chevron - use generic toggle
    createChevronToggle("legal").call(this);
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

  // Initialize with Design tab active
  switchTab("design");
  
  console.log("Initialization complete!");
}
