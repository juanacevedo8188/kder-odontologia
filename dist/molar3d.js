// Muela 3D del hero: raymarching de una forma matemática (SDF) en WebGL, sin librerías.
// Si no hay WebGL, queda la ilustración SVG como respaldo.
(() => {
 const stage=document.querySelector('.hero-stage'),canvas=document.querySelector('.molar-3d');
 if(!stage||!canvas){return;}
 const gl=canvas.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false});
 if(!gl){return;}
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');

 const vertex='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
 const fragment=`precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform vec3 uAccent;
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float smax(float a,float b,float k){return -smin(-a,-b,k);}
float sdEll(vec3 p,vec3 r){float k0=length(p/r);float k1=length(p/(r*r));return k0*(k0-1.)/k1;}
float sdRoundCone(vec3 p,vec3 a,vec3 b,float r1,float r2){
 vec3 ba=b-a;float l2=dot(ba,ba);float rr=r1-r2;float a2=l2-rr*rr;float il2=1./l2;
 vec3 pa=p-a;float y=dot(pa,ba);float z=y-l2;vec3 xv=pa*l2-ba*y;float x2=dot(xv,xv);float y2=y*y*l2;float z2=z*z*l2;
 float k=sign(rr)*rr*rr*x2;
 if(sign(z)*a2*z2>k)return sqrt(x2+z2)*il2-r2;
 if(sign(y)*a2*y2<k)return sqrt(x2+y2)*il2-r1;
 return (sqrt(x2*a2*il2)+y*rr)*il2-r1;
}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float tooth(vec3 p){
 // corona: bloque redondeado (más ancho en el medio) + cuatro cúspides bajas arriba
 vec3 cb=abs(p-vec3(0.,.28,0.))-vec3(.34,.16,.28);
 float d=length(max(cb,0.))+min(max(cb.x,max(cb.y,cb.z)),0.)-.27;
 d=smin(d,sdEll(p-vec3(0.,.26,0.),vec3(.64,.36,.57)),.14);
 float cu=sdEll(p-vec3(.24,.66,.2),vec3(.25,.21,.23));
 cu=min(cu,sdEll(p-vec3(-.24,.66,.2),vec3(.25,.21,.23)));
 cu=min(cu,sdEll(p-vec3(.24,.63,-.2),vec3(.25,.2,.23)));
 cu=min(cu,sdEll(p-vec3(-.24,.63,-.2),vec3(.25,.2,.23)));
 d=smin(d,cu,.12);
 // fosa central y surcos entre cúspides
 d=smax(d,-sdEll(p-vec3(0.,.86,0.),vec3(.15,.13,.15)),.05);
 float gx=max(length(vec2(p.z,p.y-.87))-.055,abs(p.x)-.44);
 float gz=max(length(vec2(p.x,p.y-.87))-.055,abs(p.z)-.4);
 d=smax(d,-min(gx,gz),.035);
 // cuello
 d=smin(d,sdEll(p-vec3(0.,-.06,0.),vec3(.47,.30,.41)),.16);
 // raíces: mesial, distal y palatina, levemente curvadas
 vec3 q=p;q.x+=.05*p.y*p.y*sign(p.x);
 float r=sdRoundCone(q,vec3(.25,-.08,.03),vec3(.20,-1.08,.07),.21,.055);
 r=min(r,sdRoundCone(q,vec3(-.25,-.08,.03),vec3(-.22,-1.04,.09),.21,.055));
 r=min(r,sdRoundCone(p,vec3(0.,-.08,-.21),vec3(.03,-.96,-.38),.19,.055));
 return smin(d,r,.17);
}
vec3 pose(vec3 p){
 float t=uTime;
 p.y-=sin(t*1.047)*.06;
 p.yz*=rot(.46+uMouse.y*.25);
 p.xz*=rot(sin(t*.35)*.55+uMouse.x*.8+.35);
 return p;
}
float map(vec3 p){return tooth(pose(p)+vec3(0.,.12,0.));}
vec3 normalAt(vec3 p){vec2 e=vec2(.0015,-.0015);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
 float fov=1.28;
 vec3 ro=vec3(0.,.02,5.5),rd=normalize(vec3(uv*fov,-2.4));
 float px=fov/uRes.y/2.4;
 // esfera envolvente para no calcular píxeles vacíos
 vec3 oc=ro-vec3(0.,-.12,0.);float b=dot(oc,rd);float h=b*b-dot(oc,oc)+1.9*1.9;
 if(h<0.){gl_FragColor=vec4(0.);return;}
 float t=max(0.,-b-sqrt(h)),tmax=-b+sqrt(h),minRatio=1e3;bool hit=false;
 for(int i=0;i<110;i++){
  float d=map(ro+rd*t);
  minRatio=min(minRatio,d/t);
  if(d<.0008*t){hit=true;break;}
  t+=d*.9;if(t>tmax)break;
 }
 if(!hit){float cov=1.-smoothstep(0.,px*1.6,minRatio);gl_FragColor=vec4(mix(vec3(1.),uAccent,.6),1.)*cov*.85;return;}
 vec3 p=ro+rd*t,n=normalAt(p),v=-rd;
 vec3 lp=pose(p)+vec3(0.,.12,0.);
 float root=smoothstep(-.02,-.32,lp.y);
 vec3 enamel=vec3(.95,.93,.885),cementum=vec3(.90,.80,.63);
 vec3 base=mix(enamel,cementum,root);
 vec3 key=normalize(vec3(-.7,.62,.45)),fill=normalize(vec3(.7,-.2,.5));
 float wrap=clamp((dot(n,key)+.45)/1.45,0.,1.);
 float ao=0.;for(int i=1;i<=5;i++){float hh=.035*float(i);ao+=(hh-map(p+n*hh))/float(i);}ao=clamp(1.-3.2*ao,0.,1.);
 vec3 col=base*(.16+.92*wrap)*ao;
 col+=base*max(dot(n,fill),0.)*.18*uAccent;
 // subsuperficie cálida en los bordes
 float fres=pow(1.-max(dot(n,v),0.),3.);
 col+=vec3(1.,.93,.82)*pow(1.-max(dot(n,v),0.),1.6)*.12*(1.-root);
 // brillo del esmalte
 vec3 hv=normalize(key+v);
 col+=vec3(1.)*pow(max(dot(n,hv),0.),90.)*mix(.9,.15,root);
 col+=vec3(1.)*pow(max(dot(n,normalize(normalize(vec3(.6,.9,.3))+v)),0.),160.)*.4*(1.-root);
 // borde de luz del color de la paleta
 col+=uAccent*fres*.85;
 col=pow(col,vec3(.92));
 gl_FragColor=vec4(col,1.);
}`;
 function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(shader));return null;}return shader;}
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
 if(!vs||!fs){return;}
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){return;}
 gl.useProgram(program);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const u={res:gl.getUniformLocation(program,'uRes'),time:gl.getUniformLocation(program,'uTime'),mouse:gl.getUniformLocation(program,'uMouse'),accent:gl.getUniformLocation(program,'uAccent')};

 let accent=[.37,.88,.82],mouse=[0,0],target=[0,0],visible=true,frame=0;
 function readAccent(){
  const probe=document.createElement('span');probe.style.color='var(--accent)';document.body.appendChild(probe);
  const m=getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);probe.remove();
  if(m){accent=m.slice(0,3).map(v=>Number(v)/255);}
 }
 function resize(){
  const box=canvas.getBoundingClientRect();
  const ratio=Math.min(window.devicePixelRatio||1,window.innerWidth<760?1.25:1.6);
  canvas.width=Math.max(1,Math.round(box.width*ratio));canvas.height=Math.max(1,Math.round(box.height*ratio));
  gl.viewport(0,0,canvas.width,canvas.height);
 }
 function draw(time){
  mouse[0]+=(target[0]-mouse[0])*.06;mouse[1]+=(target[1]-mouse[1])*.06;
  gl.uniform2f(u.res,canvas.width,canvas.height);
  gl.uniform1f(u.time,reduce.matches?0:time/1000);
  gl.uniform2f(u.mouse,mouse[0],mouse[1]);
  gl.uniform3f(u.accent,accent[0],accent[1],accent[2]);
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES,0,3);
 }
 function loop(time){
  if(visible&&!reduce.matches){draw(time);if(++frame%60===0){readAccent();}}
  requestAnimationFrame(loop);
 }
 readAccent();resize();draw(0);
 stage.classList.add('has-3d');
 window.addEventListener('resize',()=>{resize();draw(performance.now());});
 new MutationObserver(()=>{readAccent();draw(performance.now());}).observe(document.documentElement,{attributes:true,attributeFilter:['data-palette']});
 document.querySelector('.hero-shell').addEventListener('pointermove',event=>{
  const box=canvas.getBoundingClientRect();
  target=[Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1)),Math.max(-1,Math.min(1,(event.clientY-box.top)/box.height*2-1))];
 });
 document.querySelector('.hero-shell').addEventListener('pointerleave',()=>{target=[0,0];});
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(canvas);}
 requestAnimationFrame(loop);
})();
