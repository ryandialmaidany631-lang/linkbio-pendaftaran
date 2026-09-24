import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

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

const SUPABASE_URL = 'https://wnstuvnvrfiqmohtkfme.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Induc3R1dm52cmZpcW1vaHRrZm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMTE1MzksImV4cCI6MjEwNTc4NzUzOX0.AY-gLTVCQVqu3skr0feamHZRt7-Lob8ls3Ab7SDTVxM'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fungsi untuk memasukkan data dari database ke form admin agar tidak hilang
async function muatDataAdmin() {
    try {
        const docSnap = await getDoc(doc(db, "situs", "pengaturan"));
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            if (document.getElementById("input-judul")) document.getElementById("input-judul").value = data.judul || "";
            if (document.getElementById("input-tagline")) document.getElementById("input-tagline").value = data.tagline || "";
            if (document.getElementById("input-pendaftaran")) document.getElementById("input-pendaftaran").value = data.pendaftaranLink || "";
            
            for (let i = 1; i <= 3; i++) {
                if (document.getElementById(`wa-name-${i}`)) document.getElementById(`wa-name-${i}`).value = data[`waName${i}`] || "";
                if (document.getElementById(`wa-number-${i}`)) document.getElementById(`wa-number-${i}`).value = data[`waNumber${i}`] || "";
            }
            console.log("Data berhasil dimuat ke form admin.");
        }
    } catch (err) {
        console.error("Gagal memuat form admin:", err);
    }
}

// Jalankan saat halaman admin pertama kali dibuka
window.addEventListener("DOMContentLoaded", muatDataAdmin);

// Proses Simpan Data
document.getElementById("form-admin").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const saveBtn = document.querySelector(".btn-save");
    saveBtn.innerText = "SEDANG MENYIMPAN...";
    saveBtn.disabled = true;

    try {
        const docRef = doc(db, "situs", "pengaturan");
        const docSnap = await getDoc(docRef);
        let existingData = docSnap.exists() ? docSnap.data() : {};

        let updatedData = {
            ...existingData,
            judul: document.getElementById("input-judul")?.value || "",
            tagline: document.getElementById("input-tagline")?.value || "",
            pendaftaranLink: document.getElementById("input-pendaftaran")?.value || "",
        };

        for (let i = 1; i <= 3; i++) {
            updatedData[`waName${i}`] = document.getElementById(`wa-name-${i}`)?.value || "";
            updatedData[`waNumber${i}`] = document.getElementById(`wa-number-${i}`)?.value || "";
        }

        const levels = ["tkq", "ula", "wustho", "ulya"];
        for (const lvl of levels) {
            const fileInput = document.getElementById(`input-brosur-${lvl}`);
            if (fileInput && fileInput.files[0]) {
                const file = fileInput.files[0];
                const cleanFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
                const filePath = `brosur_${lvl}_${Date.now()}_${cleanFileName}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('brosur')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (uploadError) {
                    throw new Error(`Gagal upload brosur ${lvl}: ` + uploadError.message);
                }

                const { data: publicUrlData } = supabase.storage
                    .from('brosur')
                    .getPublicUrl(filePath);

                updatedData[`brochure_${lvl}`] = publicUrlData.publicUrl;
            }
        }

        // Simpan dengan merge agar data lama tidak hilang
        await setDoc(docRef, updatedData, { merge: true });
        
        saveBtn.innerText = "SIMPAN PERUBAHAN";
        saveBtn.disabled = false;

        // Panggil kembali fungsi muat data agar form tetap terisi dan admin bisa melihat data yang aktif
        await muatDataAdmin();

        alert("Berhasil! Semua data dan brosur telah tersimpan.");

    } catch (err) {
        console.error("TERJADI ERROR DETAIL:", err);
        alert("Terjadi kesalahan: " + err.message);
        saveBtn.innerText = "SIMPAN PERUBAHAN";
        saveBtn.disabled = false;
    }
});
