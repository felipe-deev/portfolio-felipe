(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
  var cv=document.getElementById('fx'),cx=cv.getContext('2d'),dpr=Math.min(window.devicePixelRatio||1,2),W,H;
  function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);}
  size();addEventListener('resize',size);
  var TEXT='header h1, section h2';
  var BOX='header .photo, header .role, header p, header .btn, .fact, .feature, .card, .skills > div, .job, .contact a';
  var els=[].slice.call(document.querySelectorAll(TEXT+','+BOX));
  var parts=[],state=new Map();
  function col(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#888';}
  function ease(t){return 1-Math.pow(1-t,3);}
  // pontos do formato do elemento
  function textPoints(el,r){
    var cs=getComputedStyle(el),o=document.createElement('canvas'),w=Math.ceil(r.width),h=Math.ceil(r.height);
    o.width=w;o.height=h;var c=o.getContext('2d');c.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;c.textBaseline='top';c.fillStyle='#000';
    var words=el.textContent.trim().split(/\s+/),line='',y=0,lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.1,lines=[];
    words.forEach(function(wd){var t=line?line+' '+wd:wd;if(c.measureText(t).width>w&&line){lines.push(line);line=wd;}else line=t;});lines.push(line);
    var off=(lh-parseFloat(cs.fontSize))/2;
    lines.forEach(function(l,i){c.fillText(l,0,i*lh+off);});
    var d=c.getImageData(0,0,w,h).data,pts=[],step=Math.max(3,Math.round(parseFloat(cs.fontSize)/14));
    for(var yy=0;yy<h;yy+=step)for(var xx=0;xx<w;xx+=step){if(d[(yy*w+xx)*4+3]>130)pts.push([xx,yy]);}
    return {pts:pts,size:Math.max(1.6,step*.75),color:col('--ink')};
  }
  function boxPoints(el,r){
    var pts=[],w=r.width,h=r.height,g=7;
    for(var x=0;x<w;x+=g){pts.push([x,0]);pts.push([x,h-1]);}
    for(var y=g;y<h-g;y+=g){pts.push([0,y]);pts.push([w-1,y]);}
    var n=Math.min(260,Math.round(w*h/900));
    for(var i=0;i<n;i++)pts.push([Math.random()*w,Math.random()*h]);
    return {pts:pts,size:2,color:col('--mute')};
  }
  function shape(el){var r=el.getBoundingClientRect();var sp=el.matches(TEXT)?textPoints(el,r):boxPoints(el,r);sp.r=r;return sp;}
  function spawn(el,mode){
    var sp=shape(el),r=sp.r,now=performance.now(),list=sp.pts;
    if(list.length>700){var k=list.length/700;list=list.filter(function(_,i){return (i%k)<1;});}
    var sy=scrollY;
    list.forEach(function(p){
      var tx=r.left+p[0],ty=r.top+p[1]+sy,a=Math.random()*Math.PI*2,dist=80+Math.random()*260;
      var fx=tx+Math.cos(a)*dist,fy=ty+Math.sin(a)*dist*.7-(mode==='out'?40:0);
      var delay=Math.random()*(mode==='in'?380:180);
      parts.push(mode==='in'?{x0:fx,y0:fy,x1:tx,y1:ty,t0:now+delay,d:700+Math.random()*350,s:sp.size,c:sp.color,m:'in'}:{x0:tx,y0:ty,x1:fx,y1:fy,t0:now+delay,d:650+Math.random()*350,s:sp.size,c:sp.color,m:'out'});
    });
    return 380+1050;
  }
  function show(el){
    var st=state.get(el);if(st==='in')return;state.set(el,'in');
    el.classList.add('fxh');var dur=spawn(el,'in');
    clearTimeout(el._fx);el._fx=setTimeout(function(){if(state.get(el)==='in'){el.classList.add('fxs');el.classList.remove('fxh');}},dur-300);
    run();
  }
  function hide(el){
    var st=state.get(el);if(st!=='in')return;state.set(el,'out');
    clearTimeout(el._fx);spawn(el,'out');el.classList.remove('fxs');el.classList.add('fxh');run();
  }
  var going=false;
  function frame(now){
    cx.clearRect(0,0,W,H);var sy=scrollY,alive=[];
    for(var i=0;i<parts.length;i++){
      var p=parts[i],t=(now-p.t0)/p.d;
      if(t<0){ if(p.m==='in'){cx.globalAlpha=.0;} alive.push(p);continue;}
      if(t>=1)continue;
      var e=ease(t),x=p.x0+(p.x1-p.x0)*e,y=p.y0+(p.y1-p.y0)*e-sy;
      cx.globalAlpha=p.m==='in'?Math.min(1,t*2.2)*(t>.85?(1-t)/.15:1):(1-t);
      cx.fillStyle=p.c;cx.fillRect(x,y,p.s,p.s);alive.push(p);
    }
    cx.globalAlpha=1;parts=alive;
    if(parts.length)requestAnimationFrame(frame);else{going=false;cx.clearRect(0,0,W,H);}
  }
  function run(){if(!going){going=true;requestAnimationFrame(frame);}}
  els.forEach(function(el){el.classList.add('fxh');state.set(el,'idle');});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting)show(e.target);else if(state.get(e.target)==='in')hide(e.target);
  });},{threshold:0.12});
  // espera a fonte carregar para o texto virar partícula com a forma certa
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){
    setTimeout(function(){els.forEach(function(el){io.observe(el);});},120);
  });
})();

(function(){
  var r=document.documentElement,b=document.querySelector('.theme'),t=b.querySelector('.tl');
  function set(m){r.setAttribute('data-theme',m);var d=m==='dark';b.setAttribute('aria-pressed',String(d));t.textContent=d?'Modo claro':'Modo escuro';try{localStorage.setItem('tema',m)}catch(e){}}
  var saved=null;try{saved=localStorage.getItem('tema')}catch(e){}
  set(saved||'light');
  b.addEventListener('click',function(){set(r.getAttribute('data-theme')==='dark'?'light':'dark')});
})();
