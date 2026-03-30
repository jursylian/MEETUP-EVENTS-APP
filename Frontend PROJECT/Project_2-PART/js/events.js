class EventRenderer {
  constructor() {
    this.container = document.getElementById("eventsList");
  }

  renderEvents(searchQuery = "", locationQuery = "") {
    if (!this.container) return;

    this.container.innerHTML = "";

    const filters = window.filterManager
      ? window.filterManager.getFilters()
      : {
          type: "all",
          distance: "all",
          category: "all",
          date: "all",
        };

    const filtered = this.filterEvents(
      eventsStore,
      filters,
      searchQuery,
      locationQuery
    );

    if (filtered.length === 0) {
      let message = "No events match your filters.";
      if (searchQuery || locationQuery) {
        message = `No events found for "${searchQuery}" ${
          locationQuery ? `in "${locationQuery}"` : ""
        }.`;
      }
      this.container.innerHTML = `<p class="no-events">${message}</p>`;
      this.renderFilterTags();
      return;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach((event, index) => {
      const eventCard = this.createEventCard(event);
      fragment.appendChild(eventCard);
      // Don't add a divider after the last event
      if (index < filtered.length - 1) {
        const divider = document.createElement("div");
        divider.className = "event-divider";
        fragment.appendChild(divider);
      }
    });

    this.container.appendChild(fragment);
    this.renderFilterTags();
  }

  filterEvents(events, filters, searchQuery = "", locationQuery = "") {
    return events.filter((event) => {
      const matchType = filters.type === "all" || event.type === filters.type;

      const matchDistance =
        filters.distance === "all" ||
        (event.type === "offline" &&
          event.distance <= parseInt(filters.distance));

      const matchCategory =
        filters.category === "all" || event.category === filters.category;

      const matchDate =
        filters.date === "all" ||
        event.date.toISOString().slice(0, 10) === filters.date;

      const matchSearch =
        !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLocation =
        !locationQuery ||
        event.type === "online" ||
        (event.location &&
          event.location.toLowerCase().includes(locationQuery.toLowerCase()));

      return (
        matchType &&
        matchDistance &&
        matchCategory &&
        matchDate &&
        matchSearch &&
        matchLocation
      );
    });
  }

  filterEventsBySearch(searchQuery = "", locationQuery = "") {
    if (!this.container) return;

    this.container.innerHTML = "";

    const filters = window.filterManager
      ? window.filterManager.getFilters()
      : {
          type: "all",
          distance: "all",
          category: "all",
          date: "all",
        };

    const filtered = this.filterEvents(
      eventsStore,
      filters,
      searchQuery,
      locationQuery
    );

    if (filtered.length === 0) {
      this.container.innerHTML = `<p class="no-events">No events found for "${searchQuery}" ${
        locationQuery ? `in "${locationQuery}"` : ""
      }.</p>`;
      return;
    }

    filtered.forEach((event) => {
      const eventCard = this.createEventCard(event);
      this.container.appendChild(eventCard);
    });
  }

  createEventCard(event) {
    const eventDate = event.date
      .toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      })
      .toUpperCase()
      .replace(/,/g, ",")
      .replace(/ AT /g, " · ");

    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <div class="event-card-image-container">
        <img src="${event.image}" alt="${
      event.title
    }" class="event-card-image" />
        ${
          event.type === "online"
            ? `<div class="online-event-badge">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>
                 Online Event
               </div>`
            : ""
        }
      </div>
      <div class="event-card-content">
        <p class="event-card-date">${eventDate}</p>
        <h3 class="event-card-title">${event.title}</h3>
        <p class="event-card-category">${event.category}${
      event.type === "offline" ? ` (${event.distance} km)` : ""
    }</p>
        ${
          event.attendees
            ? `<p class="event-card-attendees">
                 ${event.attendees} attendees
                 ${
                   event.spotsLeft
                     ? ` · <span class="spots-left">${event.spotsLeft} spots left</span>`
                     : ""
                 }
               </p>`
            : ""
        }
      </div>
    `;

    return card;
  }

  renderFilterTags() {
    const tagsContainer = document.getElementById("filterTags");
    if (!tagsContainer) return;

    tagsContainer.innerHTML = "";

    const filters = window.filterManager
      ? window.filterManager.getFilters()
      : {};

    Object.entries(filters).forEach(([category, value]) => {
      if (value === "all") return;

      const select = document.querySelector(
        `.custom-select[data-category="${category}"]`
      );
      const selectedOption = select.querySelector(`li[data-value="${value}"]`);
      const label = selectedOption ? selectedOption.textContent : value;

      const tag = this.createFilterTag(label, category);
      tagsContainer.appendChild(tag);
    });
  }

  createFilterTag(label, category) {
    const tag = document.createElement("div");
    tag.className = "filter-tag";
    tag.innerHTML = `
      <span>${label}</span>
      <button class="tag-remove" data-category="${category}">✕</button>
    `;

    const removeBtn = tag.querySelector(".tag-remove");
    removeBtn.addEventListener("click", () => {
      if (window.filterManager) {
        window.filterManager.resetFilter(category);
        this.renderEvents();
      }
    });

    return tag;
  }
}

window.eventRenderer = new EventRenderer();
