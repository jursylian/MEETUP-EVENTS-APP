// JavaScript для головної сторінки
class HomePageManager {
  constructor() {
    this.searchInput = document.getElementById("home-search-input");
    this.locationInput = document.getElementById("home-location-input");
    this.searchButton = document.getElementById("home-search-button");
    this.mobileSearchBtn = document.getElementById("homeSearchBtn");
    this.mobileSearchPopup = document.getElementById("homeSearchPopup");
    this.mobileSearchClose = document.getElementById("homeSearchClose");
    this.mobileSearchForm = document.getElementById("homeSearchForm");
    this.mobileSearchInput = document.getElementById("homeMobileSearchInput");
    this.mobileLocationInput = document.getElementById(
      "homeMobileLocationInput"
    );

    this.homeEventsList = document.getElementById("homeEventsList");
    this.homeOnlineEventsList = document.getElementById("homeOnlineEventsList");

    this.events = window.eventsData || [];

    this.init();
  }

  init() {
    this.renderHomeEvents();
    this.attachEventListeners();
    this.initMobileSearch();
  }

  renderHomeEvents() {
    const offlineEvents = this.events
      .filter((event) => event.type === "offline")
      .slice(0, 8);
    this.renderEventsToContainer(offlineEvents, this.homeEventsList);

    const onlineEvents = this.events
      .filter((event) => event.type === "online")
      .slice(0, 4);
    this.renderEventsToContainer(onlineEvents, this.homeOnlineEventsList);
  }

  renderEventsToContainer(events, container) {
    if (!container) return;

    container.innerHTML = "";

    events.forEach((event) => {
      const eventCard = this.createHomeEventCard(event);
      container.appendChild(eventCard);
    });
  }

  createHomeEventCard(event) {
    const eventDate = event.date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const card = document.createElement("article");
    card.className = "event__card";

    card.innerHTML = `
      <img class="event__card-img" src="${event.image}" alt="${event.title}" />
      <h3 class="event__title">${event.title}</h3>
      <p class="event__category">${event.category}${
      event.type === "offline" && event.distance ? ` (${event.distance}km)` : ""
    }</p>
      <div class="event__date">
        <span class="material-symbols-outlined">calendar_today</span>
        <span class="event__datetime">${eventDate}</span>
      </div>
      <div class="event__meta">
        <span class="material-symbols-outlined">check_circle</span>
        <span>${event.attendees || 0} going</span>
        <span><img class="event__meta-ticket" src="icons/Ticket_icon.svg" alt="" /></span>
        <span>Free</span>
      </div>
    `;

    return card;
  }

  attachEventListeners() {
    if (this.searchButton) {
      this.searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.performSearch();
      });
    }

    if (this.searchInput) {
      this.searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.performSearch();
        }
      });
    }

    if (this.locationInput) {
      this.locationInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.performSearch();
        }
      });
    }
  }

  initMobileSearch() {
    if (
      !this.mobileSearchBtn ||
      !this.mobileSearchPopup ||
      !this.mobileSearchClose
    ) {
      return;
    }

    this.mobileSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.mobileSearchPopup.classList.add("active");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        this.mobileSearchInput.focus();
      }, 100);
    });

    this.mobileSearchClose.addEventListener("click", () => {
      this.closeMobileSearch();
    });

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.mobileSearchPopup.classList.contains("active")
      ) {
        this.closeMobileSearch();
      }
    });

    this.mobileSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchQuery = this.mobileSearchInput.value.trim();
      const locationQuery = this.mobileLocationInput.value.trim();

      this.redirectToSearch(searchQuery, locationQuery);
      this.closeMobileSearch();
    });
  }

  closeMobileSearch() {
    this.mobileSearchPopup.classList.remove("active");
    document.body.style.overflow = "";
  }

  performSearch() {
    const searchQuery = this.searchInput ? this.searchInput.value.trim() : "";
    const locationQuery = this.locationInput
      ? this.locationInput.value.trim()
      : "";

    this.redirectToSearch(searchQuery, locationQuery);
  }

  redirectToSearch(searchQuery = "", locationQuery = "") {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (locationQuery) params.set("location", locationQuery);

    const url = `index.html${params.toString() ? "?" + params.toString() : ""}`;
    window.location.href = url;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.homePageManager = new HomePageManager();
});
