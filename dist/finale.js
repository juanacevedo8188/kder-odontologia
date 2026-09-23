// Cierre: la cámara arranca pegada a un diente y se aleja hasta mostrar la sonrisa completa.
(() => {
 const section=document.querySelector('.smile-finale'),zoom=section.querySelector('.smile-zoom');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const ease=t=>1-Math.pow(1-t,3);
 const clamp=value=>Math.min(1,Math.max(0,value));
 let scheduled=false;
 function draw(){
  scheduled=false;
  if(reduce.matches){section.style.removeProperty('--zoom');return;}
  const travel=Math.max(1,section.offsetHeight-window.innerHeight);
  const progress=clamp((window.scrollY-section.offsetTop)/travel);
  const zoomOut=ease(clamp(progress/.7));
  const start=parseFloat(getComputedStyle(zoom).getPropertyValue('--zoom-start'))||6; // la foto no aguanta tanto zoom como la ilustración
  section.style.setProperty('--zoom',(start-(start-1)*zoomOut).toFixed(3));
  // El foco se centra en el diente donde arranca el zoom (mismo punto que transform-origin).
  const style=getComputedStyle(zoom),fx=parseFloat(style.getPropertyValue('--focus-x'))/100,fy=parseFloat(style.getPropertyValue('--focus-y'))/100;
  section.style.setProperty('--spot-x',`${zoom.offsetLeft+zoom.offsetWidth*fx}px`);
  section.style.setProperty('--spot-y',`${zoom.offsetTop+zoom.offsetHeight*fy}px`);
  section.style.setProperty('--spot',(1-zoomOut).toFixed(3));
  section.style.setProperty('--sparkle',clamp((progress-.6)/.2).toFixed(2));
  section.style.setProperty('--text',clamp((progress-.65)/.25).toFixed(2));
 }
 function schedule(){if(!scheduled){scheduled=true;window.requestAnimationFrame(draw);}}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);window.addEventListener('load',schedule);reduce.addEventListener('change',schedule);
 draw();
})();
