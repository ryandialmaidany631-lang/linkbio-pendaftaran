import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const pengaturanRef = doc(db, "situs", "pengaturan");
const statistikRef = doc(db, "situs", "statistik");

const adminForm = document.getElementById("admin-form");
const statusMessage = document.getElementById("status-message");
const btnSimpan = document.getElementById("btn-simpan");

// FUNGSI MEMUAT DATA LAMA KE DALAM FORM
async function muatData() {
    try {
        const docSnap = await getDoc(pengaturanRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            if(document.getElementById("judul")) document.getElementById("judul").value = data.judul || "";
            if(document.getElementById("tagline")) document.getElementById("tagline").value = data.tagline || "";
            if(document.getElementById("pendaftaranLink")) document.getElementById("pendaftaranLink").value = data.pendaftaranLink || "";
            if(document.getElementById("logoUrl")) document.getElementById("logoUrl").value = data.logoUrl || "";
            
            if(document.getElementById("waName1")) document.getElementById("waName1").value = data.waName1 || "";
            if(document.getElementById("waNumber1")) document.getElementById("waNumber1").value = data.waNumber1 || "";
            if(document.getElementById("waName2")) document.getElementById("waName2").value = data.waName2 || "";
            if(document.getElementById("waNumber2")) document.getElementById("waNumber2").value = data.waNumber2 || "";
            if(document.getElementById("waName3")) document.getElementById("waName3").value = data.waName3 || "";
            if(document.getElementById("waNumber3")) document.getElementById("waNumber3").value = data.waNumber3 || "";
            
            if(document.getElementById("brochure_tkq")) document.getElementById("brochure_tkq").value = data.brochure_tkq || "";
            if(document.getElementById("brochure_ula")) document.getElementById("brochure_ula").value = data.brochure_ula || "";
            if(document.getElementById("brochure_wustho")) document.getElementById("brochure_wustho").value = data.brochure_wustho || "";
            if(document.getElementById("brochure_ulya")) document.getElementById("brochure_ulya").value = data.brochure_ulya || "";
        }
    } catch (error) {
        console.error("Gagal memuat data:", error);
    }
}

// FUNGSI MENYIMPAN DATA (HANYA URL TEKS)
if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        const originalText = btnSimpan.innerText;
        btnSimpan.innerText = "⏳ Menyimpan Perubahan...";
        btnSimpan.disabled = true;
        statusMessage.style.display = "none";

        const newData = {
            judul: document.getElementById("judul").value,
            tagline: document.getElementById("tagline").value,
            pendaftaranLink: document.getElementById("pendaftaranLink").value,
            logoUrl: document.getElementById("logoUrl").value,
            waName1: document.getElementById("waName1").value,
            waNumber1: document.getElementById("waNumber1").value,
            waName2: document.getElementById("waName2").value,
            waNumber2: document.getElementById("waNumber2").value,
            waName3: document.getElementById("waName3").value,
            waNumber3: document.getElementById("waNumber3").value,
            brochure_tkq: document.getElementById("brochure_tkq").value,
            brochure_ula: document.getElementById("brochure_ula").value,
            brochure_wustho: document.getElementById("brochure_wustho").value,
            brochure_ulya: document.getElementById("brochure_ulya").value,
        };

        try {
            await setDoc(pengaturanRef, newData, { merge: true });
            tampilkanPesan("✅ Data berhasil disimpan!", "success");
        } catch (error) {
            console.error(error);
            tampilkanPesan("❌ Gagal menyimpan data.", "error");
        } finally {
            btnSimpan.innerText = originalText;
            btnSimpan.disabled = false;
        }
    });
}

function tampilkanPesan(pesan, tipe) {
    statusMessage.innerText = pesan;
    statusMessage.className = tipe;
    statusMessage.style.display = "block";
    setTimeout(() => { statusMessage.style.display = "none"; }, 5000);
}

// FUNGSI GRAFIK STATISTIK
async function muatStatistik() {
    try {
        const statSnap = await getDoc(statistikRef);
        let dataStats = { kunjungan: 0, dl_tkq: 0, dl_ula: 0, dl_wustho: 0, dl_ulya: 0 };
        
        if (statSnap.exists()) {
            dataStats = { ...dataStats, ...statSnap.data() }; 
        }
        
        const ctxElement = document.getElementById('statistikChart');
        if (ctxElement) {
            const ctx = ctxElement.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Kunjungan', 'Download TKQ', 'Download Ula', 'Download Wustho', 'Download Ulya'],
                    datasets: [{
                        label: 'Jumlah (Orang)',
                        data: [ dataStats.kunjungan, dataStats.dl_tkq, dataStats.dl_ula, dataStats.dl_wustho, dataStats.dl_ulya ],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.85)', 'rgba(16, 185, 129, 0.85)', 
                            'rgba(245, 158, 11, 0.85)', 'rgba(239, 68, 68, 0.85)', 'rgba(139, 92, 246, 0.85)'
                        ],
                        borderWidth: 0, borderRadius: 6, barThickness: 45
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                    plugins: { legend: { display: false } }
                }
            });
        }
    } catch (e) {
        console.error("Gagal memuat grafik statistik", e);
    }
}

// JALANKAN SAAT HALAMAN DIBUKA
window.addEventListener("DOMContentLoaded", () => {
    muatData();
    setTimeout(muatStatistik, 500); 
});
