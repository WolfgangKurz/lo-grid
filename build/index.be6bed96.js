import{e as o,b as u,A as p,P as m,h as f}from"./vendor.5c501c0e.js";/* empty css                         */const h=function(){const e=document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}(),g=function(i){return"/"+i},l={},y=function(e,t,v){return!t||t.length===0?e():Promise.all(t.map(n=>{if(n=g(n),n in l)return;l[n]=!0;const s=n.endsWith(".css"),c=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${c}`))return;const r=document.createElement("link");if(r.rel=s?"stylesheet":h,s||(r.as="script",r.crossOrigin=""),r.href=n,document.head.appendChild(r),s)return new Promise((a,d)=>{r.addEventListener("load",a),r.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${n}`)))})})).then(()=>e())},E=()=>{if(typeof window<"u"){const e=document.querySelector("#pageonloading");if(e){const t=e.parentNode;t&&t.removeChild(e)}}return o("div",{id:"app",children:o("div",{class:"container p-4",children:o(u,{children:o(p,{default:!0,path:"/:p1?/:p2?",...(e=>({loading:()=>o("span",{class:"text-secondary",children:"Loading page"}),getComponent:()=>e().then(t=>t.default)}))(()=>y(()=>import("./routes.b2d911e9.js"),["build/routes.b2d911e9.js","build/index.2936ab58.css","build/vendor.5c501c0e.js","build/base.3691bc0b.js","build/components.b4b4b76e.js","build/components.38431eba.css"]))})})})})};m(f(E,{}),document.getElementById("page"));
