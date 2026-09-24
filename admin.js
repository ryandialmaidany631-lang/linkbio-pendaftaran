function getData(){return JSON.parse(localStorage.getItem("lh_linkbio")||JSON.stringify(window.DEFAULT_DATA))}
function load(){const d=getData(); schoolName.value=d.schoolName; tagline.value=d.tagline; website.value=d.website; whatsapp.value=d.whatsapp;
brochures.innerHTML=d.brochures.map((x,i)=>`<div class="row"><input id="bn${i}" value="${x.name}"><input id="bu${i}" value="${x.url}"><label class="check"><input id="ba${i}" type="checkbox" ${x.active?"checked":""}> tampil</label></div>`).join("")} 
function save(){const d=getData(); d.schoolName=schoolName.value; d.tagline=tagline.value; d.website=website.value; d.whatsapp=whatsapp.value;
d.brochures=d.brochures.map((x,i)=>({name:document.getElementById("bn"+i).value,url:document.getElementById("bu"+i).value,active:document.getElementById("ba"+i).checked}));
localStorage.setItem("lh_linkbio",JSON.stringify(d)); alert("Tersimpan di browser ini. Untuk versi online, hubungkan ke database/storage.");}
function resetData(){localStorage.removeItem("lh_linkbio");load()} load();