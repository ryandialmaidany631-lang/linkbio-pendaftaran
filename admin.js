import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
const storage = getStorage(app);

const pengaturanRef = doc(db, "situs", "pengaturan");
const statistikRef = doc(db, "situs", "statistik");

const adminForm = document.getElementById("admin-form");
const statusMessage = document.getElementById("status-message");
const btnSimpan = document.getElementById("btn-simpan");

let dataStatistikGlobal = null;
let chartStatistik = null;

// ===============================================
// 1. MEMUAT DATA LAMA & MENGUBAH STATUS VISUAL
// ===============================================
async function muatData() {
    try {
        const docSnap = await getDoc(pengaturanRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            if(document.getElementById("judul")) document.getElementById("judul").value = data.judul || "";
            if(document.getElementById("tagline")) document.getElementById("tagline").value = data.tagline || "";
            if(document.getElementById("pendaftaranLink")) document.getElementById("pendaftaranLink").value = data.pendaftaranLink || "";
            
            if(document.getElementById("waName1")) document.getElementById("waName1").value = data.waName1 || "";
            if(document.getElementById("waNumber1")) document.getElementById("waNumber1").value = data.waNumber1 || "";
            if(document.getElementById("waName2")) document.getElementById("waName2").value = data.waName2 || "";
            if(document.getElementById("waNumber2")) document.getElementById("waNumber2").value = data.waNumber2 || "";
            if(document.getElementById("waName3")) document.getElementById("waName3").value = data.waName3 || "";
            if(document.getElementById("waNumber3")) document.getElementById("waNumber3").value = data.waNumber3 || "";
            
            // Masukkan link secara tersembunyi dan ubah status jadi Hijau (Tersimpan)
            if(data.logoUrl) { document.getElementById("logoUrl").value = data.logoUrl; document.getElementById("status_logo").innerText = "✅ File Tersimpan"; document.getElementById("status_logo").style.color = "#16a34a"; }
            if(data.brochure_tkq) { document.getElementById("brochure_tkq").value = data.brochure_tkq; document.getElementById("status_tkq").innerText = "✅ File Tersimpan"; document.getElementById("status_tkq").style.color = "#16a34a"; }
            if(data.brochure_ula) { document.getElementById("brochure_ula").value = data.brochure_ula; document.getElementById("status_ula").innerText = "✅ File Tersimpan"; document.getElementById("status_ula").style.color = "#16a34a"; }
            if(data.brochure_wustho) { document.getElementById("brochure_wustho").value = data.brochure_wustho; document.getElementById("status_wustho").innerText = "✅ File Tersimpan"; document.getElementById("status_wustho").style.color = "#16a34a"; }
            if(data.brochure_ulya) { document.getElementById("brochure_ulya").value = data.brochure_ulya; document.getElementById("status_ulya").innerText = "✅ File Tersimpan"; document.getElementById("status_ulya").style.color = "#16a34a"; }
        }
    } catch (error) { console.error("Gagal memuat data:", error); }
}

// ===============================================
// 2. FUNGSI UPLOAD JIKA MEMILIH FILE BARU
// ===============================================
async function prosesUpload(fileId, urlId, folder) {
    const fileInput = document.getElementById(fileId);
    const urlInput = document.getElementById(urlId);
    
    // Jika upload file baru melalui tombol, proses ke Firebase Storage
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `${folder}/${fileName}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef); 
    }
    // Jika tidak upload file baru, data lama tetap dipertahankan
    return urlInput.value; 
}

// ===============================================
// 3. MENYIMPAN PERUBAHAN
// ===============================================
if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        btnSimpan.innerText = "⏳ Sedang Menyimpan...";
        btnSimpan.disabled = true;
        statusMessage.style.display = "none";

        try {
            const finalLogo = await prosesUpload('file_logo', 'logoUrl', 'logo');
            const finalTkq = await prosesUpload('file_tkq', 'brochure_tkq', 'brosur');
            const finalUla = await prosesUpload('file_ula', 'brochure_ula', 'brosur');
            const finalWustho = await prosesUpload('file_wustho', 'brochure_wustho', 'brosur');
            const finalUlya = await prosesUpload('file_ulya', 'brochure_ulya', 'brosur');

            const newData = {
                judul: document.getElementById("judul").value,
                tagline: document.getElementById("tagline").value,
                pendaftaranLink: document.getElementById("pendaftaranLink").value,
                waName1: document.getElementById("waName1").value,
                waNumber1: document.getElementById("waNumber1").value,
                waName2: document.getElementById("waName2").value,
                waNumber2: document.getElementById("waNumber2").value,
                waName3: document.getElementById("waName3").value,
                waNumber3: document.getElementById("waNumber3").value,
                
                logoUrl: finalLogo, brochure_tkq: finalTkq, brochure_ula: finalUla,
                brochure_wustho: finalWustho, brochure_ulya: finalUlya,
            };

            await setDoc(pengaturanRef, newData, { merge: true });
            
            // Perbarui status tampilan setelah sukses simpan
            const items = [
                {id: 'logo', val: finalLogo}, {id: 'tkq', val: finalTkq}, {id: 'ula', val: finalUla},
                {id: 'wustho', val: finalWustho}, {id: 'ulya', val: finalUlya}
            ];
            
            items.forEach(item => {
                const hiddenInputId = item.id === 'logo' ? 'logoUrl' : `brochure_${item.id}`;
                document.getElementById(hiddenInputId).value = item.val;
                document.getElementById(`file_${item.id}`).value = ''; 
                if (item.val) {
                    document.getElementById(`status_${item.id}`).innerText = "✅ File Tersimpan";
                    document.getElementById(`status_${item.id}`).style.color = "#16a34a";
                }
            });

            statusMessage.innerText = "✅ Data berhasil disimpan!";
            statusMessage.className = "success";
            statusMessage.style.display = "block";
        } catch (error) {
            statusMessage.innerText = "❌ Gagal menyimpan. Periksa koneksi.";
            statusMessage.className = "error";
            statusMessage.style.display = "block";
        } finally {
            btnSimpan.innerText = "💾 Simpan Perubahan";
            btnSimpan.disabled = false;
            setTimeout(() => { statusMessage.style.display = "none"; }, 4000);
        }
    });
}

// ===============================================
// 4. LOGIKA GRAFIK STATISTIK (DROPDOWN HARIAN)
// ===============================================
async function siapkanStatistik() {
    try {
        const statSnap = await getDoc(statistikRef);
        dataStatistikGlobal = statSnap.exists() ? statSnap.data() : { kunjungan: 0, dl_tkq: 0, dl_ula: 0, dl_wustho: 0, dl_ulya: 0, harian: {} };
        
        buatOpsiTanggal();
        gambarGrafik('total'); 
    } catch (e) { console.error("Gagal memuat statistik", e); }
}

function buatOpsiTanggal() {
    const select = document.getElementById('filterTanggal');
    if (!select) return;

    const startDate = new Date('2026-10-01T00:00:00+07:00'); 
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const today = new Date(utc + (3600000 * 7)); 

    while (startDate <= today) {
        let y = startDate.getFullYear();
        let m = String(startDate.getMonth() + 1).padStart(2, '0');
        let day = String(startDate.getDate()).padStart(2, '0');
        let dateStr = `${y}-${m}-${day}`;
        let displayStr = `${day}-${m}-${y}`;

        let opt = document.createElement('option');
        opt.value = dateStr;
        opt.textContent = `Tanggal: ${displayStr}`;
        select.appendChild(opt);

        startDate.setDate(startDate.getDate() + 1);
    }
}

function gambarGrafik(pilihanTanggal) {
    let statKunjungan = 0, statTkq = 0, statUla = 0, statWustho = 0, statUlya = 0;

    if (pilihanTanggal === 'total') {
        statKunjungan = dataStatistikGlobal.kunjungan || 0;
        statTkq = dataStatistikGlobal.dl_tkq || 0;
        statUla = dataStatistikGlobal.dl_ula || 0;
        statWustho = dataStatistikGlobal.dl_wustho || 0;
        statUlya = dataStatistikGlobal.dl_ulya || 0;
    } else {
        const harian = dataStatistikGlobal.harian || {};
        const dataHariItu = harian[pilihanTanggal] || {};
        
        statKunjungan = dataHariItu.kunjungan || 0;
        statTkq = dataHariItu.dl_tkq || 0;
        statUla = dataHariItu.dl_ula || 0;
        statWustho = dataHariItu.dl_wustho || 0;
        statUlya = dataHariItu.dl_ulya || 0;
    }

    const ctx = document.getElementById('statistikChart').getContext('2d');
    if (chartStatistik) { chartStatistik.destroy(); }
    
    chartStatistik = new Chart(ctx, {
        type: 'bar', // Grafik Batang Sesuai Permintaan
        data: {
            labels: ['Kunjungan', 'Download TKQ', 'Download Ula', 'Download Wustho', 'Download Ulya'],
            datasets: [{
                label: `Statistik ${pilihanTanggal === 'total' ? 'Keseluruhan' : pilihanTanggal}`,
                data: [statKunjungan, statTkq, statUla, statWustho, statUlya],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0, borderRadius: 6, barThickness: 45
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1 } } },
            plugins: { legend: { display: false } }
        }
    });
}

document.getElementById('filterTanggal').addEventListener('change', (e) => {
    gambarGrafik(e.target.value);
});

window.addEventListener("DOMContentLoaded", () => {
    muatData();
    setTimeout(siapkanStatistik, 300); 
});
