import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX9MlyLRIz7zcFUtKtnqcc4vNSOzerYMQ",
  authDomain: "linkbio-sekolah.firebaseapp.com",
  projectId: "linkbio-sekolah",
  storageBucket: "linkbio-sekolah.firebasestorage.app",
  messagingSenderId: "149105804714",
  appId: "1:149105804714:web:bea6f30b0af1a3c32fd7d3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const docSnap = await getDoc(doc(db, "situs", "pengaturan"));
        
        // Sembunyikan loading apapun yang terjadi agar halaman tidak stuck
        const loadingEl = document.getElementById("loading-container");
        if (loadingEl) loadingEl.style.display = "none";
        
        const contentEl = document.getElementById("content-container");
        if (contentEl) contentEl.style.display = "block";

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            if (document.getElementById("judul-situs")) document.getElementById("judul-situs".innerText = data.judul || "Pendaftaran Sekolah");
            if (document.getElementById("tagline-situs")) document.getElementById("tagline-situs").innerText = data.tagline || "";
            
            const btnPendaftaran = document.getElementById("btn-pendaftaran-utama");
            if (btnPendaftaran && data.pendaftaranLink) {
                btnPendaftaran.href = data.pendaftaranLink;
            }

            const levels = ["tkq", "ula", "wustho", "ulya"];
            levels.forEach(lvl => {
                const btnBrosur = document.getElementById(`btn-brosur-${lvl}`);
                if (btnBrosur && data[`brochure_${lvl}`]) {
                    btnBrosur.href = data[`brochure_${lvl}`];
                    btnBrosur.style.display = "block";
                }
            });
        }
    } catch (err) {
        console.error("Gagal memuat data publik:", err);
        // Tetap hilangkan loading jika terjadi error agar halaman bisa diakses
        const loadingEl = document.getElementById("loading-container");
        if (loadingEl) loadingEl.style.display = "none";
        const contentEl = document.getElementById("content-container");
        if (contentEl) contentEl.style.display = "block";
    }
});
