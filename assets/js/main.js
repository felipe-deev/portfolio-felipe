(function(){
  var r=document.documentElement,b=document.querySelector('.theme'),t=b.querySelector('.tl');
  function set(m){r.setAttribute('data-theme',m);var d=m==='dark';b.setAttribute('aria-pressed',String(d));t.textContent=d?'Modo claro':'Modo escuro';try{localStorage.setItem('tema',m)}catch(e){}}
  var saved=null;try{saved=localStorage.getItem('tema')}catch(e){}
  set(saved||'light');
  b.addEventListener('click',function(){set(r.getAttribute('data-theme')==='dark'?'light':'dark')});
})();
