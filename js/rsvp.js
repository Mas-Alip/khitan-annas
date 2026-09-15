import { saveRsvp, watchRsvps } from "./firebase.js";

function renderRsvpList(rsvps) {
  const list = document.getElementById("rsvp-list");
  const count = document.getElementById("rsvp-count");
  if (!list || !count) return;
  count.textContent = `${rsvps.length} konfirmasi`;
  if (!rsvps.length) {
    list.innerHTML =
      '<p class="rsvp-empty">Belum ada konfirmasi. Jadilah yang pertama.</p>';
    return;
  }
  list.innerHTML = rsvps
    .map(
      ({ name, status, message }) =>
        `<li><div class="rsvp-guest"><span>${escapeHtml(name)}</span>${message ? `<p>${escapeHtml(message)}</p>` : ""}</div><strong class="rsvp-status rsvp-status-${status.toLowerCase().replaceAll(" ", "-")}">${escapeHtml(status)}</strong></li>`,
    )
    .join("");
}
function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ],
  );
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvp-form");
  const feedback = document.getElementById("rsvp-feedback");
  const button = document.getElementById("rsvp-button");
  if (!form) return;
  watchRsvps(renderRsvpList, () => {
    const list = document.getElementById("rsvp-list");
    if (list)
      list.innerHTML =
        '<p class="rsvp-empty">Daftar RSVP belum dapat dimuat.</p>';
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const status = form.querySelector('input[name="attending"]:checked')?.value;
    const message = form.elements.message.value.trim();
    if (!name) {
      feedback.textContent = "Nama wajib diisi.";
      form.elements.name.focus();
      return;
    }
    if (!status) {
      feedback.textContent = "Silakan pilih status kehadiran.";
      return;
    }
    button.disabled = true;
    feedback.textContent = "Menyimpan konfirmasi...";
    try {
      await saveRsvp({ name, status, message });
      feedback.textContent = "Konfirmasi berhasil disimpan.";
      form.reset();
    } catch (error) {
      console.error("RSVP tidak dapat disimpan:", error);
      feedback.textContent =
        "Konfirmasi belum tersimpan. Periksa koneksi lalu coba lagi.";
    } finally {
      button.disabled = false;
    }
  });
});
