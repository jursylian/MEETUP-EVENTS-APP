class FilterManager {
  constructor() {
    this.filters = {
      type: "all",
      distance: "all",
      category: "all",
      date: "all",
    };

    this.init();
  }

  init() {
    this.setupFilterHandlers();
    this.setupDropdownToggle();
  }

  setupFilterHandlers() {
    document.querySelectorAll(".custom-select").forEach((select) => {
      const category = select.dataset.category;
      const options = select.querySelectorAll("li");

      options.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          const value = option.dataset.value;
          this.updateFilter(category, value);
          this.updateSelectDisplay(select, option.textContent);
          this.closeAllDropdowns();

          if (window.eventRenderer) {
            window.eventRenderer.renderEvents();
          }
        });
      });
    });
  }

  setupDropdownToggle() {
    document.querySelectorAll(".custom-select").forEach((select) => {
      const selectedDiv = select.querySelector(".selected");
      const optionsList = select.querySelector(".options");

      selectedDiv.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeAllDropdowns();

        if (optionsList.classList.contains("show-options")) {
          optionsList.classList.remove("show-options");
        } else {
          const rect = selectedDiv.getBoundingClientRect();
          optionsList.style.left = rect.left + "px";
          optionsList.style.top = rect.bottom + 5 + "px";
          optionsList.style.width = rect.width + "px";
          optionsList.classList.add("show-options");
        }
      });
    });

    document.addEventListener("click", () => {
      this.closeAllDropdowns();
    });

    window.addEventListener("scroll", () => {
      this.closeAllDropdowns();
    });
  }

  updateFilter(category, value) {
    this.filters[category] = value;
  }

  updateSelectDisplay(select, text) {
    const selectedDiv = select.querySelector(".selected");
    const svg = selectedDiv.querySelector("svg");
    selectedDiv.textContent = text;
    if (svg) {
      selectedDiv.appendChild(svg);
    }
  }

  closeAllDropdowns() {
    document.querySelectorAll(".custom-select .options").forEach((options) => {
      options.classList.remove("show-options");
    });
  }

  resetFilter(category) {
    this.filters[category] = "all";

    const select = document.querySelector(
      `.custom-select[data-category="${category}"]`
    );
    const defaultOption = select.querySelector("li[data-value='all']");
    this.updateSelectDisplay(select, defaultOption.textContent);
  }

  getFilters() {
    return { ...this.filters };
  }
}

window.filterManager = new FilterManager();
