function getElementById(id) {
  return document.getElementById(id);
}
function formatEventDate(value) {
  if (!value) return "Tanggal akan diinformasikan";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}
function populateInvitation() {
  if (typeof invitationConfig === "undefined") return;
  const values = {
    "cover-child-name": invitationConfig.child.name,
    "child-name": invitationConfig.child.name,
    "event-time": invitationConfig.event.time || "Waktu akan diinformasikan",
    "event-start-date": formatEventDate(invitationConfig.event.startDate),
    "event-end-date": formatEventDate(invitationConfig.event.endDate),
    "location-title": invitationConfig.location.name,
    "location-address": invitationConfig.location.address,
    "family-title": invitationConfig.family.name,
    "family-description": `(${invitationConfig.family.description})`,
  };
  Object.entries(values).forEach(([id, value]) => {
    const element = getElementById(id);
    if (element && value) element.textContent = value;
  });
  ["cover-child-photo", "child-photo"].forEach((id) => {
    const photo = getElementById(id);
    if (photo && invitationConfig.child.photo)
      photo.src = invitationConfig.child.photo;
  });
}
function setupNavigation() {
  const openButton = getElementById("open-invitation");
  if (openButton)
    openButton.addEventListener("click", () => {
      document.body.classList.add("invitation-open");
      getElementById("opening")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.dispatchEvent(new CustomEvent("invitation:opened"));
    });
}
function setupMaps() {
  const link = getElementById("maps-link");
  if (!link || typeof invitationConfig === "undefined") return;
  const location = invitationConfig.location;
  const destination =
    location.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.name}, ${location.address}`)}`;
  link.href = destination;
}
function setupContact() {
  const link = getElementById("contact-whatsapp");
  if (!link || typeof invitationConfig === "undefined") return;
  const whatsapp = invitationConfig.contact.whatsapp;
  link.addEventListener("click", (event) => {
    if (!whatsapp.number) {
      event.preventDefault();
      const feedback = getElementById("contact-feedback");
      if (feedback) feedback.textContent = "Nomor WhatsApp belum tersedia.";
      return;
    }
    window.open(
      `https://wa.me/${whatsapp.number.replace(/\D/g, "")}?text=${encodeURIComponent(whatsapp.defaultMessage || "")}`,
      "_blank",
      "noopener,noreferrer",
    );
  });
}
function setupMusic() {
  const audio = getElementById("background-music");
  const toggle = getElementById("music-toggle");
  if (!audio || !toggle || typeof invitationConfig === "undefined") return;
  const settings = invitationConfig.audio || {};
  audio.src = settings.src || "";
  audio.loop = settings.loop !== false;
  audio.volume = Math.min(1, Math.max(0, Number(settings.volume) || 0.35));
  const updateState = (isPlaying) => {
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.setAttribute(
      "aria-label",
      isPlaying ? "Matikan musik" : "Nyalakan musik",
    );
    const label = toggle.querySelector("span");
    if (label) label.textContent = isPlaying ? "Music ON" : "Music OFF";
  };
  const play = () => {
    if (!settings.enabled || !audio.src) return;
    audio
      .play()
      .then(() => updateState(true))
      .catch(() => updateState(false));
  };
  toggle.addEventListener("click", () => {
    if (audio.paused) play();
    else {
      audio.pause();
      updateState(false);
    }
  });
  window.addEventListener("invitation:opened", play, { once: true });
}
function setupReveal() {
  const elements = document.querySelectorAll("section:not(#cover),.card");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  elements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  populateInvitation();
  setupNavigation();
  setupMaps();
  setupContact();
  setupMusic();
  setupReveal();
});
