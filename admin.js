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

// FUNGSI MEMUAT DATA FORM SEPERTI BIASA
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
    } catch (error) { console.error("Gagal memuat data:", error); }
}

// FUNGSI SIMPAN DATA 100% AMAN (MERGE: TRUE)
if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        btnSimpan.innerText = "⏳ Menyimpan...";
        btnSimpan.disabled = true;

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
            statusMessage.innerText = "✅ Data berhasil disimpan!";
            statusMessage.className = "success";
            statusMessage.style.display = "block";
        } catch (error) {
            statusMessage.innerText = "❌ Gagal menyimpan data.";
            statusMessage.className = "error";
            statusMessage.style.display = "block";
        } finally {
            btnSimpan.innerText = "💾 Simpan Perubahan";
            btnSimpan.disabled = false;
            setTimeout(() => { statusMessage.style.display = "none"; }, 4000);
        }
    });
}

// FUNGSI GRAFIK HARIAN (Mulai 1 Oktober 2026 - Hari Ini)
async function muatStatistik() {
    try {
        const statSnap = await getDoc(statistikRef);
        let harian = {};
        
        if (statSnap.exists()) {
            harian = statSnap.data().harian || {}; 
        }
        
        const labels = [];
        const dataKunjungan = [];
        const dataTkq = [];
        const dataUla = [];
        const dataWustho = [];
        const dataUlya = [];
        
        // Ambil waktu hari ini di Indonesia (WIB)
        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const hariIni = new Date(utc + (3600000 * 7));
        
        // Mulai dari 1 Oktober 2026
        let tanggalMulai = new Date('2026-10-01T00:00:00+07:00');
        
        // Tarik data per tanggal sampai hari ini
        while (tanggalMulai <= hariIni) {
            let y = tanggalMulai.getFullYear();
            let m = String(tanggalMulai.getMonth() + 1).padStart(2, '0');
            let day = String(tanggalMulai.getDate()).padStart(2, '0');
            let dateStr = `${y}-${m}-${day}`;
            
            labels.push(`${day} Okt`);
            
            let statsHariIni = harian[dateStr] || {};
            dataKunjungan.push(statsHariIni.kunjungan || 0);
            dataTkq.push(statsHariIni.dl_tkq || 0);
            dataUla.push(statsHariIni.dl_ula || 0);
            dataWustho.push(statsHariIni.dl_wustho || 0);
            dataUlya.push(statsHariIni.dl_ulya || 0);
            
            tanggalMulai.setDate(tanggalMulai.getDate() + 1);
        }
        
        const ctxElement = document.getElementById('statistikChart');
        if (ctxElement) {
            new Chart(ctxElement.getContext('2d'), {
                type: 'line', // Grafik garis agar mudah melihat tren harian
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'Kunjungan', data: dataKunjungan, borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.3 },
                        { label: 'TKQ', data: dataTkq, borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.3 },
                        { label: 'Ula', data: dataUla, borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.3 },
                        { label: 'Wustho', data: dataWustho, borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.3 },
                        { label: 'Ulya', data: dataUlya, borderColor: '#8b5cf6', backgroundColor: '#8b5cf6', tension: 0.3 }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                    plugins: { legend: { position: 'top' } }
                }
            });
        }
    } catch (e) { console.error("Gagal memuat grafik statistik", e); }
}

window.addEventListener("DOMContentLoaded", () => {
    muatData();
    setTimeout(muatStatistik, 500); 
});
