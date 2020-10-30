(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{240:function(e,t,a){e.exports=a(456)},245:function(e,t,a){},454:function(e,t,a){},455:function(e,t,a){},456:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),o=a(13),c=a.n(o),l=(a(245),a(16)),s=a(7),i=a.n(s),m=window.location.host;function u(e,t,a,n){var r;n&&(r=JSON.stringify(n));var o=new XMLHttpRequest,c="".concat(m,"/api/").concat(t);o.responseType="json";var l=function(e){var t=null;if(document.cookie&&""!==document.cookie)for(var a=document.cookie.split(";"),n=0;n<a.length;n++){var r=a[n].trim();if(r.substring(0,e.length+1)===e+"="){t=decodeURIComponent(r.substring(e.length+1));break}}return t}("csrftoken");o.open(e,c),o.setRequestHeader("Content-Type","application/json"),l&&(o.setRequestHeader("X-Requested-With","XMLHttpRequest"),o.setRequestHeader("X-CSRFToken",l)),o.onload=function(){a(o.response,o.status)},o.onerror=function(e){console.log(e),a({message:"The current states request was an error"},400)},o.send(r)}function d(e){var t=e.boilerState,a=i()(t.start_time),n=i()(t.end_time);return r.a.createElement("tr",null,r.a.createElement("td",null,a.format("DD MMM HH:mm")),r.a.createElement("td",null,n.format("DD MMM HH:mm")),r.a.createElement("td",null,n.diff(a,"m")),r.a.createElement("td",null,t.hot_water_state?"ON":"OFF"),r.a.createElement("td",null,t.heating_state?"ON":"OFF"))}function h(e){var t=Object(n.useState)([]),a=Object(l.a)(t,2),o=a[0],c=a[1],s=e.limit;return Object(n.useEffect)((function(){u("GET","boilerStates/".concat(s),(function(e,t){200===t?c(e):alert("There was an error");var a=document.getElementById("history-table-spinner");a&&(a.innerHTML="")}),s)}),[]),o.map((function(e,t){return r.a.createElement(d,{boilerState:e,key:"".concat(t)})}))}function f(e){var t=document.getElementById(e);t&&(t.innerHTML="")}function g(e){var t,a=e.agileRate,n=e.todaysMin,o=e.tmrsMin,c=i()(a.valid_from),l=i()(a.valid_to),s=a.rate,m=i()(),u="";return n.indexOf(a.valid_from)>-1?u="info":o.indexOf(a.valid_from)>-1?u="primary":s>15?u="danger":s<0?u="success":m.isAfter(l)?u="secondary":m.isBetween(c,l)&&(u="light"),m.isBetween(c,l)&&(t={fontSize:"larger",fontWeight:"bold"}),r.a.createElement("tr",{className:"table-".concat(u)},r.a.createElement("td",{style:t},c.format("ddd DD MMM HH:mm")),r.a.createElement("td",{style:t},l.format("ddd DD MMM HH:mm")),r.a.createElement("td",{style:t},s.toFixed(3),"p"))}function p(e){var t=Object(n.useState)([]),a=Object(l.a)(t,2),o=a[0],c=a[1],s=Object(n.useState)([]),i=Object(l.a)(s,2),m=i[0],d=i[1],h=Object(n.useState)([]),p=Object(l.a)(h,2),v=p[0],E=p[1];return Object(n.useEffect)((function(){u("GET","agileRates",(function(e,t){200===t?(c(e.rates),d(e.todaysMin),E(e.tmrsMin)):alert("There was an error"),f("agile-rates-table-spinner")}))}),[]),o.map((function(e,t){return r.a.createElement(g,{agileRate:e,todaysMin:m,tmrsMin:v,key:"".concat(t)})}))}function v(e){var t=Object(n.useState)([]),a=Object(l.a)(t,2),o=a[0],c=a[1],s=Object(n.useState)([]),m=Object(l.a)(s,2),d=m[0],h=m[1],g=Object(n.useState)([]),p=Object(l.a)(g,2),v=p[0],E=p[1],b=e.type;return Object(n.useEffect)((function(){u("GET","agileRates",(function(e,t){200===t?(c(e.rates),h(e.todaysMin),E(e.tmrsMin)):alert("There was an error"),f("agile-rates-card-spinner")}))}),[]),function(e){if(o.length<1)return"";for(var t=i()(d[0]),a=i()(v[0]),n=i()(),c=9999,l=[9999,9999],s=0;s<o.length;s++){var m,u,h=i()(o[s].valid_from),f=i()(o[s].valid_to);if(n.isBetween(h,f)){c=o[s].rate;var g=i()(o[s].valid_from);s<o.length-1&&(l[0]=o[s+1].rate),s<o.length-2&&(l[1]=o[s+2].rate)}h.isSame(t,"m")?m=o[s].rate:h.isSame(a,"m")&&(u=o[s].rate)}return"homepage"===e?r.a.createElement("div",null,r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-6"},r.a.createElement("h4",{className:"display-6"},"Current"),r.a.createElement("h5",{className:"lead"},c.toFixed(3),"p"),r.a.createElement("span",{style:{fontSize:"95%"}},"since ",g.format("HH:mm"))),r.a.createElement("div",{className:"col-6"},r.a.createElement("h4",{className:"display-6"},"Today's Lowest"),r.a.createElement("h5",{className:"lead"},m?m.toFixed(3):"","p"),r.a.createElement("span",{style:{fontSize:"95%"}},"at ",d.map((function(e){return i()(e).format("HH:mm")})).join()))),r.a.createElement("hr",{className:"alert-dark my-4"}),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-6"},r.a.createElement("h4",{className:"display-6"},"Next Two"),9999!==l[0]&&r.a.createElement("h5",{className:"lead"},l[0].toFixed(3),"p"),9999!==l[1]&&r.a.createElement("h5",{className:"lead"},l[1].toFixed(3),"p")),u&&r.a.createElement("div",{className:"col-6"},r.a.createElement("h4",{className:"display-6"},"Tomorrow's Lowest"),r.a.createElement("h5",{className:"lead"},u.toFixed(3),"p"),r.a.createElement("span",{style:{fontSize:"95%"}},"at ",v.map((function(e){return i()(e).format("HH:mm")})).join())))):r.a.createElement("div",{className:"row justify-content-center"},r.a.createElement("div",{className:"col-md-4 col-sm-12 mb-3"},r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"card-body"},r.a.createElement("h5",{className:"card-title mb-3"},"Current Rate"),r.a.createElement("h3",{className:"font-weight-bold mb-3"},c.toFixed(3),"p"),r.a.createElement("h5",null,"since ",g.format("HH:mm"))))),r.a.createElement("div",{className:"col-md-4 col-sm-12 mb-3"},r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"card-body"},r.a.createElement("h5",{className:"card-titl mb-3"},"Today's Lowest"),r.a.createElement("h3",{className:"font-weight-bold mb-3"},m?m.toFixed(3):"","p"),r.a.createElement("h5",null,"at ",d.map((function(e){return i()(e).format("HH:mm")})).join())))),r.a.createElement("div",{className:"col-md-4 col-sm-12 mb-3"},r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"card-body"},r.a.createElement("h5",{className:"card-title mb-3"},"Tomorrow's Lowest"),r.a.createElement("h3",{className:"font-weight-bold mb-3"},u?u.toFixed(3):"",u&&"p"),u&&r.a.createElement("h5",null,"at ",v.map((function(e){return i()(e).format("HH:mm")})).join())))))}(b)}function E(e){var t,a=e.controlState,n=e.operationState,o=e.boostState,c=e.cat;t=o||n?"danger":a?"warning":"success";var l,s="heating"===c?"Heating":"Water";l=o?"Boost\nOn":a?"hotWater"===c?"Scheduled\nControl":"Thermostat\nControl":"Control\nOff";return r.a.createElement("div",null,r.a.createElement("button",{className:"btn btn-block btn-".concat(t),style:{maxWidth:130,whiteSpace:"pre-wrap"},onClick:function(e){e.preventDefault(),e.target.blur();u("POST","currentStates/change",(function(e,t){201===t?u("GET","currentStates",y,{}):alert("State change failed")}),{device:c,state:!a})}},r.a.createElement("h4",{class:"font-weight-bold alert-heading text-center pt-1"},s),r.a.createElement("hr",{className:"alert-".concat(t)}),r.a.createElement("h6",{className:"text-center"},l),r.a.createElement("hr",{className:"alert-".concat(t)}),r.a.createElement(b,{state:n,type:0})))}function b(e){var t=e.state?"ON":"OFF",a=1===e.type?"h3":"h4";return r.a.createElement(a,{className:"font-weight-bold text-center"},t)}function y(e,t){!function(e){var t=e?"danger":"success";document.getElementById("boiler-operation-block").className="alert alert-".concat(t),c.a.render(r.a.createElement(b,{state:e,type:1}),document.getElementById("boiler-on-off-text"))}(e.operation[2]),c.a.render(r.a.createElement(E,{controlState:e.control.hotWater.state,operationState:e.operation[0],boostState:e.control.hotWater.boost,cat:"hotWater"}),document.getElementById("hotWater-states-block")),c.a.render(r.a.createElement(E,{controlState:e.control.heating.state,operationState:e.operation[1],boostState:!1,cat:"heating"}),document.getElementById("heating-states-block"))}function w(e){var t=Object(n.useState)([]),a=Object(l.a)(t,2),o=a[0],c=a[1],s=Object(n.useState)([]),i=Object(l.a)(s,2),m=i[0],d=i[1];return Object(n.useEffect)((function(){u("GET","googleNest",(function(e,t){200===t?(d(e.traits["sdm.devices.traits.ThermostatTemperatureSetpoint"].heatCelsius),c(e.traits["sdm.devices.traits.Temperature"].ambientTemperatureCelsius)):alert("There was an error")}))}),[]),"number"===typeof o?r.a.createElement("div",null,r.a.createElement("h5",null,"Ambient Temp:  ",o.toFixed(2)," "),r.a.createElement("h5",null,"Thermostat Set Temp: ",m.toFixed(2))):r.a.createElement("div",{class:"text-center"},r.a.createElement("div",{class:"spinner-border",role:"status"},r.a.createElement("span",{class:"sr-only"},"Loading...")))}m.startsWith("http")||(m="http://".concat(m));var k=a(17),N=a(137),S=a(90),x=a(91),O=a(92),C=a(107),M=a(106),j=a(46),T=a(460),R=a(465),F=a(461),Y=a(462),B=a(463),D=a(21),V=a(144),H=a(47),L=a(464).a.RangePicker;function P(e){var t,a=e.btnType,n=e.stateVar,o=e.onValueChange;if("type"===a)t=q;else if("view"===a)t=X;else if("plot"===a){for(var c={},s=0,i=Object.entries(G);s<i.length;s++){var m=Object(l.a)(i[s],2),u=m[0],d=m[1];"rate"!==u&&"avgCost"!==u&&(c[u]=d)}t=c}return r.a.createElement(V.a,{type:"radio",name:"options",size:"lg",defaultValue:n,onChange:function(e,t){t.target.blur(),o([a,e])}},Object.keys(t).map((function(e,a){return r.a.createElement(H.a,{value:e,key:"".concat(a)},t[e].label)})))}var I=function(e){Object(C.a)(a,e);var t=Object(M.a)(a);function a(e){var n;return Object(S.a)(this,a),(n=t.call(this,e)).datesChanged=function(e){n.setState({dateRange:e,preSelection:null})},n.buttonDateRangeClicked=function(e){var t;"day"===e?t=[i()().subtract(1,"d").set({hour:0,minute:0,second:0,millisecond:0}),i()().subtract(1,"d").set({hour:0,minute:0,second:0,millisecond:0})]:"week"===e?t=[i.a.max(i()().subtract(8,"d"),n.props.datesLimit[0]),i()().subtract(1,"d")]:"month"===e?t=[i.a.max(i()().subtract({months:1,days:1}),n.props.datesLimit[0]),i()().subtract(1,"d")]:"all"===e&&(t=n.props.datesLimit),n.setState({dateRange:t,preSelection:e})},n.state={dateRange:e.dateRange,preSelection:null},n}return Object(x.a)(a,[{key:"componentDidUpdate",value:function(e,t){t.dateRange!==this.state.dateRange&&this.props.datesChanged(this.state.dateRange)}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"row align-items-center"},r.a.createElement("div",{className:"col-6",align:"right"},r.a.createElement(V.a,{type:"radio",name:"options",value:this.state.preSelection,onChange:this.buttonDateRangeClicked},r.a.createElement(H.a,{value:"all"},"All",r.a.createElement("br",null),"Time"),r.a.createElement(H.a,{value:"month"},"Past",r.a.createElement("br",null),"Month"),r.a.createElement(H.a,{value:"week"},"Past",r.a.createElement("br",null),"Week"),r.a.createElement(H.a,{value:"day"},"Past",r.a.createElement("br",null),"Day"))),r.a.createElement("div",{className:"col-6 ",align:"left"},r.a.createElement(L,{size:"large",inputReadOnly:!0,value:this.state.dateRange,onChange:this.datesChanged,disabledDate:function(t){return t&&!t.isBetween(e.props.datesLimit[0],e.props.datesLimit[1],"[]")}})))}}]),a}(n.Component);function A(e){var t=e.data,a=e.barPlotOptions;e.chartView;return t?r.a.createElement(D.g,{width:"100%",height:500},r.a.createElement(D.c,{data:t},r.a.createElement(D.b,{stroke:"#aaaaaaaa"}),r.a.createElement(D.i,{dataKey:"x"}),r.a.createElement(D.j,{yAxisId:"left",type:"number",dataKey:a.key,name:a.label,unit:a.unit}),r.a.createElement(D.j,{yAxisId:"rate",orientation:"right",type:"number",name:"Rate",unit:"p"}),r.a.createElement(D.f,{y:0,yAxisId:"rate",stroke:"#8884d8",strokeWidth:1.25}),r.a.createElement(D.f,{y:14.6,yAxisId:"rate",stroke:"#795ae090",strokeWidth:1}),r.a.createElement(D.a,{yAxisId:"left",fill:"#000000",name:a.label,dataKey:a.key,stroke:"#8884d8"}),r.a.createElement(D.f,{y:0,yAxisId:"left",stroke:"white",strokeWidth:1}),r.a.createElement(D.e,{yAxisId:"rate",type:"monotone",name:"Rate",dot:!1,dataKey:"rate",stroke:"#555555",legendType:"none"}),r.a.createElement(D.e,{yAxisId:"rate",type:"monotone",name:"Average Unit Cost",dataKey:"avgCost",stroke:"#8884d8"}),r.a.createElement(D.d,null),r.a.createElement(D.h,{content:r.a.createElement(W,null)}))):""}function W(e){var t=e.active,a=e.payload,n=e.label;if(t&&n&&a){var o=a.find((function(e){return"avgCost"===e.dataKey})),c=a.find((function(e){return"avgCost"!==e.dataKey&&"rate"!==e.dataKey})),l=a.find((function(e){return"rate"===e.dataKey}));return r.a.createElement("div",{className:"custom-tooltip"},r.a.createElement("p",{className:"tooltip-x-value"},"".concat(n)," "),c&&r.a.createElement("div",{className:"tooltip-value-y"},r.a.createElement("p",null,"".concat(G[c.dataKey].label,": "),c.value.toFixed(3),G[c.dataKey].unit)),o&&r.a.createElement("div",{className:"tooltip-value-avgCost"},r.a.createElement("p",null,"".concat(G.avgCost.label,": "),o.value.toFixed(3),G.avgCost.unit)),l&&r.a.createElement("div",{className:"tooltip-value-rate"},r.a.createElement("p",null,"".concat(G.rate.label,": "),l.value.toFixed(3),G.rate.unit)))}return""}function _(e){var t=e.dataPlot,a=e.chartView,n="";return null!=t.consumption&&(n="hour"===a||"day"===a?"".concat(t.cost.toFixed(2),"p"):"\xa3".concat((t.cost/100).toFixed(2))),void 0!==t.rate&&null!==t.rate?r.a.createElement("tr",null,r.a.createElement("td",null,t.x),r.a.createElement("td",null,"".concat(t.rate.toFixed(3),"p")),r.a.createElement("td",null,null!=t.consumption&&t.consumption.toFixed(3)),r.a.createElement("td",null,n),r.a.createElement("td",null,null!=t.consumption&&"".concat(t.avgCost.toFixed(3),"p"))):""}function U(e){var t=e.dataPlots,a=e.chartType,n=e.chartView,o="Rate",c="Used (kWh)",l="Cost";"avg"===a&&"hour"!==n?(o="Mean Daily Rate",c="Mean Daily Use (kWh)",l="Mean Daily Cost"):"avg"===a&&"hour"===n?(o="Mean Block Rate",c="Mean Use (kWh)",l="Mean Cost"):"actl"===a&&"hour"!==n&&(o="Mean Block Rate");var s,i=0,m=0,u=Object(k.a)(t);try{for(u.s();!(s=u.n()).done;){var d=s.value;i+=d.consumption?d.consumption:0,m+=d.cost?d.cost:0}}catch(f){u.e(f)}finally{u.f()}var h=r.a.createElement("tr",{className:"table-secondary font-weight-bold",style:{fontSize:"135%"}},r.a.createElement("td",{className:"text-center",colSpan:2},"Sum of all time periods"),r.a.createElement("td",null,"Total Use: ",i.toFixed(3),"kWh"),r.a.createElement("td",null,"Total Cost: \xa3",(m/100).toFixed(2)),r.a.createElement("td",null,"Average Unit Cost: ",(m/i).toFixed(3),"p"));return t?r.a.createElement("div",{className:"row justify-content-center"},r.a.createElement("div",{className:"col-12"},r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"card-body table-responsive-sm"},r.a.createElement("table",{className:"table table-striped",style:{width:"100%",tableLayout:"fixed"}},r.a.createElement("tbody",null,h,r.a.createElement("tr",{className:"table-secondary font-weight-bold",style:{fontSize:"110%"}},r.a.createElement("th",null,"Period"),r.a.createElement("th",null,o),r.a.createElement("th",null,c),r.a.createElement("th",null,l),r.a.createElement("th",null,"Average Unit Cost (per kWh)")),t.map((function(e,t){return r.a.createElement(_,{dataPlot:e,chartView:n,key:"".concat(t)})})))))))):""}function z(e,t){for(var a=[],n=i()(e[1]).endOf(t),r=i()(e[0]);r.isBefore(n);r.add(1,t))a.push(r.format(X[t].actlStringFormat));return a}var K=function(e){Object(C.a)(a,e);var t=Object(M.a)(a);function a(e){var n;Object(S.a)(this,a),(n=t.call(this,e)).chartOptionChanged=function(e){"type"===e[0]?(n.chartType=e[1],localStorage.setItem("consumptionPage/chartType",e[1]),n.processAnyViewTypeChange()):"view"===e[0]?(n.chartView=e[1],localStorage.setItem("consumptionPage/chartView",e[1]),n.processAnyViewTypeChange()):"plot"===e[0]&&(localStorage.setItem("consumptionPage/chartPlot",e[1]),n.setState({chartBarPlot:e[1]}))},n.prevNextClicked=function(e){var t,a=n.state.dateRange,r=e.target.id,o="hour"===n.chartView?"days":n.chartView;if("prev-date-range"===r){if((t=a.map((function(e){return i()(e).subtract(1,o)})))[0].isBefore(n.state.datesLimit[0])){var c=i.a.min(i()(n.state.datesLimit[0]).add(Object(N.a)({},o,1)),n.state.datesLimit[1]);t=[n.state.datesLimit[0],c]}}else(t=a.map((function(e){return i()(e).add(1,o)})))[1].isAfter(n.state.datesLimit[1])&&(t=[i.a.max(i()(n.state.datesLimit[1]).subtract(Object(N.a)({},o,1)),n.state.datesLimit[0]),n.state.datesLimit[1]]);n.dateRangeElement.current.datesChanged(t)},n.datesChanged=function(e){e&&(localStorage.setItem("consumptionPage/dateRange",e.map((function(e){return e.format("L")})).join(",")),n.setState({dateRange:e},n.processAnyViewTypeChange))};var o=localStorage.getItem("consumptionPage/dateRange"),c=localStorage.getItem("consumptionPage/chartType"),l=localStorage.getItem("consumptionPage/chartView"),s=localStorage.getItem("consumptionPage/chartPlot");return n.state={useBlocks:[],dataPlot:[],dateRange:o?o.split(",").map((function(e){return i()(e,"L")})):[i()(),i()()],chartBarPlot:s||"cost",datesLimit:[i()(),i()()]},n.chartView=l||"hour",n.chartType=c||"avg",n.dateRangeElement=r.a.createRef(),n.datesChanged=n.datesChanged.bind(Object(O.a)(n)),n}return Object(x.a)(a,[{key:"processAnyViewTypeChange",value:function(){var e=this.chartView,t=[];"avg"===this.chartType?"day"===e?t=i.a.weekdays():"week"===e?t=z(this.state.dateRange,e):"month"===e&&(t=i.a.months()):"hour"!==e&&(t=z(this.state.dateRange,e));var a=t.map((function(e){return{x:e}}));a="avg"===this.chartType?this.processAvgView(a):this.processActlView(a);var n,r=Object(k.a)(a);try{for(r.s();!(n=r.n()).done;){var o=n.value;o.avgCost=o.consumption>=0?o.cost/o.consumption:null}}catch(c){r.e(c)}finally{r.f()}this.setState({dataPlot:a})}},{key:"processAvgView",value:function(e){var t,a=this;if("hour"===this.chartView){t=T.a(this.state.useBlocks,(function(e){return e.time.isSameOrAfter(a.state.dateRange[0])&&e.time.isBefore(a.state.dateRange[1].endOf("day"))}));for(var n=[],r=0;r<24;r++)n.push(i()({hour:r}).format(X.hour.avgStringFormat)),n.push(i()({hour:r,minute:30}).format(X.hour.avgStringFormat));var o=R.a(t,(function(e){return e.time.format(X[a.chartView].avgStringFormat)}));e=n.map((function(e){var t=o.get(e);return t?{x:e,rate:F.a(t,(function(e){return e.rate})),consumption:F.a(t,(function(e){return e.consumption})),cost:F.a(t,(function(e){return e.rate*e.consumption}))}:{x:e,rate:null,consumption:null,cost:null}}))}else{t=T.a(this.state.useBlocks,(function(e){return e.time.isSameOrAfter(a.state.dateRange[0])&&e.time.isBefore(a.state.dateRange[1].endOf(a.chartView))}));var c=R.b(t,(function(e){return e.time.format("L")}));c=c.map((function(e){return{x:e[0],rate:F.a(e[1],(function(e){return e.rate})),use:Y.a(e[1],(function(e){return e.consumption})),cost:Y.a(e[1],(function(e){return e.consumption>=0?e.consumption*e.rate:null})),count:B.a(e[1],(function(e){return e.consumption}))}}));var l,s=X[this.chartView].avgStringFormat,m=Object(k.a)(e);try{for(m.s();!(l=m.n()).done;){var u=l.value,d=T.a(c,(function(e){return i()(e.x,"L").format(s)===u.x}));"week"===this.chartView&&(u.x="".concat(i()(u.x,s).startOf("week").format("DD"),"-").concat(i()(u.x,s).endOf("week").format("DD MMM YYYY"))),u.rate=F.a(d,(function(e){return e.count>45?e.rate:null})),u.consumption=F.a(d,(function(e){return e.count>45?e.use:null})),u.cost=F.a(d,(function(e){return e.count>45?e.cost:null}))}}catch(h){m.e(h)}finally{m.f()}}return e}},{key:"processActlView",value:function(e){if("hour"===this.chartView){var t=i()(this.state.dateRange[0]),a=i()(this.state.dateRange[1]).set({hour:0,minutes:0,seconds:0}).add(1,"d"),n=i()(t).add(11,"d");(e=T.a(this.state.useBlocks,(function(e){return e.time.isBetween(t,a,"minute","[)")&&e.time.isBefore(n)})).map((function(e){return{x:e.time.format("DD MMM HH:mm"),rate:e.rate,consumption:e.consumption,cost:e.consumption>=0?e.rate*e.consumption:null}}))).reverse()}else{var r=X[this.chartView].actlStringFormat,o=R.b(this.state.useBlocks,(function(e){return e.time.format(r)}));o=o.map((function(e){return{x:e[0],rate:F.a(e[1],(function(e){return e.rate})),use:Y.a(e[1],(function(e){return e.consumption})),cost:Y.a(e[1],(function(e){return e.consumption>=0?e.consumption*e.rate:null}))}}));var c,l=Object(k.a)(e);try{for(l.s();!(c=l.n()).done;){var s=c.value,m=T.a(o,(function(e){return e.x===s.x}));"week"===this.chartView&&(s.x="".concat(i()(s.x,r).startOf("week").format("DD"),"-").concat(i()(s.x,r).endOf("week").format("DD MMM YYYY"))),s.rate=F.a(m,(function(e){return e.rate})),s.consumption=Y.a(m,(function(e){return e.use})),s.cost=Y.a(m,(function(e){return e.cost}))}}catch(u){l.e(u)}finally{l.f()}}return e}},{key:"componentDidMount",value:function(){var e=this;u("GET","consumptionHistory",(function(t,a){if(200===a){var n=t.leccyUse;n=n.map((function(e){return{time:i()(e.interval_start),rate:e.rate,consumption:e.consumption}})),e.setState({useBlocks:n},e.processAnyViewTypeChange);var r=n.map((function(e){return e.time}));e.setState({datesLimit:[i.a.min(r).set({hour:0,minute:0,second:0,millisecond:0}).subtract(1,"d"),i.a.max(r).set({hour:0,minute:0,second:0,millisecond:0}).add(1,"d")]})}else alert("There was an error")}))}},{key:"render",value:function(){if(this.state.dataPlot.length>0){var e="".concat(q[this.chartType].label," Usage ");if(this.state.dateRange[0].format("L")===this.state.dateRange[1].format("L"))e+="on ".concat(this.state.dateRange[0].format("DD MMM YYYY"));else if("actl"===this.chartType&&"hour"===this.chartView){var t=i()(this.state.dataPlot[this.state.dataPlot.length-1].x,X.hour.actlStringFormat).format("DD MMM YYYY");e+="from ".concat(this.state.dateRange[0].format("DD MMM YYYY")," to \n                                ").concat(t)}else e+="from ".concat(this.state.dateRange[0].format("DD MMM YYYY")," to \n                                ").concat(this.state.dateRange[1].format("DD MMM YYYY"))}return this.state.dataPlot.length>0?r.a.createElement("div",null,r.a.createElement("div",{className:"row my-3 mx-4"},r.a.createElement("div",{className:"col-2"},r.a.createElement(j.a,{className:"btn btn-primary btn-arrow-left",id:"prev-date-range",onClick:this.prevNextClicked},"Previous")),r.a.createElement("div",{className:"col-8 text-center",align:"center"},r.a.createElement("h4",{className:"font-weight-bold"},e)),r.a.createElement("div",{className:"col-2",align:"right"},r.a.createElement(j.a,{className:"btn btn-primary btn-arrow-right",id:"next-date-range",onClick:this.prevNextClicked},"Next"))),r.a.createElement("div",{className:"row mb-3"},r.a.createElement(A,{data:this.state.dataPlot,barPlotOptions:G[this.state.chartBarPlot],chartView:this.chartView})),r.a.createElement("div",{className:"row justify-content-center my-3"},r.a.createElement("div",{className:"col-lg-2 col-md-4 my-1",align:"center"},r.a.createElement(P,{btnType:"type",stateVar:this.chartType,onValueChange:this.chartOptionChanged})),r.a.createElement("div",{className:"col-lg-4 col-md-6 my-1",align:"center"},r.a.createElement(P,{btnType:"view",stateVar:this.chartView,onValueChange:this.chartOptionChanged})),r.a.createElement("div",{className:"col-lg-2 col-md-4 my-1",align:"center"},r.a.createElement(P,{btnType:"plot",stateVar:this.state.chartBarPlot,onValueChange:this.chartOptionChanged})),r.a.createElement("div",{className:"col-lg-4 col-md-8 my-1",align:"center"},r.a.createElement(I,{ref:this.dateRangeElement,datesLimit:this.state.datesLimit,dateRange:this.state.dateRange,datesChanged:this.datesChanged}))),r.a.createElement(U,{dataPlots:this.state.dataPlot,chartType:this.chartType,chartView:this.chartView})):r.a.createElement("div",{className:"text-center"},r.a.createElement("div",{className:"spinner-border",role:"status"},r.a.createElement("span",{className:"sr-only"},"Loading...")))}}]),a}(n.Component),G={consumption:{key:"consumption",label:"Consumption",unit:"kWh"},cost:{key:"cost",label:"Cost",unit:"p"},rate:{key:"rate",label:"Rate",unit:"p"},avgCost:{key:"avgCost",label:"Average Unit Cost",unit:"p/kWh"}},q={avg:{label:"Average"},actl:{label:"Actual"}},X={hour:{label:"Hourly",avgStringFormat:"HH:mm",actlStringFormat:"DD MMM HH:mm"},day:{label:"Daily",avgStringFormat:"dddd",actlStringFormat:"YYYY-MM-DD"},week:{label:"Weekly",avgStringFormat:"ww YYYY",actlStringFormat:"ww YYYY"},month:{label:"Monthly",avgStringFormat:"MMMM",actlStringFormat:"MMM YYYY"}},J=a(214),$=a.n(J);function Q(e){var t=Object(n.useState)([]),a=Object(l.a)(t,2),o=a[0],c=a[1],s=Object(n.useState)([]),i=Object(l.a)(s,2),m=i[0],d=i[1],h=Object(n.useState)(20),g=Object(l.a)(h,2),p=g[0],v=g[1],E=function(e){var t=e.target.title,a="hotWater"===t?!o.boost:!m;u("POST","boost/set",b,{boost:t,value:a,duration:p})},b=function(e,t){200===t||201===t?(c(e.hotWater),d(e.heating)):alert("There was an error"),f("boost-states-card-spinner")};return Object(n.useEffect)((function(){u("GET","boost",b)}),[]),r.a.createElement("div",null,r.a.createElement("div",{className:"mx-5"},r.a.createElement($.a,{value:p,onChange:function(e){v(e.target.value)},min:20,max:100,variant:"primary",size:"lg",tooltip:"on",tooltipLabel:function(e){return"".concat(e,"mins")}})),r.a.createElement("div",{className:"row justify-content-center mt-5 mx-3"},r.a.createElement("div",{className:"col-6",align:"center"},r.a.createElement(Z,{value:"hotWater",onClickCallback:E,boostState:o})),r.a.createElement("div",{className:"col-6",align:"center"},r.a.createElement(Z,{value:"heating",onClickCallback:E,boostState:m}))))}function Z(e){var t=e.value,a=e.onClickCallback,o=e.boostState,c=Object(n.useState)(!1),s=Object(l.a)(c,2),m=s[0],u=s[1],d="hotWater"===t?"Hot Water":"Heating",h=i()(o.endTime),f=m?r.a.createElement("h5",{title:t},"Stop",r.a.createElement("br",null),"Boost"):r.a.createElement("h5",{className:"text-center",title:t},"Boosting till ",h.format("HH:mm"),r.a.createElement("br",null),"(","".concat(h.diff(i()(),"m"),"min").concat(h.diff(i()(),"m")>1?"s":""," remaining"),")");return o.boost?r.a.createElement(j.a,{size:"lg",block:!0,variant:"danger",onClick:a,title:t,onMouseEnter:function(e){u(!0)},onMouseLeave:function(e){u(!1)}},r.a.createElement("h5",{className:"font-weight-bold alert-heading text-center pt-1",title:t},d),r.a.createElement("hr",{className:"alert-danger"}),f):r.a.createElement(j.a,{size:"lg",block:!0,onClick:a,title:t},r.a.createElement("h5",{className:"font-weight-bold alert-heading text-center pt-1",title:t},d),r.a.createElement("hr",{className:"alert-primary"}),r.a.createElement("h5",{title:t},"Boost"))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(454),a(455);var ee=document.getElementById("root");ee&&c.a.render(r.a.createElement(K,null),ee);var te=document.getElementById("boilerStateRows");te&&c.a.render(r.a.createElement(h,{limit:0}),te);var ae=document.getElementById("boilerStateCard");ae&&c.a.render(r.a.createElement(h,{limit:5}),ae);var ne=document.getElementById("agileRateTable");ne&&c.a.render(r.a.createElement(p,null),ne);var re=document.getElementById("agile-rates-card");re&&c.a.render(r.a.createElement(v,{type:"homepage"}),re),(re=document.getElementById("agile-rates-page-cards"))&&c.a.render(r.a.createElement(v,{type:"top"}),re);var oe=document.getElementById("nest-card-content");oe&&c.a.render(r.a.createElement(w,null),oe),document.getElementById("current-states-card-body")&&u("GET","currentStates",y,{});var ce=document.getElementById("consumption-page");ce&&c.a.render(r.a.createElement(K,null),ce);var le=document.getElementById("boost-states-card-content");le&&c.a.render(r.a.createElement(Q,null),le),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[240,1,2]]]);
//# sourceMappingURL=main.c4f7ef5f.chunk.js.map