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
const storage = getStorage(app); // Memanggil fitur penyimpanan file

const pengaturanRef = doc(db, "situs", "pengaturan");
const statistikRef = doc(db, "situs", "statistik");

const adminForm = document.getElementById("admin-form");
const statusMessage = document.getElementById("status-message");
const btnSimpan = document.getElementById("btn-simpan");

// FUNGSI MEMUAT DATA PENGATURAN (Termasuk memunculkan link lama di kotak fallback)
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
            
            // Masukkan link lama ke kolom teks cadangan agar file tidak hilang jika tidak ada upload baru
            if(document.getElementById("logoUrl")) document.getElementById("logoUrl").value = data.logoUrl || "";
            if(document.getElementById("brochure_tkq")) document.getElementById("brochure_tkq").value = data.brochure_tkq || "";
            if(document.getElementById("brochure_ula")) document.getElementById("brochure_ula").value = data.brochure_ula || "";
            if(document.getElementById("brochure_wustho")) document.getElementById("brochure_wustho").value = data.brochure_wustho || "";
            if(document.getElementById("brochure_ulya")) document.getElementById("brochure_ulya").value = data.brochure_ulya || "";
        }
    } catch (error) {
        console.error("Gagal memuat data pengaturan:", error);
    }
}

// FUNGSI UPLOAD FILE KE PENYIMPANAN
async function uploadFileKeStorage(fileItem, folderName) {
    const fileName = `${Date.now()}_${fileItem.name.replace(/\s+/g, '_')}`;
    const storageRef = ref(storage, `${folderName}/${fileName}`);
    await uploadBytes(storageRef, fileItem);
    return await getDownloadURL(storageRef);
}

// FUNGSI MENYIMPAN FORM DAN UPLOAD OTOMATIS
if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        const originalText = btnSimpan.innerText;
        btnSimpan.innerText = "⏳ Sedang Mengupload & Menyimpan...";
        btnSimpan.disabled = true;
        statusMessage.style.display = "none";

        try {
            // Ambil link cadangan dari kolom teks (jika file baru tidak diupload, pakai link ini)
            let finalLogo = document.getElementById("logoUrl").value;
            let finalTkq = document.getElementById("brochure_tkq").value;
            let finalUla = document.getElementById("brochure_ula").value;
            let finalWustho = document.getElementById("brochure_wustho").value;
            let finalUlya = document.getElementById("brochure_ulya").value;

            // Jika admin memilih file gambar baru, langsung upload & timpa linknya
            const fileLogo = document.getElementById("file_logo").files[0];
            if (fileLogo) finalLogo = await uploadFileKeStorage(fileLogo, 'logo');

            const fileTkq = document.getElementById("file_tkq").files[0];
            if (fileTkq) finalTkq = await uploadFileKeStorage(fileTkq, 'brosur');

            const fileUla = document.getElementById("file_ula").files[0];
            if (fileUla) finalUla = await uploadFileKeStorage(fileUla, 'brosur');

            const fileWustho = document.getElementById("file_wustho").files[0];
            if (fileWustho) finalWustho = await uploadFileKeStorage(fileWustho, 'brosur');

            const fileUlya = document.getElementById("file_ulya").files[0];
            if (fileUlya) finalUlya = await uploadFileKeStorage(fileUlya, 'brosur');

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
                // Simpan hasil upload file (atau link lama)
                logoUrl: finalLogo,
                brochure_tkq: finalTkq,
                brochure_ula: finalUla,
                brochure_wustho: finalWustho,
                brochure_ulya: finalUlya,
            };

            await setDoc(pengaturanRef, newData, { merge: true });
            tampilkanPesan("✅ Data & Brosur berhasil disimpan!", "success");
            
        } catch (error) {
            console.error(error);
            tampilkanPesan("❌ Gagal upload file. Pastikan internet stabil atau paste link manual ke kolom teks.", "error");
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

// FUNGSI MEMUNCULKAN GRAFIK
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
