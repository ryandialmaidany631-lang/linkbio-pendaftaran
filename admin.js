document.getElementById("form-admin").addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Simpan Judul & Link Pendaftaran
    localStorage.setItem("schoolTitle", document.getElementById("input-judul").value);
    
    // 2. Simpan 3 Nomor WhatsApp
    for (let i = 1; i <= 3; i++) {
        localStorage.setItem(`waName${i}`, document.getElementById(`wa-name-${i}`).value);
        localStorage.setItem(`waNumber${i}`, document.getElementById(`wa-number-${i}`).value);
    }

    // 3. Simpan Logo (Menggunakan FileReader)
    const logoFile = document.getElementById("input-logo").files[0];
    if (logoFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            localStorage.setItem("schoolLogo", event.target.result);
            alert("Data, Logo, dan 3 Nomor WhatsApp berhasil disimpan!");
            location.reload();
        };
        reader.readAsDataURL(logoFile);
    } else {
        alert("Data dan 3 Nomor WhatsApp berhasil disimpan!");
        location.reload();
    }
});
