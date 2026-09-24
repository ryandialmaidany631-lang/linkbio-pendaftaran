document.getElementById("form-admin").addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Simpan Judul & Link Pendaftaran
    const judul = document.getElementById("input-judul").value;
    const pendaftaran = document.getElementById("input-pendaftaran").value;
    
    if (judul) localStorage.setItem("schoolTitle", judul);
    if (pendaftaran) localStorage.setItem("pendaftaranLink", pendaftaran);

    // 2. Simpan 3 Nomor WhatsApp
    for (let i = 1; i <= 3; i++) {
        const nameVal = document.getElementById(`wa-name-${i}`).value;
        const numVal = document.getElementById(`wa-number-${i}`).value;
        
        localStorage.setItem(`waName${i}`, nameVal);
        localStorage.setItem(`waNumber${i}`, numVal);
    }

    // 3. Simpan File Brosur (Jika ada)
    const brosurFile = document.getElementById("input-brosur").files[0];
    const logoFile = document.getElementById("input-logo").files[0];

    let savedCount = 0;
    let totalTasks = (brosurFile ? 1 : 0) + (logoFile ? 1 : 0);

    function checkFinished() {
        if (savedCount >= totalTasks || totalTasks === 0) {
            alert("Pengaturan, 3 Nomor WhatsApp, dan file berhasil disimpan!");
            location.reload();
        }
    }

    if (brosurFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            localStorage.setItem("brochureFile", event.target.result);
            localStorage.setItem("brochureName", brosurFile.name);
            savedCount++;
            checkFinished();
        };
        reader.readAsDataURL(brosurFile);
    }

    if (logoFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            localStorage.setItem("schoolLogo", event.target.result);
            savedCount++;
            checkFinished();
        };
        reader.readAsDataURL(logoFile);
    }

    if (totalTasks === 0) {
        alert("Data dan 3 Nomor WhatsApp berhasil disimpan!");
        location.reload();
    }
});
