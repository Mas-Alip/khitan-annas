import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpFIx9p9iMqeQuFLsgbznTeFrXhcgFytg",
  authDomain: "khitan-annas.firebaseapp.com",
  projectId: "khitan-annas",
  storageBucket: "khitan-annas.firebasestorage.app",
  messagingSenderId: "495008299621",
  appId: "1:495008299621:web:da67f6d662b55751f6648c",
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

export function saveRsvp({ name, status, message }) {
  return addDoc(collection(firestore, "rsvps"), {
    name,
    status,
    message,
    event: "Tasyakuran Khitan Annas Maulud Trivano",
    eventDate: "2026-09-30T09:00:00+07:00",
    createdAt: serverTimestamp(),
  });
}

export function watchRsvps(onChange, onError) {
  const rsvpsQuery = query(
    collection(firestore, "rsvps"),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    rsvpsQuery,
    (snapshot) => {
      onChange(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })),
      );
    },
    onError,
  );
}
