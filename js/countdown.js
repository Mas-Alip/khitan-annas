function getCountdownDates() {
  if (typeof invitationConfig === "undefined") return { start: NaN, end: NaN };
  return {
    start: Date.parse(invitationConfig.event.startDate),
    end: Date.parse(invitationConfig.event.endDate),
  };
}
function updateCountdown() {
  const timer = document.getElementById("countdown-timer");
  const dates = getCountdownDates();
  if (!timer || Number.isNaN(dates.start)) return false;
  const now = Date.now();
  if (now >= dates.end) {
    timer.innerHTML = '<p class="countdown-status">Acara telah selesai</p>';
    return false;
  }
  if (now >= dates.start) {
    timer.innerHTML =
      '<p class="countdown-status">Acara sedang berlangsung</p>';
    return false;
  }
  const distance = dates.start - now;
  const values = [
    Math.floor(distance / 86400000),
    Math.floor((distance % 86400000) / 3600000),
    Math.floor((distance % 3600000) / 60000),
    Math.floor((distance % 60000) / 1000),
  ];
  timer.querySelectorAll(".countdown-item strong").forEach((element, index) => {
    element.textContent = String(values[index]).padStart(2, "0");
  });
  return true;
}
document.addEventListener("DOMContentLoaded", () => {
  if (!updateCountdown()) return;
  const interval = window.setInterval(() => {
    if (!updateCountdown()) window.clearInterval(interval);
  }, 1000);
});
