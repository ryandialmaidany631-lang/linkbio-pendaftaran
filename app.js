function getData(){return JSON.parse(localStorage.getItem("lh_linkbio")||JSON.stringify(window.DEFAULT_DATA))}
function render(){const d=getData(); document.getElementById("schoolName").innerHTML=d.schoolName.replace(" ","<br>"); document.getElementById("tagline").textContent=d.tagline;
let h=`<a class="btn gold" href="${d.website}" target="_blank">🌐 <span>Kunjungi Website Pendaftaran</span></a>`;
d.brochures.filter(x=>x.active).forEach(x=>h+=`<a class="btn" href="${x.url}" target="_blank">📥 <span>${x.name}</span></a>`);
h+=`<a class="btn wa" href="https://wa.me/${d.whatsapp}" target="_blank">💬 <span>Hubungi Admin WhatsApp</span></a>`;
document.getElementById("links").innerHTML=h} render();