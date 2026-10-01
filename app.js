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
            
            // 1. Judul & Tagline (Pemisahan Baris)
            const judulEl = document.getElementById("display-judul");
            if (judulEl) {
                let rawJudul = data.judul || "TKQ Luqmanul Hakim Ponpes Luqmanul Hakim Medan";
                if (rawJudul.toUpperCase().includes("PONPES")) {
                    let parts = rawJudul.split(/ponpes/i);
                    let baris1 = parts[0].trim();
                    let baris2 = "PONPES " + parts[1].trim();
                    judulEl.innerHTML = `${baris1}<br><span style="font-size: 17px; font-weight: 700; color: #2563eb; display: inline-block; margin-top: 4px;">${baris2}</span>`;
                } else {
                    judulEl.innerText = rawJudul;
                }
            }
            
            const taglineEl = document.getElementById("display-tagline");
            if (taglineEl) taglineEl.innerText = data.tagline || "Link Pendaftaran & Info Pendaftaran";
            
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

            // 4. Kontak WhatsApp
            const waWrapper = document.getElementById("whatsapp-section-wrapper");
            const waContainer = document.getElementById("whatsapp-container");
            if (waContainer && waWrapper) {
                let waHtml = "";
                let hasWa = false;
                for (let i = 1; i <= 3; i++) {
                    const name = data[`waName${i}`];
                    let rawNumber = data[`waNumber${i}`] || "";
                    let cleanNumber = rawNumber.replace(/[^0-9]/g, "");
                    if (name && cleanNumber) {
                        hasWa = true;
                        waHtml += `<a href="https://wa.me/${cleanNumber}" target="_blank">${name}</a>`;
                    }
                }
                if (hasWa) {
                    waContainer.innerHTML = waHtml;
                    waWrapper.style.display = "block";
                }
            }

            // 5. Brosur dengan Fitur Popup Layar Penuh Hitam
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
                        brochureHtml += `<a href="#" class="view-brochure-btn" data-url="${url}">📄 ${lvl.label}</a>`;
                    }
                });
                
                if (hasBrochure) {
                    brochureContainer.innerHTML = brochureHtml;
                    brochureWrapper.style.display = "block";

                    // LOGIKA POPUP GAMBAR FULLSCREEN
                    const btns = brochureContainer.querySelectorAll('.view-brochure-btn');
                    const modal = document.getElementById('brochure-modal');
                    const imgElement = document.getElementById('brochure-image');
                    const downloadBtn = document.getElementById('download-brochure-btn');
                    const closeBtn = document.getElementById('close-modal');

                    if (modal && imgElement && downloadBtn && closeBtn) {
                        btns.forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                e.preventDefault(); 
                                const url = btn.getAttribute('data-url');
                                imgElement.src = url; // Muat gambar ke tengah layar
                                downloadBtn.href = url; // Atur link download
                                modal.style.display = 'flex'; 
                            });
                        });

                        closeBtn.addEventListener('click', () => {
                            modal.style.display = 'none';
                            imgElement.src = ''; 
                        });

                        // Tutup otomatis jika layar hitam diklik
                        modal.addEventListener('click', (e) => {
                            if(e.target === modal) {
                                modal.style.display = 'none';
                                imgElement.src = '';
                            }
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error("Gagal memuat data:", err);
    }
});
