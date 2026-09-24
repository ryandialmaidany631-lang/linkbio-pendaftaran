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
            
            // 1. Judul & Tagline
            const judulEl = document.getElementById("display-judul");
            if (judulEl) {
                judulEl.innerText = data.judul || "Pendaftaran Sekolah";
            }
            
            const taglineEl = document.getElementById("display-tagline");
            if (taglineEl) {
                taglineEl.innerText = data.tagline || "Informasi Pendaftaran dan Brosur Resmi";
            }
            
            // 2. Logo Sekolah
            const logoContainer = document.getElementById("logo-container");
            const displayLogo = document.getElementById("display-logo");
            if (data.logoUrl && logoContainer && displayLogo) {
                displayLogo.src = data.logoUrl;
                logoContainer.style.display = "block";
            }

            // 3. Website Pendaftaran
            const linkPendaftaran = document.getElementById("link-pendaftaran");
            if (linkPendaftaran && data.pendaftaranLink) {
                linkPendaftaran.href = data.pendaftaranLink;
                linkPendaftaran.style.display = "block";
            }

            // 4. Kontak WhatsApp (maksimal 3 admin)
            const waWrapper = document.getElementById("whatsapp-section-wrapper");
            const waContainer = document.getElementById("whatsapp-container");
            if (waContainer && waWrapper) {
                let waHtml = "";
                let hasWa = false;
                
                for (let i = 1; i <= 3; i++) {
                    const name = data[`waName${i}`];
                    const num = data[`waNumber${i}`];
                    if (name && num) {
                        hasWa = true;
                        waHtml += `<a href="https://wa.me/${num}" target="_blank" style="display:block; background-color: #22c55e; color: white; padding: 11px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 10px; font-size: 14px; box-shadow: 0 2px 4px rgba(34,197,94,0.2); transition: background 0.2s;">${name}</a>`;
                    }
                }
                
                if (hasWa) {
                    waContainer.innerHTML = waHtml;
                    waWrapper.style.display = "block";
                }
            }

            // 5. Brosur per Tingkatan (TKQ, ULA, WUSTHO, ULYA)
            const brochureWrapper = document.getElementById("brochure-section-wrapper");
            const brochureContainer = document.getElementById("brochure-container");
            if (brochureContainer && brochureWrapper) {
                const levels = [
                    { key: "tkq", label: "Brosur TKQ" },
                    { key: "ula", label: "Brosur ULA (SD)" },
                    { key: "wustho", label: "Brosur WUSTHO (SMP)" },
                    { key: "ulya", label: "Brosur ULYA (SMA)" }
                ];
                
                let brochureHtml = "";
                let hasBrochure = false;
                
                levels.forEach(lvl => {
                    const url = data[`brochure_${lvl.key}`];
                    if (url) {
                        hasBrochure = true;
                        brochureHtml += `<a href="${url}" target="_blank" style="display:block; background-color: #f8fafc; color: #1e293b; border: 1px solid #cbd5e1; padding: 11px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 10px; font-size: 14px; transition: background 0.2s;">${lvl.label}</a>`;
                    }
                });
                
                if (hasBrochure) {
                    brochureContainer.innerHTML = brochureHtml;
                    brochureWrapper.style.display = "block";
                }
            }

        } else {
            const judulEl = document.getElementById("display-judul");
            if (judulEl) judulEl.innerText = "Pendaftaran Sekolah";
        }
    } catch (err) {
        console.error("Gagal memuat data publik:", err);
        const judulEl = document.getElementById("display-judul");
        if (judulEl) judulEl.innerText = "Pendaftaran Sekolah";
    }
});
