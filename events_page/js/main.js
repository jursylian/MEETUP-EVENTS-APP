document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search") || "";
  const locationQuery = urlParams.get("location") || "";

  if (searchQuery) {
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = searchQuery;
  }

  if (locationQuery) {
    const locationInput = document.getElementById("location-input");
    if (locationInput) locationInput.value = locationQuery;
  }

  if (window.eventRenderer) {
    window.eventRenderer.renderEvents(searchQuery, locationQuery);
  }

  initMapPopup();

  initMobileSearch();

  console.log("Meetup app initialized");
});

function initMapPopup() {
  const mapBrowseBtn = document.querySelector(".map__browse-btn");
  const mapPopup = document.getElementById("mapPopup");
  const mapPopupClose = document.getElementById("mapPopupClose");

  if (!mapBrowseBtn || !mapPopup || !mapPopupClose) {
    console.warn("Map popup elements not found");
    return;
  }

  mapBrowseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mapPopup.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  mapPopupClose.addEventListener("click", () => {
    closeMapPopup();
  });

  mapPopup.addEventListener("click", (e) => {
    if (e.target === mapPopup) {
      closeMapPopup();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mapPopup.classList.contains("active")) {
      closeMapPopup();
    }
  });

  function closeMapPopup() {
    mapPopup.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function initMobileSearch() {
  const mobileSearchBtn = document.getElementById("mobileSearchBtn");
  const mobileSearchPopup = document.getElementById("mobileSearchPopup");
  const mobileSearchClose = document.getElementById("mobileSearchClose");
  const mobileSearchForm = document.getElementById("mobileSearchForm");
  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const mobileLocationInput = document.getElementById("mobileLocationInput");

  if (!mobileSearchBtn || !mobileSearchPopup || !mobileSearchClose) {
    console.warn("Mobile search elements not found");
    return;
  }

  mobileSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mobileSearchPopup.classList.add("active");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      mobileSearchInput.focus();
    }, 100);
  });

  mobileSearchClose.addEventListener("click", () => {
    closeMobileSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileSearchPopup.classList.contains("active")) {
      closeMobileSearch();
    }
  });

  mobileSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchQuery = mobileSearchInput.value.trim();
    const locationQuery = mobileLocationInput.value.trim();

    if (window.eventRenderer && window.eventRenderer.renderEvents) {
      window.eventRenderer.renderEvents(searchQuery, locationQuery);
    }

    closeMobileSearch();
  });

  function closeMobileSearch() {
    mobileSearchPopup.classList.remove("active");
    document.body.style.overflow = "";
  }
}
