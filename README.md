# Digital Invitation — Tasyakuran Khitan

Undangan digital Tasyakuran Khitan untuk Annas Maulud Trivano. Website ini menggunakan HTML, CSS, dan Vanilla JavaScript tanpa framework, backend, database, atau build tools.

## Project Structure

The project is organized as follows:

```
digital-invitation-khitan
├── index.html          # Semantic HTML structure for the invitation
├── favicon.svg         # Favicon for the website
├── css
│   ├── style.css       # Main styles including variables and layout
│   └── responsive.css   # Responsive styles for different devices
├── js
│   ├── main.js         # Initialization and UI interactions
│   ├── countdown.js     # Countdown logic for the event
│   └── rsvp.js         # RSVP form handling
├── assets
│   ├── images
│   │   ├── anak        # Images of the child
│   │   ├── background   # Background images
│   │   └── decorations  # Decorative images
│   ├── icons           # Icon images
│   └── music           # Music files
├── data
│   └── config.js       # Centralized configuration object
├── reference
│   └── poster-khitan.jpeg # Reference image for design
└── README.md           # Documentation for the project
```

## Menjalankan secara lokal

1. Buka folder project di VS Code.
2. Jalankan `python3 -m http.server 8000` dari root project, atau buka `index.html` langsung di browser.
3. Akses `http://localhost:8000` jika menggunakan server lokal.

## Features

- **Mobile-First Design**: The website is optimized for mobile devices, ensuring a seamless experience for users.
- **Responsive Layout**: The layout adapts to various screen sizes, including tablets and desktops.
- **Semantic HTML**: The structure of the HTML is semantic, improving accessibility and SEO.
- **Lightweight**: Website dibangun tanpa dependency eksternal.

## Future Development

Data undangan dan aset utama sudah terpasang: foto berada di `assets/images/contoh_foto.jpeg`, musik berada di `assets/music/lagu_khitan.mp3`, dan acara berlangsung pada 30 September 2026 pukul 09.00 WIB.

Untuk mengisi lokasi Google Maps, buka `data/config.js`, lalu isi nilai `location.mapsUrl` dengan link Google Maps milik keluarga. Contoh: `mapsUrl:"https://maps.app.goo.gl/tautan-anda"`. Tombol **Lihat Lokasi** akan otomatis memakai link tersebut.

### Firebase RSVP

Konfigurasi Firebase berada di `js/firebase.js`. Form RSVP menyimpan data ke koleksi Firestore `rsvps` dan menampilkan daftar konfirmasi secara realtime di website. Tombol **Hubungi Kami** tetap menjadi jalur WhatsApp terpisah. Aktifkan Firestore Database dan gunakan rules berikut agar pengunjung dapat melihat daftar RSVP:

```txt
rules_version = '2';

service cloud.firestore {
	match /databases/{database}/documents {
		match /rsvps/{rsvpId} {
			allow create: if
				request.resource.data.name is string &&
				request.resource.data.name.size() >= 2 &&
				request.resource.data.name.size() <= 80 &&
				request.resource.data.status in ['Hadir', 'Tidak hadir', 'Masih ragu'] &&
				request.resource.data.message is string &&
				request.resource.data.message.size() <= 240;

			allow read: if true;
			allow update, delete: if false;
		}
	}
}
```

## Deploy ke GitHub Pages

Push isi repository ke GitHub, lalu pilih **Settings → Pages → Deploy from a branch**. Pilih branch utama dan folder root (`/`); GitHub Pages akan menyajikan `index.html` sebagai static website.

## License

This project is open-source and available for anyone to use and modify.