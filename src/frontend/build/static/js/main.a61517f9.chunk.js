(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],[,,,function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},,function(e,t,n){e.exports=n(12)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(1),l=n.n(o),c=(n(10),n(3)),i=n.n(c),s=(n(11),n(4));function m(e){var t=e.boilerState,n=new Date(t.start_time),a=new Date(t.end_time),o=a.getTime()-n.getTime();o=(o=o/1e3/60).toFixed(0);var l={day:"numeric",month:"short"},c={hour:"numeric",minute:"numeric"};return r.a.createElement("tr",null,r.a.createElement("td",null,n.toLocaleDateString("en-gb",l)," ",n.toLocaleTimeString("en-gb",c)),r.a.createElement("td",null,a.toLocaleDateString("en-gb",l)," ",a.toLocaleTimeString("en-gb",c)),r.a.createElement("td",null,o),r.a.createElement("td",null,t.hot_water_state?"ON":"OFF"),r.a.createElement("td",null,t.heating_state?"ON":"OFF"))}function u(e){var t=Object(a.useState)([]),n=Object(s.a)(t,2),o=n[0],l=n[1],c=e.limit;return Object(a.useEffect)((function(){!function(e,t){t=t||0;var n=new XMLHttpRequest,a="http://127.0.0.1:8000/api/boilerStates/".concat(t);n.responseType="json",n.open("GET",a),n.onload=function(){e(n.response,n.status)},n.onerror=function(t){console.log(t),e({message:"The request was an error"},400)},n.send()}((function(e,t){200===t?l(e):alert("There was an error")}),c)}),[]),o.map((function(e,t){return r.a.createElement(m,{boilerState:e,key:"".concat(t)})}))}var d=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement("img",{src:i.a,className:"App-logo",alt:"logo"}),r.a.createElement("p",null,"Edit ",r.a.createElement("code",null,"src/App.js")," and save to reload."),r.a.createElement("a",{className:"App-link",href:"https://reactjs.org",target:"_blank",rel:"noopener noreferrer"},"Learn React"),r.a.createElement("div",null,r.a.createElement(u,null))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var p=document.getElementById("root");p&&l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(d,null)),p);var g=document.getElementById("boilerStateRows");g&&l.a.render(r.a.createElement(u,{limit:0}),g);var E=document.getElementById("boilerStateCard");E&&l.a.render(r.a.createElement(u,{limit:5}),E),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[5,1,2]]]);
//# sourceMappingURL=main.a61517f9.chunk.js.map