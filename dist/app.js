const PHONE='5493416121290';
const whatsappUrl=message=>`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

// Sedes: direcciones de directorios públicos; coordenadas aproximadas (a confirmar).
const sedes={
 centro:{tag:'CENTRO',name:'Kder Centro',address:'9 de Julio 1161, Rosario',phone:'(0341) 440-9138 · 448-2955',coords:[-32.95378,-60.64085]},
 sur:{tag:'SUR',name:'Kder Sur',address:'Av. del Rosario 1138, Rosario',phone:'(0341) 463-7430',coords:[-32.9858,-60.6452]},
 norte:{tag:'NORTE',name:'Kder Norte',address:'Av. Alberdi 266, Rosario',phone:'(0341) 438-4539',coords:[-32.9128,-60.6818]}
};
let sedesMap;
const markers={};
function selectSede(key,pan=false){
 const sede=sedes[key];
 document.querySelectorAll('[data-sede]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.sede===key)));
 document.querySelector('#sede-tag').textContent=sede.tag;
 document.querySelector('#sede-name').textContent=sede.name;
 document.querySelector('#sede-address').textContent=sede.address;
 document.querySelector('#sede-phone').textContent=sede.phone;
 document.querySelector('#sede-turno').href=whatsappUrl(`Hola, Kder. Quisiera pedir un turno en la sede ${sede.tag.toLowerCase()} (${sede.address}).`);
 document.querySelector('#sede-maps').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(sede.address+', Santa Fe, Argentina');
 Object.entries(markers).forEach(([id,marker])=>{const element=marker.getElement();if(element){element.classList.toggle('selected',id===key);}});
 if(sedesMap&&pan){sedesMap.panTo(sede.coords);markers[key].openPopup();}
}
document.querySelectorAll('[data-sede]').forEach(button=>button.addEventListener('click',()=>selectSede(button.dataset.sede,true)));
if(typeof L!=='undefined'){
 sedesMap=L.map('real-map',{scrollWheelZoom:false});
 const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(sedesMap);
 tiles.on('tileerror',()=>{document.querySelector('#map-error').hidden=false;});
 tiles.on('tileload',()=>{document.querySelector('#map-error').hidden=true;});
 Object.entries(sedes).forEach(([key,sede])=>{
  const marker=L.marker(sede.coords,{icon:L.divIcon({className:'sede-marker',html:`<span><b>${sede.tag[0]}</b></span>`,iconSize:[40,40],iconAnchor:[20,40],popupAnchor:[0,-36]}),title:sede.name,alt:sede.name,keyboard:true}).addTo(sedesMap);
  marker.bindPopup(`<strong>${sede.name}</strong><br>${sede.address}<br><small>Ubicación aproximada</small>`);
  marker.on('click',()=>selectSede(key));markers[key]=marker;
 });
 sedesMap.fitBounds(Object.values(sedes).map(sede=>sede.coords),{padding:[50,50]});
}else{document.querySelector('#map-error').hidden=false;}
selectSede('centro');

// Consulta de obra social
document.querySelector('#coverage-form').addEventListener('submit',event=>{
 event.preventDefault();
 const value=document.querySelector('#obra-social').value.trim();
 if(!value){return;}
 window.open(whatsappUrl(`Hola, Kder. Quisiera saber si atienden con ${value}.`),'_blank','noopener');
});

// Formulario de turno: arma el mensaje y lo abre en WhatsApp.
document.querySelector('#form').addEventListener('submit',event=>{
 event.preventDefault();
 const name=document.querySelector('#nombre').value.trim();
 const reason=document.querySelector('#motivo').value.trim();
 if(!name||!reason){return;}
 const text=`Hola, Kder. Soy ${name} y quisiera pedir un turno.\n\nSede: ${document.querySelector('#sede').value}\nCobertura: ${document.querySelector('#cobertura-form').value}\nMotivo: ${reason}\n\n¿Qué días y horarios tienen disponibles?`;
 document.querySelector('#message').textContent=text;
 document.querySelector('#send-whatsapp').href=whatsappUrl(text);
 document.querySelector('#result').hidden=false;
 document.querySelector('#copy-status').textContent='';
});
document.querySelector('#copy').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(document.querySelector('#message').textContent);document.querySelector('#copy-status').textContent='Mensaje copiado.';}
 catch{document.querySelector('#copy-status').textContent='No se pudo copiar automáticamente. Podés seleccionar y copiar el texto.';}
});
