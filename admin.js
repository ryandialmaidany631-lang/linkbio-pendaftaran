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

const levels = ["tkq", "ula", "wustho", "ulya"];

async function muatDataAdmin() {
    try {
        const docRef = doc(db, "situs", "pengaturan");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();

            if (document.getElementById("input-judul")) document.getElementById("input-judul").value = data.judul || "";
            if (document.getElementById("input-tagline")) document.getElementById("input-tagline").value = data.tagline || "";
            if (document.getElementById("input-pendaftaran")) document.getElementById("input-pendaftaran").value = data.pendaftaranLink || "";
            
            for (let i = 1; i <= 3; i++) {
                if (document.getElementById(`wa-name-${i}`)) document.getElementById(`wa-name-${i}`).value = data[`waName${i}`] || "";
                if (document.getElementById(`wa-number-${i}`)) document.getElementById(`wa-number-${i}`).value = data[`waNumber${i}`] || "";
            }

            // Cek status Logo
            const statusLogo = document.getElementById("status-logo");
            if (statusLogo) {
                if (data.logoUrl && data.logoUrl.trim() !== "") {
                    statusLogo.style.display = "block";
                } else {
                    statusLogo.style.display = "none";
                }
            }

            // Cek status brosur per tingkatan
            levels.forEach(lvl => {
                const statusEl = document.getElementById(`status-brosur-${lvl}`);
                if (statusEl) {
                    if (data[`brochure_${lvl}`] && data[`brochure_${lvl}`].trim() !== "") {
                        statusEl.style.display = "block";
                    } else {
                        statusEl.style.display = "none";
                    }
                }
            });
        }
    } catch (err) {
        console.error("Gagal memuat form admin:", err);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    muatDataAdmin();

    // Event Listener Hapus Logo
    const btnHapusLogo = document.getElementById("btn-hapus-logo");
    if (btnHapusLogo) {
        btnHapusLogo.addEventListener("click", async () => {
            if (confirm("Yakin ingin menghapus logo sekolah?")) {
                try {
                    const docRef = doc(db, "situs", "pengaturan");
                    await setDoc(docRef, { logoUrl: "" }, { merge: true });
                    alert("Logo berhasil dihapus.");
                    await muatDataAdmin();
                } catch (err) {
                    alert("Gagal menghapus logo: " + err.message);
                }
            }
        });
    }

    // Event Listener Hapus Brosur per Tingkatan
    levels.forEach(lvl => {
        const btnHapus = document.getElementById(`btn-hapus-${lvl}`);
        if (btnHapus) {
            btnHapus.addEventListener("click", async () => {
                if (confirm(`Yakin ingin menghapus brosur ${lvl.toUpperCase()}?`)) {
                    try {
                        const docRef = doc(db, "situs", "pengaturan");
                        let updateObj = {};
                        updateObj[`brochure_${lvl}`] = "";
                        await setDoc(docRef, updateObj, { merge: true });
                        alert(`Brosur ${lvl.toUpperCase()} berhasil dihapus.`);
                        await muatDataAdmin();
                    } catch (err) {
                        alert("Gagal menghapus brosur: " + err.message);
                    }
                }
            });
        }
    });
});

// Proses Simpan Data Form Admin
document.getElementById("form-admin").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const saveBtn = document.querySelector(".btn-save");
    const originalText = saveBtn ? saveBtn.innerText : "SIMPAN PERUBAHAN";
    if (saveBtn) {
        saveBtn.innerText = "SEDANG MENYIMPAN...";
        saveBtn.disabled = true;
    }

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
            updatedData[`waNumber${i}`] = document.getElementById(`wa-number-${i}`)?value || "";
        }

        // 1. Proses Upload Logo Sekolah jika dipilih file baru
        const logoInput = document.getElementById("input-logo");
        if (logoInput && logoInput.files && logoInput.files[0]) {
            const file = logoInput.files[0];
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
            const filePath = `logo_${Date.now()}_${cleanFileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('brosur')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                throw new Error("Gagal upload logo: " + uploadError.message);
            }

            const { data: publicUrlData } = supabase.storage
                .from('brosur')
                .getPublicUrl(filePath);

            updatedData.logoUrl = publicUrlData.publicUrl;
        }

        // 2. Proses Upload Brosur per Tingkatan jika dipilih file baru
        for (const lvl of levels) {
            const fileInput = document.getElementById(`input-brosur-${lvl}`);
            if (fileInput && fileInput.files && fileInput.files[0]) {
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

        await setDoc(docRef, updatedData, { merge: true });
        
        if (saveBtn) {
            saveBtn.innerText = originalText;
            saveBtn.disabled = false;
        }

        await muatDataAdmin();
        alert("Berhasil! Logo, data, dan brosur telah tersimpan.");

    } catch (err) {
        console.error("TERJADI ERROR DETAIL:", err);
        alert("Terjadi kesalahan: " + err.message);
        if (saveBtn) {
            saveBtn.innerText = originalText;
            saveBtn.disabled = false;
        }
    }
});
