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

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const docRef = doc(db, "situs", "pengaturan");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Judul & Tagline
            if (data.judul) document.getElementById("display-judul").innerText = data.judul;
            if (data.tagline) document.getElementById("display-tagline").innerText = data.tagline;

            // Logo
            if (data.logoUrl) {
                const logoImg = document.getElementById("display-logo");
                logoImg.src = data.logoUrl;
                document.getElementById("logo-box").style.display = "block";
            }

            // Link Pendaftaran
            const btnPendaftaran = document.getElementById("link-pendaftaran");
            if (data.pendaftaranLink) {
                btnPendaftaran.href = data.pendaftaranLink;
                btnPendaftaran.style.display = "block";
            }

            // Tombol WhatsApp
            const waContainer = document.getElementById("whatsapp-container");
            waContainer.innerHTML = "";
            for (let i = 1; i <= 3; i++) {
                if (data[`waName${i}`] && data[`waNumber${i}`]) {
                    const cleanNum = data[`waNumber${i}`].replace(/\D/g, '');
                    const a = document.createElement("a");
                    a.href = `https://wa.me/${cleanNum}?text=${encodeURIComponent("Halo, saya ingin bertanya mengenai informasi pendaftaran.")}`;
                    a.className = "btn btn-whatsapp";
                    a.target = "_blank";
                    a.innerText = `WhatsApp: ${data[`waName${i}`]}`;
                    waContainer.appendChild(a);
                }
            }

            // Brosur 4 Tingkatan
            const brochureContainer = document.getElementById("brochure-container");
            brochureContainer.innerHTML = "";
            
            const levels = [
                { key: "tkq", label: "Brosur TKQ" },
                { key: "ula", label: "Brosur ULA (SD)" },
                { key: "wustho", label: "Brosur WUSTHO (SMP)" },
                { key: "ulya", label: "Brosur ULYA (SMA)" }
            ];

            levels.forEach(lvl => {
                const fileUrl = data[`brochure_${lvl.key}`];
                const a = document.createElement("a");
                a.className = "btn btn-brochure";
                
                if (fileUrl) {
                    a.href = fileUrl;
                    a.target = "_blank";
                    a.innerText = `📥 Download ${lvl.label}`;
                } else {
                    a.href = "#";
                    a.className += " btn-disabled";
                    a.innerText = `📥 ${lvl.label} (Belum Tersedia)`;
                    a.onclick = (e) => { e.preventDefault(); alert(`Brosur ${lvl.label} belum di-upload.`); };
                }
                brochureContainer.appendChild(a);
            });
        } else {
            document.getElementById("display-judul").innerText = "Belum ada data di Firebase";
            document.getElementById("display-tagline").innerText = "Silakan isi data melalui halaman Admin terlebih dahulu.";
        }
    } catch (err) {
        console.error("Gagal memuat data dari Firebase:", err);
        document.getElementById("display-judul").innerText = "Gagal Memuat Data";
    }
});
