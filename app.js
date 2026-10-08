import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
    // =========================================================
    // 1. TAMPILKAN HALAMAN WEB TERLEBIH DAHULU (Prioritas Utama)
    // =========================================================
    try {
        const docSnap = await getDoc(doc(db, "situs", "pengaturan"));
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Judul & Tagline
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
            
            // Logo Sekolah
            const logoContainer = document.getElementById("logo-container");
            const displayLogo = document.getElementById("display-logo");
            if (data.logoUrl && logoContainer && displayLogo) {
                displayLogo.src = data.logoUrl;
                logoContainer.style.display = "block";
            }

            // Website Pendaftaran
            const linkPendaftaran = document.getElementById("link-pendaftaran");
            if (linkPendaftaran && data.pendaftaranLink) {
                linkPendaftaran.href = data.pendaftaranLink;
                linkPendaftaran.style.display = "block";
            }

            // Kontak WhatsApp
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

            // Brosur & Popup
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
                        brochureHtml += `<a href="#" class="view-brochure-btn" data-url="${url}" data-tingkat="${lvl.key}" data-name="${lvl.label.replace(/\s+/g, '_')}.jpg">📄 ${lvl.label}</a>`;
                    }
                });
                
                if (hasBrochure) {
                    brochureContainer.innerHTML = brochureHtml;
                    brochureWrapper.style.display = "block";

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
                                const fileName = btn.getAttribute('data-name');
                                const tingkat = btn.getAttribute('data-tingkat');
                                
                                imgElement.src = url; 
                                downloadBtn.setAttribute('data-url', url); 
                                downloadBtn.setAttribute('data-filename', fileName);
                                downloadBtn.setAttribute('data-tingkat', tingkat);
                                modal.style.display = 'flex'; 
                            });
                        });

                        downloadBtn.addEventListener('click', async (e) => {
                            e.preventDefault();
                            const url = downloadBtn.getAttribute('data-url');
                            const fileName = downloadBtn.getAttribute('data-filename');
                            const tingkat = downloadBtn.getAttribute('data-tingkat');
                            if (!url) return;

                            // Catat log download dengan aman
                            if (tingkat) {
                                try {
                                    await updateDoc(doc(db, "situs", "statistik"), { [`dl_${tingkat}`]: increment(1) });
                                } catch(err) { /* Abaikan jika error agar tidak mengganggu download */ }
                            }

                            const originalText = downloadBtn.innerText;
                            downloadBtn.innerText = "⏳ Memproses...";
                            downloadBtn.style.opacity = "0.7";

                            try {
                                const response = await fetch(url);
                                const blob = await response.blob();
                                const blobUrl = window.URL.createObjectURL(blob);
                                const tempLink = document.createElement('a');
                                tempLink.style.display = 'none';
                                tempLink.href = blobUrl;
                                tempLink.download = fileName; 
                                document.body.appendChild(tempLink);
                                tempLink.click();
                                document.body.removeChild(tempLink);
                                window.URL.revokeObjectURL(blobUrl);
                            } catch (error) {
                                alert("Gagal mendownload brosur. Silakan coba lagi.");
                            } finally {
                                downloadBtn.innerText = originalText;
                                downloadBtn.style.opacity = "1";
                            }
                        });

                        closeBtn.addEventListener('click', () => { modal.style.display = 'none'; imgElement.src = ''; });
                        modal.addEventListener('click', (e) => { if(e.target === modal) { modal.style.display = 'none'; imgElement.src = ''; } });
                    }
                }
            }
        }
    } catch (err) {
        console.error("Gagal memuat data:", err);
        const judul = document.getElementById("display-judul");
        if(judul) judul.innerText = "Sistem Sedang Sibuk, Coba Muat Ulang (Refresh)";
    }

    // =========================================================
    // 2. CATAT KUNJUNGAN DI BELAKANG LAYAR (Delay 1.5 detik)
    // =========================================================
    setTimeout(async () => {
        try {
            const statRef = doc(db, "situs", "statistik");
            try {
                await updateDoc(statRef, { kunjungan: increment(1) });
            } catch (e) {
                // Buat dokumen jika belum ada
                await setDoc(statRef, { kunjungan: 1, dl_tkq: 0, dl_ula: 0, dl_wustho: 0, dl_ulya: 0 }, { merge: true });
            }
        } catch (fatalErr) {
            console.log("Statistik Mode Aman.");
        }
    }, 1500);
});
