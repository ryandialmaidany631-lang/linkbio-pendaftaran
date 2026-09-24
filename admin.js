document.getElementById("form-admin").addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Simpan Teks Utama (Judul, Tagline, Pendaftaran)
    const judul = document.getElementById("input-judul").value;
    const tagline = document.getElementById("input-tagline").value;
    const pendaftaran = document.getElementById("input-pendaftaran").value;
    
    if (judul) localStorage.setItem("schoolTitle", judul);
    if (tagline) localStorage.setItem("schoolTagline", tagline);
    if (pendaftaran) localStorage.setItem("pendaftaranLink", pendaftaran);

    // 2. Simpan 3 Nomor WhatsApp & Namanya
    for (let i = 1; i <= 3; i++) {
        const nameVal = document.getElementById(`wa-name-${i}`).value;
        const numVal = document.getElementById(`wa-number-${i}`).value;
        
        localStorage.setItem(`waName${i}`, nameVal);
        localStorage.setItem(`waNumber${i}`, numVal);
    }

    // 3. Kumpulan File yang Akan Diproses (Logo & 4 Brosur)
    const logoFile = document.getElementById("input-logo").files[0];
    const filesToProcess = [
        { key: "logo", file: logoFile, storageKey: "schoolLogo" },
        { key: "tkq", file: document.getElementById("input-brosur-tkq").files[0], storageKey: "brochure_tkq", nameKey: "brochureName_tkq" },
        { key: "ula", file: document.getElementById("input-brosur-ula").files[0], storageKey: "brochure_ula", nameKey: "brochureName_ula" },
        { key: "wustho", file: document.getElementById("input-brosur-wustho").files[0], storageKey: "brochure_wustho", nameKey: "brochureName_wustho" },
        { key: "ulya", file: document.getElementById("input-brosur-ulya").files[0], storageKey: "brochure_ulya", nameKey: "brochureName_ulya" }
    ];

    let totalFiles = filesToProcess.filter(item => item.file).length;
    let processedCount = 0;

    function checkFinished() {
        if (processedCount >= totalFiles) {
            alert("Data, Logo, 3 Kontak WhatsApp, dan Brosur 4 Tingkatan berhasil disimpan!");
            location.reload();
        }
    }

    if (totalFiles === 0) {
        alert("Data teks dan kontak WhatsApp berhasil disimpan!");
        location.reload();
    } else {
        filesToProcess.forEach(item => {
            if (item.file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    localStorage.setItem(item.storageKey, event.target.result);
                    if (item.nameKey) {
                        localStorage.setItem(item.nameKey, item.file.name);
                    }
                    processedCount++;
                    checkFinished();
                };
                reader.readAsDataURL(item.file);
            }
        });
    }
});
