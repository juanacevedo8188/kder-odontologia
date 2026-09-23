// Recorrido del scroll: el cepillo baja por el diente y deja a la vista la parte limpia.
(() => {
 const finale=document.querySelector('.smile-finale');
 const scene=document.querySelector('.smile-journey'),clean=document.querySelector('#clean-rect'),brush=document.querySelector('#journey-brush'),label=document.querySelector('#journey-label');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const TOP=66,BOTTOM=474; // alto útil de la muela dentro del viewBox (corona → raíces)
 const stages=[[0,'Empezamos el control'],[.25,'Limpiando la corona'],[.55,'Cuidando las encías'],[.8,'Hasta la raíz'],[.94,'¡Diente limpio!']];
 let scheduled=false,scrollTimer;
 function draw(){
  scheduled=false;
  // La limpieza termina justo cuando llega la sonrisa final.
  const max=Math.max(1,finale.offsetTop-window.innerHeight*.35);
  const progress=reduce.matches?1:Math.min(1,Math.max(0,window.scrollY/max));
  const y=TOP+progress*(BOTTOM-TOP);
  clean.setAttribute('height',String(progress>=.94?540:y));
  brush.setAttribute('transform',`translate(0 ${y})`);
  scene.style.setProperty('--shine',String(Math.max(0,(progress-.7)/.3)));
  scene.classList.toggle('is-clean',progress>=.94);
  scene.classList.toggle('in-hero',window.scrollY<window.innerHeight*.55);
  scene.classList.toggle('gone',window.scrollY>finale.offsetTop-window.innerHeight*.25);
  label.textContent=stages.filter(([from])=>progress>=from).pop()[1];
 }
 function schedule(){if(!scheduled){scheduled=true;window.requestAnimationFrame(draw);}}
 window.addEventListener('scroll',()=>{schedule();if(!reduce.matches){scene.classList.add('is-brushing');clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>scene.classList.remove('is-brushing'),180);}},{passive:true});
 window.addEventListener('resize',schedule);window.addEventListener('load',schedule);reduce.addEventListener('change',schedule);
 if(typeof ResizeObserver!=='undefined'){new ResizeObserver(schedule).observe(document.body);}
 draw();
})();
