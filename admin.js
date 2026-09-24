import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
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
                if (data[`waNumber${i}`]) document.getElementById(`wa-number-${i}`).value = data[`waNumber${i}`];
            }
        }
    } catch (err) {
        console.error("Gagal memuat data admin:", err);
    }
});

// Simpan perubahan ke Firebase & Munculkan Pop-up Modal Sukses
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

        // Upload Logo (Hanya jika dipilih)
        const logoFile = document.getElementById("input-logo").files[0];
        if (logoFile) {
            const logoRef = ref(storage, 'uploads/logo_' + Date.now() + '_' + logoFile.name);
            await uploadBytes(logoRef, logoFile);
            updatedData.logoUrl = await getDownloadURL(logoRef);
        }

        // Upload Brosur (Hanya tingkatan yang file-nya di-klik/dipilih)
        const levels = ["tkq", "ula", "wustho", "ulya"];
        for (const lvl of levels) {
            const fileInput = document.getElementById(`input-brosur-${lvl}`).files[0];
            if (fileInput) {
                const fileRef = ref(storage, `uploads/brosur_${lvl}_${Date.now()}_${fileInput.name}`);
                await uploadBytes(fileRef, fileInput);
                updatedData[`brochure_${lvl}`] = await getDownloadURL(fileRef);
            }
        }

        await setDoc(docRef, updatedData);
        
        // Munculkan Pop-up Sukses
        document.getElementById("success-modal").style.display = "flex";

    } catch (err) {
        console.error("Gagal menyimpan:", err);
        alert("Terjadi kesalahan saat menyimpan: " + err.message);
        saveBtn.innerText = "SIMPAN PERUBAHAN";
        saveBtn.disabled = false;
    }
});

// Tombol OK pada Pop-up
document.getElementById("modal-ok-btn").addEventListener("click", () => {
    location.reload();
});
