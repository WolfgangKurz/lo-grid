import{e as o,b as p,A as m,P as f,h}from"./vendor.5c501c0e.js";/* empty css                         */const g=function(){const e=document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}(),y=function(i,e){return new URL(i,e).href},l={},E=function(e,t,c){return!t||t.length===0?e():Promise.all(t.map(n=>{if(n=y(n,c),n in l)return;l[n]=!0;const s=n.endsWith(".css"),a=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${a}`))return;const r=document.createElement("link");if(r.rel=s?"stylesheet":g,s||(r.as="script",r.crossOrigin=""),r.href=n,document.head.appendChild(r),s)return new Promise((d,u)=>{r.addEventListener("load",d),r.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${n}`)))})})).then(()=>e())},L=()=>{if(typeof window<"u"){const e=document.querySelector("#pageonloading");if(e){const t=e.parentNode;t&&t.removeChild(e)}}return o("div",{id:"app",children:o("div",{class:"container p-4",children:o(p,{children:o(m,{default:!0,path:"/:p1?/:p2?",...(e=>({loading:()=>o("span",{class:"text-secondary",children:"Loading page"}),getComponent:()=>e().then(t=>t.default)}))(()=>E(()=>import("./routes.b2d911e9.js"),["routes.b2d911e9.js","index.5ec64c65.css","vendor.5c501c0e.js","base.3691bc0b.js","components.b4b4b76e.js","components.223fd4de.css"],import.meta.url))})})})})};f(h(L,{}),document.getElementById("page"));