document.addEventListener("DOMContentLoaded", () => {
    // Muat Judul & Logo
    const title = localStorage.getItem("schoolTitle");
    if (title) document.getElementById("display-judul").innerText = title;

    const logo = localStorage.getItem("schoolLogo");
    if (logo) document.getElementById("display-logo").src = logo;

    // Muat 3 Tombol WhatsApp
    const waContainer = document.getElementById("whatsapp-container");
    waContainer.innerHTML = ""; // Bersihkan wadah

    for (let i = 1; i <= 3; i++) {
        const name = localStorage.getItem(`waName${i}`);
        const number = localStorage.getItem(`waNumber${i}`);

        if (number) {
            // Bersihkan nomor dari karakter non-angka (spasi, +, -)
            const cleanNumber = number.replace(/\D/g, '');
            const defaultText = encodeURIComponent("Halo, saya ingin bertanya mengenai pendaftaran.");
            
            const btn = document.createElement("a");
            btn.href = `https://wa.me/${cleanNumber}?text=${defaultText}`;
            btn.className = "btn-whatsapp"; // Sesuaikan class CSS Anda
            btn.target = "_blank";
            btn.innerText = `WhatsApp: ${name || 'Admin ' + i}`;
            
            waContainer.appendChild(btn);
        }
    }
});
