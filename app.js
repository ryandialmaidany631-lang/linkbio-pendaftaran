document.addEventListener("DOMContentLoaded", () => {
    const title = localStorage.getItem("schoolTitle");
    if (title) document.getElementById("display-judul").innerText = title;

    const tagline = localStorage.getItem("schoolTagline");
    if (tagline) document.getElementById("display-tagline").innerText = tagline;

    const logo = localStorage.getItem("schoolLogo");
    if (logo) {
        const logoImg = document.getElementById("display-logo");
        logoImg.src = logo;
        logoImg.style.display = "block";
    }

    const pendaftaranLink = localStorage.getItem("pendaftaranLink");
    const pendaftaranBtn = document.getElementById("link-pendaftaran");
    if (pendaftaranLink) {
        pendaftaranBtn.href = pendaftaranLink;
    } else {
        pendaftaranBtn.href = "#";
        pendaftaranBtn.onclick = (e) => { e.preventDefault(); alert("Link pendaftaran belum diatur oleh admin."); };
    }

    const waContainer = document.getElementById("whatsapp-container");
    waContainer.innerHTML = "";

    for (let i = 1; i <= 3; i++) {
        const name = localStorage.getItem(`waName${i}`);
        const number = localStorage.getItem(`waNumber${i}`);

        if (number) {
            const cleanNumber = number.replace(/\D/g, '');
            const defaultText = encodeURIComponent("Halo, saya ingin bertanya mengenai informasi pendaftaran.");
            
            const btn = document.createElement("a");
            btn.href = `https://wa.me/${cleanNumber}?text=${defaultText}`;
            btn.className = "btn btn-whatsapp";
            btn.target = "_blank";
            btn.innerText = `WhatsApp: ${name || 'Admin ' + i}`;
            
            waContainer.appendChild(btn);
        }
    }

    const brochureContainer = document.getElementById("brochure-container");
    brochureContainer.innerHTML = "";

    const levels = [
        { key: "tkq", label: "Brosur TKQ" },
        { key: "ula", label: "Brosur ULA (SD)" },
        { key: "wustho", label: "Brosur WUSTHO (SMP)" },
        { key: "ulya", label: "Brosur ULYA (SMA)" }
    ];

    levels.forEach(lvl => {
        const fileData = localStorage.getItem(`brochure_${lvl.key}`);
        const fileName = localStorage.getItem(`brochureName_${lvl.key}`) || `${lvl.label}.pdf`;

        const btn = document.createElement("a");
        btn.className = "btn btn-brochure";
        
        if (fileData) {
            btn.href = fileData;
            btn.download = fileName;
            btn.innerText = `📥 Download ${lvl.label}`;
        } else {
            btn.href = "#";
            btn.className += " btn-disabled";
            btn.innerText = `📥 ${lvl.label} (Belum Tersedia)`;
            btn.onclick = (e) => { e.preventDefault(); alert(`Brosur ${lvl.label} belum di-upload oleh admin.`); };
        }

        brochureContainer.appendChild(btn);
    });
});
