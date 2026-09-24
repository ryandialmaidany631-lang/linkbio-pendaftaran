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
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // 1. Tampilkan Judul & Tagline
            const judulEl = document.getElementById("display-judul");
            if (judulEl) judulEl.innerText = data.judul || "Pendaftaran Sekolah";
            
            const taglineEl = document.getElementById("display-tagline");
            if (taglineEl) taglineEl.innerText = data.tagline || "Informasi Pendaftaran dan Brosur Resmi";
            
            // 2. Tampilkan Logo jika ada di database
            const logoBox = document.getElementById("logo-box");
            const displayLogo = document.getElementById("display-logo");
            if (data.logoUrl && logoBox && displayLogo) {
                displayLogo.src = data.logoUrl;
                logoBox.style.display = "block";
            }

            // 3. Website Pendaftaran Utama
            const linkPendaftaran = document.getElementById("link-pendaftaran");
            if (linkPendaftaran && data.pendaftaranLink) {
                linkPendaftaran.href = data.pendaftaranLink;
                linkPendaftaran.style.display = "block";
            }

            // 4. Tombol WhatsApp dengan Judul Bagian Kontak
            const waContainer = document.getElementById("whatsapp-container");
            if (waContainer) {
                let hasWa = false;
                let waHtml = `<div class="section-title" style="border:none; text-align:center; margin: 20px 0 10px 0; font-weight: bold; font-size: 14px; color: #555;">Kontak Informasi & Pendaftaran</div>`;
                
                for (let i = 1; i <= 3; i++) {
                    const name = data[`waName${i}`];
                    const num = data[`waNumber${i}`];
                    if (name && num) {
                        hasWa = true;
                        waHtml += `<a href="https://wa.me/${num}" target="_blank" class="btn btn-whatsapp" style="display:block; margin-bottom:10px;">${name}</a>`;
                    }
                }
                
                if (hasWa) {
                    waContainer.innerHTML = waHtml;
                }
            }

            // 5. Brosur per Tingkatan
            const brochureContainer = document.getElementById("brochure-container");
            if (brochureContainer) {
                const levels = [
                    { key: "tkq", label: "Brosur TKQ" },
                    { key: "ula", label: "Brosur ULA (SD)" },
                    { key: "wustho", label: "Brosur WUSTHO (SMP)" },
                    { key: "ulya", label: "Brosur ULYA (SMA)" }
                ];
                
                let brochureHtml = "";
                levels.forEach(lvl => {
                    const url = data[`brochure_${lvl.key}`];
                    if (url) {
                        brochureHtml += `<a href="${url}" target="_blank" class="btn btn-brochure" style="display:block; margin-bottom:10px;">${lvl.label}</a>`;
                    }
                });
                brochureContainer.innerHTML = brochureHtml;
            }

        } else {
            const judulEl = document.getElementById("display-judul");
            if (judulEl) judulEl.innerText = "Pendaftaran Sekolah";
        }
    } catch (err) {
        console.error("Gagal memuat data publik:", err);
    }
});
