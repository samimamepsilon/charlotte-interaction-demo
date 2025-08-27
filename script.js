// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

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
    icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
  };
}

// Timeline chevron functionality (special case due to additional elements)
function handleTimelineChevron() {
  const timelineContainer = this.closest(".timeline-ele-container");
  const branches = timelineContainer.querySelectorAll(".timeline-ele-branch");
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
  icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
}

// Legal text chevron functionality (special case for parent/child logic)
function handleLegalChevron() {
  const targetId = this.getAttribute("data-legal-target");
  
  if (targetId === "legal-text-1") {
    // Parent chevron - toggle all children
    const legalTextChildren = $$(".legal-text-child");
    const isVisible = getComputedStyle(legalTextChildren[0]).display !== "none";
    
    legalTextChildren.forEach(child => child.style.display = isVisible ? "none" : "flex");
    
    const icon = this.querySelector(".chevron-icon");
    icon.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
  } else {
    // Child chevron - use generic toggle
    createChevronToggle("legal").call(this);
  }
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  $(".container").setAttribute("data-theme", savedTheme);
  $("#themeText").textContent = savedTheme === "light" ? "Dark Theme" : "Light Theme";

  // Event listeners
  $("#themeToggle")?.addEventListener("click", toggleTheme);
  
  $$(".h3-t").forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.getAttribute("data-tab")));
  });

  // Chevron event listeners
  $$(".chevron-button").forEach(btn => btn.addEventListener("click", handleTimelineChevron));
  $$(".legal-chevron").forEach(btn => btn.addEventListener("click", handleLegalChevron));
  $$(".design-chevron").forEach(btn => {
    btn.addEventListener("click", createChevronToggle("design"));
  });

  // Initialize with Design tab active
  switchTab("design");
});
