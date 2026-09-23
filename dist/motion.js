// Movimiento general: bloques que aparecen al entrar en pantalla y cintas del cierre que se aceleran con el scroll.
(() => {
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){return;}
 const groups=['.review-card','.about-cards article','.services-grid article','.sedes-grid>*','.coverage-grid article','.coverage-check','.steps article','.faq details','.proposalgrid article','.sectionhead','.about>div:last-child'];
 const items=[];
 groups.forEach(selector=>document.querySelectorAll(selector).forEach((item,index)=>{item.classList.add('will-reveal');item.style.setProperty('--i',String(index%6));items.push(item);}));
 const stars=document.querySelector('.stars');if(stars){stars.classList.add('pending');items.push(stars);}
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target);}}),{rootMargin:'0px 0px -8% 0px'});
  items.forEach(item=>observer.observe(item));
 }else{items.forEach(item=>item.classList.add('in'));}
 const tracks=[...document.querySelectorAll('.marquee-track')];
 let lastY=window.scrollY,boost=0;
 window.addEventListener('scroll',()=>{boost=Math.min(6,boost+Math.abs(window.scrollY-lastY)/40);lastY=window.scrollY;},{passive:true});
 (function tick(){
  boost*=.92;
  tracks.forEach(track=>track.getAnimations().forEach(animation=>{animation.playbackRate=1+boost;}));
  requestAnimationFrame(tick);
 })();
})();
