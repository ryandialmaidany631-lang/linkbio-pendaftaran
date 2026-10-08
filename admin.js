import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyAX9MlyLRIz7zcFUtKtnqcc4vNSOzerYMQ",
  authDomain: "linkbio-sekolah.firebaseapp.com",
  projectId: "linkbio-sekolah",
  storageBucket: "linkbio-sekolah.firebasestorage.app",
  messagingSenderId: "149105804714",
  appId: "1:149105804714:web:bea6f30b0af1a3c32fd7d3"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referensi ke database (Pengaturan Konten & Statistik)
const pengaturanRef = doc(db, "situs", "pengaturan");
const statistikRef = doc(db, "situs", "statistik");

// Element Form di HTML
const adminForm = document.getElementById("admin-form");
const statusMessage = document.getElementById("status-message");
const btnSimpan = document.getElementById("btn-simpan");

// ==========================================
// 1. FUNGSI MEMUAT DATA PENGATURAN KE FORM
// ==========================================
async function muatData() {
    try {
        const docSnap = await getDoc(pengaturanRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Isi form dengan data yang ada di database
            if(document.getElementById("judul")) document.getElementById("judul").value = data.judul || "";
            if(document.getElementById("tagline")) document.getElementById("tagline").value = data.tagline || "";
            if(document.getElementById("logoUrl")) document.getElementById("logoUrl").value = data.logoUrl || "";
            if(document.getElementById("pendaftaranLink")) document.getElementById("pendaftaranLink").value = data.pendaftaranLink || "";
            
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
        console.error("Gagal memuat data pengaturan:", error);
        tampilkanPesan("Gagal memuat data dari database. Periksa koneksi internet.", "error");
    }
}

// ==========================================
// 2. FUNGSI MENYIMPAN DATA KE FIREBASE
// ==========================================
if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Mencegah reload halaman
        
        // Ubah tombol jadi status loading
        const originalText = btnSimpan.innerText;
        btnSimpan.innerText = "⏳ Menyimpan Perubahan...";
        btnSimpan.disabled = true;
        statusMessage.style.display = "none";

        // Ambil semua nilai dari inputan form
        const newData = {
            judul: document.getElementById("judul").value,
            tagline: document.getElementById("tagline").value,
            logoUrl: document.getElementById("logoUrl").value,
            pendaftaranLink: document.getElementById("pendaftaranLink").value,
            
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
            // Simpan ke Firestore (Aman karena menggunakan merge: true, tidak akan menghapus data lain)
            await setDoc(pengaturanRef, newData, { merge: true });
            tampilkanPesan("✅ Data berhasil diperbarui & disimpan!", "success");
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            tampilkanPesan("❌ Gagal menyimpan data. Coba lagi.", "error");
        } finally {
            // Kembalikan tombol seperti semula
            btnSimpan.innerText = originalText;
            btnSimpan.disabled = false;
        }
    });
}

// Fungsi bantu untuk memunculkan notifikasi berhasil/gagal
function tampilkanPesan(pesan, tipe) {
    statusMessage.innerText = pesan;
    statusMessage.className = tipe;
    statusMessage.style.display = "block";
    setTimeout(() => {
        statusMessage.style.display = "none";
    }, 5000); // Notifikasi akan hilang sendiri setelah 5 detik
}

// ==========================================
// 3. FUNGSI MEMUNCULKAN GRAFIK STATISTIK
// ==========================================
async function muatStatistik() {
    try {
        const statSnap = await getDoc(statistikRef);
        
        if (statSnap.exists()) {
            const data = statSnap.data();
            const ctxElement = document.getElementById('statistikChart');
            
            if (ctxElement) {
                const ctx = ctxElement.getContext('2d');
                
                new Chart(ctx, {
                    type: 'bar', // Jenis grafik batang
                    data: {
                        labels: ['Kunjungan Web', 'Download TKQ', 'Download Ula', 'Download Wustho', 'Download Ulya'],
                        datasets: [{
                            label: 'Jumlah (Orang)',
                            data: [
                                data.kunjungan || 0, 
                                data.dl_tkq || 0, 
                                data.dl_ula || 0, 
                                data.dl_wustho || 0, 
                                data.dl_ulya || 0
                            ],
                            backgroundColor: [
                                'rgba(59, 130, 246, 0.85)', // Biru (Kunjungan)
                                'rgba(16, 185, 129, 0.85)', // Hijau (TKQ)
                                'rgba(245, 158, 11, 0.85)', // Oranye (Ula)
                                'rgba(239, 68, 68, 0.85)',  // Merah (Wustho)
                                'rgba(139, 92, 246, 0.85)'  // Ungu (Ulya)
                            ],
                            borderWidth: 0,
                            borderRadius: 6, // Ujung grafik membulat modern
                            barThickness: 45 // Ketebalan batang
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { 
                            y: { 
                                beginAtZero: true, 
                                ticks: { precision: 0 } // Angka bulat, tidak ada desimal (misal 1.5 orang)
                            } 
                        },
                        plugins: { 
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.parsed.y + ' Orang';
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    } catch (e) {
        console.error("Gagal memuat grafik statistik", e);
    }
}

// ==========================================
// 4. JALANKAN SEMUA FUNGSI SAAT HALAMAN DIBUKA
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
    muatData(); // Memanggil data form
    setTimeout(muatStatistik, 800); // Memberi jeda sedikit sebelum menggambar grafik agar tidak berat
});
