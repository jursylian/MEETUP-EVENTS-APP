class SearchManager {
  constructor() {
    this.searchInput = document.getElementById("search-input");
    this.locationInput = document.getElementById("location-input");
    this.searchButton = document.querySelector(".search-button");
    this.events = window.eventsData || [];

    this.eventSuggestions = [];
    this.locationSuggestions = [
      "New York, NY",
      "Mountain View, CA",
      "San Francisco, CA",
      "Los Angeles, CA",
      "Chicago, IL",
      "Miami, FL",
      "Nashville, TN",
      "Boston, MA",
      "Seattle, WA",
      "Austin, TX",
    ];

    this.init();
  }

  init() {
    if (!this.searchInput || !this.locationInput) {
      console.warn("Search inputs not found");
      return;
    }

    this.createSuggestionContainers();

    this.prepareEventSuggestions();

    this.attachEventListeners();
  }

  createSuggestionContainers() {
    this.eventSuggestionsContainer = document.createElement("div");
    this.eventSuggestionsContainer.className = "suggestions-container";
    this.eventSuggestionsContainer.id = "event-suggestions";
    this.searchInput.parentNode.appendChild(this.eventSuggestionsContainer);

    this.locationSuggestionsContainer = document.createElement("div");
    this.locationSuggestionsContainer.className = "suggestions-container";
    this.locationSuggestionsContainer.id = "location-suggestions";
    this.locationInput.parentNode.appendChild(
      this.locationSuggestionsContainer
    );
  }

  prepareEventSuggestions() {
    const eventTitles = new Set();
    const categories = new Set();

    this.events.forEach((event) => {
      if (event.title) {
        eventTitles.add(event.title);

        event.title.split(" ").forEach((word) => {
          if (word.length > 2) {
            eventTitles.add(word);
          }
        });
      }
      if (event.category) {
        categories.add(event.category);
      }
    });

    this.eventSuggestions = [
      ...Array.from(eventTitles),
      ...Array.from(categories),
      "Coffee",
      "Tech",
      "AI",
      "Networking",
      "Workshop",
      "Meetup",
      "Conference",
    ];
  }

  attachEventListeners() {
    this.searchInput.addEventListener("input", (e) => {
      this.showEventSuggestions(e.target.value);
    });

    this.searchInput.addEventListener("focus", (e) => {
      this.showEventSuggestions(e.target.value);
    });

    this.locationInput.addEventListener("input", (e) => {
      this.showLocationSuggestions(e.target.value);
    });

    this.locationInput.addEventListener("focus", (e) => {
      this.showLocationSuggestions(e.target.value);
    });

    this.searchButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.performSearch();
    });

    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.performSearch();
      }
    });

    this.locationInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.performSearch();
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-bar")) {
        this.hideSuggestions();
      }
    });
  }

  showEventSuggestions(query) {
    if (!query || query.length < 2) {
      this.eventSuggestionsContainer.style.display = "none";
      return;
    }

    const filtered = this.eventSuggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);

    if (filtered.length === 0) {
      this.eventSuggestionsContainer.style.display = "none";
      return;
    }

    this.renderSuggestions(
      this.eventSuggestionsContainer,
      filtered,
      (suggestion) => {
        this.searchInput.value = suggestion;
        this.hideSuggestions();
      }
    );
  }

  showLocationSuggestions(query) {
    if (!query || query.length < 1) {
      this.locationSuggestionsContainer.style.display = "none";
      return;
    }

    const filtered = this.locationSuggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);

    if (filtered.length === 0) {
      this.locationSuggestionsContainer.style.display = "none";
      return;
    }

    this.renderSuggestions(
      this.locationSuggestionsContainer,
      filtered,
      (suggestion) => {
        this.locationInput.value = suggestion;
        this.hideSuggestions();
      }
    );
  }

  renderSuggestions(container, suggestions, onSelect) {
    container.innerHTML = "";

    suggestions.forEach((suggestion) => {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.textContent = suggestion;
      item.addEventListener("click", () => onSelect(suggestion));
      container.appendChild(item);
    });

    container.style.display = "block";
  }

  hideSuggestions() {
    this.eventSuggestionsContainer.style.display = "none";
    this.locationSuggestionsContainer.style.display = "none";
  }

  performSearch() {
    const searchQuery = this.searchInput.value.trim();
    const locationQuery = this.locationInput.value.trim();

    console.log("Performing search:", { searchQuery, locationQuery });

    if (window.eventRenderer && window.eventRenderer.renderEvents) {
      window.eventRenderer.renderEvents(searchQuery, locationQuery);
    }

    this.hideSuggestions();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.searchManager = new SearchManager();
});
