// Asistente de turnos: preguntas guiadas que terminan en un mensaje de WhatsApp para el consultorio.
// Para cambiar las preguntas, editar solo BOT_CONFIG.steps:
//  - type 'options': botones; 'text': campo libre (optional:true permite saltearlo).
//  - other:'Texto' (solo en 'options') agrega un botón que abre un campo para escribir una respuesta propia.
//  - label: cómo aparece el dato en el mensaje de WhatsApp.
const BOT_CONFIG={
 owner:'el consultorio',
 phone:'5493416121290',
 greeting:'¡Hola! Soy el asistente de Kder. Te hago unas preguntas rápidas y te paso por WhatsApp con el consultorio para coordinar tu turno.',
 steps:[
  {id:'motivo',label:'Motivo',type:'options',question:'¿Qué necesitás?',options:['Control y limpieza','Tengo dolor o una urgencia','Ortodoncia','Turno para mi hijo/a'],other:'Otro motivo',otherPlaceholder:'Contanos qué necesitás'},
  {id:'sede',label:'Sede',type:'options',question:'¿En qué sede te queda mejor?',options:['Centro · 9 de Julio 1161','Sur · Av. del Rosario 1138','Norte · Av. Alberdi 266','La que tenga turno antes']},
  {id:'cobertura',label:'Cobertura',type:'options',question:'¿Con qué cobertura te atenderías?',options:['Previnca Salud','Particular'],other:'Otra obra social',otherPlaceholder:'¿Cuál es tu obra social?'},
  {id:'horario',label:'Horario preferido',type:'options',question:'¿Qué horario te conviene?',options:['Mañana','Tarde','Me da igual']},
  {id:'nombre',label:'Nombre',type:'text',question:'Por último, ¿cómo te llamás?',placeholder:'Tu nombre (opcional)',optional:true}
 ]
};
(()=>{
 const {owner,phone,greeting,steps}=BOT_CONFIG;
 const root=document.createElement('div');
 root.className='bot';
 root.innerHTML=`<button class="bot-launcher" type="button" aria-expanded="false" aria-controls="bot-panel"><span aria-hidden="true">🦷</span> Pedí tu turno</button>
<section class="bot-panel" id="bot-panel" role="dialog" aria-label="Asistente de turnos de Kder" hidden>
 <header class="bot-head"><div><strong>Kder Odontología</strong><small>Asistente de turnos</small></div><button class="bot-close" type="button" aria-label="Cerrar asistente">×</button></header>
 <div class="bot-log" aria-live="polite"></div>
 <div class="bot-input"></div>
</section>`;
 document.body.appendChild(root);
 const launcher=root.querySelector('.bot-launcher');
 const panel=root.querySelector('.bot-panel');
 const log=root.querySelector('.bot-log');
 const input=root.querySelector('.bot-input');
 let answers={};
 let current=0;
 let started=false;
 function bubble(text,from){const item=document.createElement('p');item.className='bot-msg '+from;item.textContent=text;log.appendChild(item);log.scrollTop=log.scrollHeight;return item;}
 function toolbar(){
  const bar=document.createElement('div');bar.className='bot-tools';
  if(current>0){const back=document.createElement('button');back.type='button';back.className='bot-link';back.textContent='← Volver';back.addEventListener('click',goBack);bar.appendChild(back);}
  const progress=document.createElement('span');progress.textContent=current<steps.length?`Pregunta ${current+1} de ${steps.length}`:'Listo';bar.appendChild(progress);
  return bar;
 }
 function ask(){
  input.innerHTML='';
  if(current>=steps.length){finish();return;}
  const step=steps[current];
  bubble(step.question,'from-bot');
  if(step.type==='options'){
   const group=document.createElement('div');group.className='bot-options';
   step.options.forEach(option=>{const button=document.createElement('button');button.type='button';button.textContent=option;button.addEventListener('click',()=>answer(option));group.appendChild(button);});
   if(step.other){
    const other=document.createElement('button');other.type='button';other.className='bot-other';other.textContent=step.other+' ✏️';
    other.addEventListener('click',()=>{group.remove();input.appendChild(textForm(step,step.otherPlaceholder||'Escribí tu respuesta',140));const back=document.createElement('button');back.type='button';back.className='bot-link';back.textContent='Ver opciones';back.addEventListener('click',()=>{log.lastElementChild.remove();ask();});input.appendChild(back);input.querySelector('.bot-text input').focus();log.scrollTop=log.scrollHeight;});
    group.appendChild(other);
   }
   input.appendChild(group);
  }else{
   input.appendChild(textForm(step,step.placeholder||'',80));
   if(step.optional){const skip=document.createElement('button');skip.type='button';skip.className='bot-link';skip.textContent='Prefiero no decirlo';skip.addEventListener('click',()=>answer(''));input.appendChild(skip);}
   input.querySelector('.bot-text input').focus();
  }
  input.prepend(toolbar());
  log.scrollTop=log.scrollHeight;
 }
 function textForm(step,placeholder,maxLength){
  const form=document.createElement('form');form.className='bot-text';
  const field=document.createElement('input');field.type='text';field.maxLength=maxLength;field.placeholder=placeholder;field.setAttribute('aria-label',step.question);field.required=!step.optional;
  field.autocomplete='off';
  const send=document.createElement('button');send.type='submit';send.className='button small';send.textContent='Enviar';
  form.append(field,send);
  form.addEventListener('submit',event=>{event.preventDefault();const value=field.value.trim();if(value||step.optional){answer(value);}});
  return form;
 }
 function answer(value){
  answers[steps[current].id]=value;
  bubble(value||'—','from-user');
  current++;ask();
 }
 function goBack(){
  // Borra la pregunta actual y la respuesta anterior para volver a preguntarla.
  const messages=[...log.children];
  const lastUser=messages.map(item=>item.classList.contains('from-user')).lastIndexOf(true);
  messages.slice(Math.max(lastUser-1,0)).forEach(item=>item.remove());
  current--;delete answers[steps[current].id];ask();
 }
 function buildMessage(){
  const name=answers.nombre;
  const lines=steps.filter(step=>step.id!=='nombre'&&answers[step.id]).map(step=>`• ${step.label}: ${answers[step.id]}`);
  return `Hola, Kder${name?`. Soy ${name}`:''}. Quisiera pedir un turno:\n\n${lines.join('\n')}\n\n¿Qué días tienen disponibles?`;
 }
 function finish(){
  bubble(`¡Gracias! Este es el mensaje que le vas a mandar a ${owner}. Revisalo y envialo desde WhatsApp.`,'from-bot');
  const summary=document.createElement('pre');summary.className='bot-summary';summary.textContent=buildMessage();log.appendChild(summary);log.scrollTop=log.scrollHeight;
  const link=document.createElement('a');link.className='button bot-send';link.target='_blank';link.rel='noopener noreferrer';
  link.href=`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`;link.textContent='Enviar por WhatsApp ↗';
  const restart=document.createElement('button');restart.type='button';restart.className='bot-link';restart.textContent='Empezar de nuevo';restart.addEventListener('click',reset);
  input.append(toolbar(),link,restart);
 }
 function reset(){answers={};current=0;log.innerHTML='';bubble(greeting,'from-bot');ask();}
 function toggle(open){
  panel.hidden=!open;launcher.setAttribute('aria-expanded',String(open));root.classList.toggle('open',open);
  if(open&&!started){started=true;reset();}
  if(!open){launcher.focus();}
 }
 launcher.addEventListener('click',()=>toggle(panel.hidden));
 root.querySelector('.bot-close').addEventListener('click',()=>toggle(false));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){toggle(false);}});
})();
