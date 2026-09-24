import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Konfigurasi Firebase (Database Teks)
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

// KONFIGURASI SUPABASE (Pastikan SUPABASE_KEY adalah anon/public key yang benar)
const SUPABASE_URL = 'https://wnstuvnvrfiqmohtkfme.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Induc3R1dm52cmZpcW1vaHRrZm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzg2ODksImV4cCI6MjA1NjgxNDY4OX0.ContohKunciPanjangAndaDiSini'; // <-- Ganti dengan Anon Key lengkap Anda
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Muat data lama ke form saat halaman admin dibuka
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const docSnap = await getDoc(doc(db, "situs", "pengaturan"));
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.judul) document.getElementById("input-judul").value = data.judul;
            if (data.tagline) document.getElementById("input-tagline").value = data.tagline;
            if (data.pendaftaranLink) document.getElementById("input-pendaftaran").value = data.pendaftaranLink;
            
            for (let i = 1; i <= 3; i++) {
                if (data[`waName${i}`]) document.getElementById(`wa-name-${i}`).value = data[`waName${i}`];
                if (data[`waNumber${i}`]) document.getElementById(`wa-number-${i}`].value = data[`waNumber${i}`];
            }
        }
    } catch (err) {
        console.error("Gagal memuat data admin:", err);
    }
});

// Simpan perubahan ke Firestore & Upload File ke Supabase
document.getElementById("form-admin").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const saveBtn = document.querySelector(".btn-save");
    saveBtn.innerText = "SEDANG MENGUPLOAD...";
    saveBtn.disabled = true;

    try {
        const docRef = doc(db, "situs", "pengaturan");
        const docSnap = await getDoc(docRef);
        let existingData = docSnap.exists() ? docSnap.data() : {};

        let updatedData = {
            ...existingData,
            judul: document.getElementById("input-judul").value,
            tagline: document.getElementById("input-tagline").value,
            pendaftaranLink: document.getElementById("input-pendaftaran").value,
            waName1: document.getElementById("wa-name-1").value,
            waNumber1: document.getElementById("wa-number-1").value,
            waName2: document.getElementById("wa-name-2").value,
            waNumber2: document.getElementById("wa-number-2").value,
            waName3: document.getElementById("wa-name-3").value,
            waNumber3: document.getElementById("wa-number-3").value,
        };

        // Upload Logo ke Supabase Storage (jika ada file dipilih)
        const logoInput = document.getElementById("input-logo");
        if (logoInput && logoInput.files[0]) {
            const logoFile = logoInput.files[0];
            const logoFileName = 'logo_' + Date.now() + '_' + logoFile.name.replace(/\s+/g, '_');
            
            const { error: logoError } = await supabase.storage
                .from('brosur')
                .upload(logoFileName, logoFile, { upsert: true });

            if (logoError) throw new Error("Gagal upload logo ke Supabase: " + logoError.message);

            const { data: logoUrlData } = supabase.storage
                .from('brosur')
                .getPublicUrl(logoFileName);
                
            updatedData.logoUrl = logoUrlData.publicUrl;
        }

        // Upload Brosur per tingkatan ke Supabase Storage (jika ada file dipilih)
        const levels = ["tkq", "ula", "wustho", "ulya"];
        for (const lvl of levels) {
            const fileInput = document.getElementById(`input-brosur-${lvl}`);
            if (fileInput && fileInput.files[0]) {
                const file = fileInput.files[0];
                const fileName = `brosur_${lvl}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('brosur')
                    .upload(fileName, file, { upsert: true });

                if (uploadError) throw new Error(`Gagal upload brosur ${lvl} ke Supabase: ` + uploadError.message);

                const { data: publicUrlData } = supabase.storage
                    .from('brosur')
                    .getPublicUrl(fileName);
                    
                updatedData[`brochure_${lvl}`] = publicUrlData.publicUrl;
            }
        }

        // Simpan data ke Firestore Database
        await setDoc(docRef, updatedData);
        
        // Munculkan Pop-up Sukses
        document.getElementById("success-modal").style.display = "flex";

    } catch (err) {
        console.error("Detail Error:", err);
        alert("Terjadi kesalahan: " + err.message);
        saveBtn.innerText = "SIMPAN PERUBAHAN";
        saveBtn.disabled = false;
    }
});

// Tombol OK pada Pop-up
document.getElementById("modal-ok-btn").addEventListener("click", () => {
    location.reload();
});
