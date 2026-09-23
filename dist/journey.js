// Recorrido del scroll: el cepillo baja por el diente y deja a la vista la parte limpia.
(() => {
 const scene=document.querySelector('.smile-journey'),clean=document.querySelector('#clean-rect'),brush=document.querySelector('#journey-brush'),label=document.querySelector('#journey-label');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const TOP=10,BOTTOM=345; // alto útil del diente dentro del viewBox (corona → raíces)
 const stages=[[0,'Empezamos el control'],[.25,'Limpiando la corona'],[.55,'Cuidando las encías'],[.8,'Hasta la raíz'],[.94,'¡Sonrisa sana!']];
 let scheduled=false,scrollTimer;
 function draw(){
  scheduled=false;
  const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  const progress=reduce.matches?1:Math.min(1,Math.max(0,window.scrollY/max));
  const y=TOP+progress*(BOTTOM-TOP);
  clean.setAttribute('height',String(progress>=.94?380:y));
  brush.setAttribute('transform',`translate(0 ${y})`);
  scene.style.setProperty('--shine',String(Math.max(0,(progress-.7)/.3)));
  scene.classList.toggle('is-clean',progress>=.94);
  label.textContent=stages.filter(([from])=>progress>=from).pop()[1];
 }
 function schedule(){if(!scheduled){scheduled=true;window.requestAnimationFrame(draw);}}
 window.addEventListener('scroll',()=>{schedule();if(!reduce.matches){scene.classList.add('is-brushing');clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>scene.classList.remove('is-brushing'),180);}},{passive:true});
 window.addEventListener('resize',schedule);window.addEventListener('load',schedule);reduce.addEventListener('change',schedule);
 if(typeof ResizeObserver!=='undefined'){new ResizeObserver(schedule).observe(document.body);}
 draw();
})();
