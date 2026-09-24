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

// KONFIGURASI SUPABASE (Pastikan URL dan Anon Key Anda benar)
const SUPABASE_URL = 'https://wnstuvnvrfiqmohtkfme.supabase.co';
const SUPABASE_KEY = 'MASUKKAN_ANON_KEY_ANDA_DISINI'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Nama bucket di Supabase (Pastikan huruf kecil semua dan sama persis dengan di dashboard)
const BUCKET_NAME = 'brosur';

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
            judul: document.getElementById("input-judul") ? document.getElementById("input-judul").value : "",
            tagline: document.getElementById("input-tagline") ? document.getElementById("input-tagline").value : "",
            pendaftaranLink: document.getElementById("input-pendaftaran") ? document.getElementById("input-pendaftaran").value : "",
        };

        // Upload Brosur per Tingkatan ke Supabase Storage
        const levels = ["tkq", "ula", "wustho", "ulya"];
        for (const lvl of levels) {
            const fileInput = document.getElementById(`input-brosur-${lvl}`);
            if (fileInput && fileInput.files[0]) {
                const file = fileInput.files[0];
                const fileName = `brosur_${lvl}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                
                // Perintah upload ke Supabase
                const { data, error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(fileName, file, { 
                        cacheControl: '3600',
                        upsert: true 
                    });

                if (uploadError) {
                    throw new Error(`Gagal upload ${lvl}: ` + uploadError.message);
                }

                // Ambil Public URL dari file yang di-upload
                const { data: publicUrlData } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(fileName);
                    
                updatedData[`brochure_${lvl}`] = publicUrlData.publicUrl;
            }
        }

        // Simpan ke Firestore
        await setDoc(docRef, updatedData);
        
        saveBtn.innerText = "SIMPAN PERUBAHAN";
        saveBtn.disabled = false;

        // Munculkan Pop-up Sukses
        const modal = document.getElementById("success-modal");
        if (modal) {
            modal.style.display = "flex";
        } else {
            alert("Brosur berhasil di-upload dan disimpan!");
            location.reload();
        }

    } catch (err) {
        console.error("Error Detail:", err);
        alert("Terjadi kesalahan: " + err.message);
        saveBtn.innerText = "SIMPAN PERUBAHAN";
        saveBtn.disabled = false;
    }
});

const okBtn = document.getElementById("modal-ok-btn");
if (okBtn) {
    okBtn.addEventListener("click", () => {
        location.reload();
    });
}
