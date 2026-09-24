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
        const docRef = doc(db, "situs", "pengaturan");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            if (data.judul && document.getElementById("text-judul")) {
                document.getElementById("text-judul").innerText = data.judul;
            }
            if (data.tagline && document.getElementById("text-tagline")) {
                document.getElementById("text-tagline").innerText = data.tagline;
            }
            
            const btnPendaftaran = document.getElementById("btn-pendaftaran");
            if (btnPendaftaran && data.pendaftaranLink) {
                btnPendaftaran.href = data.pendaftaranLink;
            }

            const levels = ["tkq", "ula", "wustho", "ulya"];
            levels.forEach(lvl => {
                const btnBrosur = document.getElementById(`btn-brosur-${lvl}`);
                if (btnBrosur) {
                    if (data[`brochure_${lvl}`]) {
                        btnBrosur.href = data[`brochure_${lvl}`];
                        btnBrosur.style.display = "block";
                    } else {
                        btnBrosur.style.display = "none";
                    }
                }
            });
        }
    } catch (err) {
        console.error("Gagal memuat data publik:", err);
    }
});
