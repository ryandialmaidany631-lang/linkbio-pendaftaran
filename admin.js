import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const levels = ["tkq", "ula", "wustho", "ulya"];

async function muatDataAdmin() {
    try {
        const docRef = doc(db, "situs", "pengaturan");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();

            if (document.getElementById("input-logo-url")) document.getElementById("input-logo-url").value = data.logoUrl || "";
            if (document.getElementById("input-judul")) document.getElementById("input-judul").value = data.judul || "";
            if (document.getElementById("input-tagline")) document.getElementById("input-tagline").value = data.tagline || "";
            if (document.getElementById("input-pendaftaran")) document.getElementById("input-pendaftaran").value = data.pendaftaranLink || "";
            
            for (let i = 1; i <= 3; i++) {
                if (document.getElementById(`wa-name-${i}`)) document.getElementById(`wa-name-${i}`).value = data[`waName${i}`] || "";
                if (document.getElementById(`wa-number-${i}`)) document.getElementById(`wa-number-${i}`).value = data[`waNumber${i}`] || "";
            }

            levels.forEach(lvl => {
                const inputEl = document.getElementById(`input-brosur-${lvl}`);
                if (inputEl) {
                    inputEl.value = data[`brochure_${lvl}`] || "";
                }
            });
        }
    } catch (err) {
        console.error("Gagal memuat form admin:", err);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    muatDataAdmin();
});

// Proses Simpan Data Form Admin langsung ke Firestore
document.getElementById("form-admin").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const saveBtn = document.querySelector(".btn-save");
    const originalText = saveBtn ? saveBtn.innerText : "SIMPAN PERUBAHAN";
    if (saveBtn) {
        saveBtn.innerText = "SEDANG MENYIMPAN...";
        saveBtn.disabled = true;
    }

    try {
        const docRef = doc(db, "situs", "pengaturan");
        const docSnap = await getDoc(docRef);
        let existingData = docSnap.exists() ? docSnap.data() : {};

        let updatedData = {
            ...existingData,
            logoUrl: document.getElementById("input-logo-url")?.value.trim() || "",
            judul: document.getElementById("input-judul")?.value.trim() || "",
            tagline: document.getElementById("input-tagline")?.value.trim() || "",
            pendaftaranLink: document.getElementById("input-pendaftaran")?.value.trim() || "",
        };

        for (let i = 1; i <= 3; i++) {
            updatedData[`waName${i}`] = document.getElementById(`wa-name-${i}`)?.value.trim() || "";
            updatedData[`waNumber${i}`] = document.getElementById(`wa-number-${i}`)?.value.trim() || "";
        }

        levels.forEach(lvl => {
            const val = document.getElementById(`input-brosur-${lvl}`)?.value.trim() || "";
            updatedData[`brochure_${lvl}`] = val;
        });

        await setDoc(docRef, updatedData, { merge: true });
        
        if (saveBtn) {
            saveBtn.innerText = originalText;
            saveBtn.disabled = false;
        }

        alert("Berhasil! Perubahan telah disimpan ke database.");
        await muatDataAdmin();

    } catch (err) {
        console.error("TERJADI ERROR DETAIL:", err);
        alert("Terjadi kesalahan saat menyimpan: " + err.message);
        if (saveBtn) {
            saveBtn.innerText = originalText;
            saveBtn.disabled = false;
        }
    }
});
