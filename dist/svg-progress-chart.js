!function(t){function e(s){if(o[s])return o[s].exports;var i=o[s]={exports:{},id:s,loaded:!1};return t[s].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var o={};return e.m=t,e.c=o,e.p="",e(0)}([function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s,i=o(3);!function(t){new i.SVGProgressChart("SVGChart",{width:800,height:100,time:450,data:[{type:"positive",width:10},{type:"neutral",width:10},{type:"negative",width:20},{type:"positive",width:5}]})}(s||(s={}))},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Colors={positive:"#1abc9c",negative:"#e74c3c",neutral:"rgba(0,0,0,0)","default":"#2C3E50"},e.TrimSpacesRegEx=/(  +)|(?:\r\n|\r|\n|\r\s)/g},function(t,e,o){"use strict";var s=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])};return function(e,o){function s(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(s.prototype=o.prototype,new s)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=o(1);e.SVGSchemaURI="http://www.w3.org/2000/svg";var n=function(){function t(t,e,o,s,i){this.height=t,this.width=e,this.x=o,this.y=s,i&&(this.color=i),this.classList=[]}return t.prototype.addClass=function(t){"classList"in this._el?this._el.classList.add(t):this._el.className.baseVal=this._el.className.baseVal+" "+t},t.prototype.removeClass=function(t){"classList"in this._el?this._el.classList.remove(t):this._el.className.baseVal=this._el.className.baseVal.replace(this.classReg(t)," ")},t.prototype.hasClass=function(t){for(var e=" "+t+" ",o=0,s=this._el.length;s>o;o++)if(1===this._el[o].nodeType&&(" "+this._el[o].className+" ").replace(/[\t\r\n]/g," ").indexOf(e)>=0)return!0;return!1},t.prototype.classReg=function(t){return new RegExp("(^|\\s+)"+t+"(\\s+|$)")},t}();e.Shape=n;var r=function(t){function o(e,o,s,i,n){var r=t.call(this,e,o,s,i,n)||this;return r._el=r.createElement(),r.update(),r}return s(o,t),o.prototype.createElement=function(){return document.createElementNS(e.SVGSchemaURI,"rect")},o.prototype.update=function(){var t=this._el;t&&(t.setAttribute("width",this.width.toString()+"%"),t.setAttribute("height",this.height.toString()),t.setAttribute("x",this.x.toString()+"%"),t.setAttribute("y",this.y.toString()),t.setAttribute("class","transition"),this.color&&t.setAttribute("style","fill:"+this.color),this.classList.forEach(function(e){t.classList.contains(e)||t.classList.add(e)}))},o.prototype.remove=function(){this._el&&(this._el.remove?this._el.remove():this._el.parentNode.removeChild(this._el),delete this._el)},o.prototype.moveTo=function(t){t=Math.min(t,100),this._el.setAttribute("transform","scale("+t+",1)"),this._el.style.transform="scale3d("+t+",1,1)",this._el.style.webkitTransform="scale3d("+t+",1,1)",this._el.style["-ms-transform"]="scale3d("+t+",1,1)",this.value=t},o.prototype.show=function(){this.addClass("show")},o.prototype.hide=function(){this.removeClass("hide")},o}(n);e.Rect=r;var h=function(t){function o(e,o,s,i,n,r,h){var a=t.call(this,e,o,s,i,r)||this;return a.text=n||"00:00:00",a.components={text:null},a._el=a.createElement(),a}return s(o,t),o.prototype.createElement=function(){var t=document.createElementNS(e.SVGSchemaURI,"path");t.setAttribute("d",("M"+this.x+" "+this.y+"\n                                L"+(this.width+this.x)+" "+this.y+"\n                                L"+(this.width+this.x)+" "+(this.height+this.y)+"\n                                L"+(this.x+this.width/2+7)+" "+(this.height+this.y)+"\n                                L"+(this.x+this.width/2)+" "+(this.height+this.y+7)+"\n                                L"+(this.x+this.width/2-7)+" "+(this.height+this.y)+"\n                                L"+this.x+" "+(this.height+this.y)).replace(i.TrimSpacesRegEx," "));var o=document.createElementNS(e.SVGSchemaURI,"text");o.textContent=this.text,o.setAttribute("x",""+(this.x+this.width/2-23)),o.setAttribute("y",""+(this.y+this.height/2+5)),o.setAttribute("fill","rgba(0,0,0,.6)"),this.components.text=o;var s=document.createElementNS(e.SVGSchemaURI,"g");return this.color&&s.setAttribute("fill",""+this.color),s.setAttribute("class","transition tooltip"),s.appendChild(t),s.appendChild(o),s},o.prototype.toTimeText=function(t){var e=t,o=Math.floor(e/3600),s=Math.floor((e-3600*o)/60),i=e-3600*o-60*s;return i=parseInt(i,10),10>o&&(o="0"+o),10>s&&(s="0"+s),10>i&&(i="0"+i),o+":"+s+":"+i},o.prototype.show=function(){this.hasClass("show")||this.addClass("show")},o.prototype.hide=function(){this.removeClass("show")},o.prototype.moveTo=function(t,e){this._el.setAttribute("transform","translate("+t+" 0)"),this._el.style.transform="translate3d("+t+"px,0,0)",this._el.style.webkitTransform="translate3d("+t+"px,0,0)",this.components.text.textContent=this.toTimeText(e)},o.prototype.setColor=function(t){this._el.setAttribute("fill",t)},o.prototype.update=function(){},o}(n);e.Tooltip=h},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=o(1),i=o(2),n=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}(),r=function(){function t(t,e){if(this.options={height:500,width:500,data:[],time:0,tooltipHeight:30,barHeight:5,top:50},this.id=t,this.rootElement=document.getElementById(t),!t||!this.rootElement)throw"Root SVG Element is missing";e&&(this.options.height=e.height,this.options.width=e.width||this.rootElement.parentElement.clientWidth,this.options.data=e.data,this.options.time=e.time,this.options.barHeight=e.barHeight||this.options.barHeight,this.options.tooltipHeight=e.tooltipHeight||30,this.options.top=20+this.options.tooltipHeight),this.rootElement.setAttribute("height",this.options.height.toString()),this.rootElement.setAttribute("width","100%"),this.components={progressBar:{bar:null,buffer:null,overlay:null,progress:null,tooltip:null},events:[]},this.init()}return t.prototype.addClass=function(t){"classList"in this.rootElement?this.rootElement.classList.add(t):this.rootElement.className=this.rootElement.className+" "+t},t.prototype.setBuffer=function(t){t=Math.min(t,this.options.time);var e,o=this;t&&(e=Math.min(t/o.options.time*100,o.options.time),n(function(){o.components.progressBar.buffer.moveTo(e)}))},t.prototype.onSetProgress=function(t){var e=this;t&&this.components.progressBar.overlay._el.addEventListener("click",function(o){var s=o.offsetX/e.options.width,i=Math.round(s*e.options.time);t(i)})},t.prototype.setProgress=function(t){t=Math.min(t,this.options.time);var e,o=this;"undefined"!=typeof t&&(e=Math.min(t/o.options.time*100,o.options.time),n(function(){o.components.progressBar.progress.moveTo(e)}))},t.prototype.setPreBuffer=function(t){t=Math.min(t,this.options.time);var e=t/this.options.time,o=e*this.options.width-this.components.progressBar.tooltip.width/2;o=Math.max(Math.min(o,this.options.width-this.components.progressBar.tooltip.width),0),this.components.progressBar.tooltip.show(),this.components.progressBar.buffer.show(),this.setBuffer(t),this.components.progressBar.tooltip.moveTo(o,t)},t.prototype.setData=function(t){var e=this;t.length<this.components.events.length&&this.components.events.forEach(function(e,o){o>=t.length&&e.remove()}),t.forEach(function(t,o){if(t.x||(t.x=o?e.options.data[o-1].x+e.options.data[o-1].width:0),e.components.events&&e.components.events[o]&&e.components.events[o]._el)e.components.events[o].x=t.x,e.components.events[o].width=t.width,e.components.events[o].type=t.type||"default",e.components.events[o].color=s.Colors[t.type||"default"],e.components.events[o].update();else{var n=new i.Rect(2*e.options.barHeight,t.width,t.x,20+e.options.tooltipHeight-.5*e.options.barHeight);n.type=t.type,n.addClass(t.type||"default"),e.components.events.push(n),e.components.progressBar.overlay?e.components.progressBar.overlay._el.parentNode.insertBefore(n._el,e.components.progressBar.overlay._el):e.rootElement.appendChild(n._el)}})},t.prototype.init=function(){var t=this,e=new i.Rect(this.options.barHeight,100,0,this.options.top);e.addClass("bar"),this.rootElement.appendChild(e._el),this.components.progressBar.bar=e;var o=new i.Rect(this.options.barHeight,1,0,this.options.top);o.addClass("progress"),o.moveTo(0);var s=new i.Rect(this.options.barHeight,1,0,this.options.top);this.rootElement.appendChild(s._el),this.components.progressBar.buffer=s,s.addClass("buffer"),s.moveTo(0),this.rootElement.appendChild(o._el),this.components.progressBar.progress=o,console.log(this),this.options.data&&this.setData(this.options.data);var r=new i.Rect(3*this.options.barHeight,100,0,20+this.options.tooltipHeight-this.options.barHeight,"rgba(255,255,255,0)");r.addClass("overlay"),this.components.progressBar.overlay=r,this.rootElement.appendChild(r._el);var h=new i.Tooltip(this.options.tooltipHeight,2.2*this.options.tooltipHeight,0,0,"00:00:00");this.components.progressBar.tooltip=h,this.rootElement.appendChild(h._el),r._el.addEventListener("click",function(e){var s=e.offsetX/t.options.width*100;n(function(){o.moveTo(s)})}),r._el.addEventListener("mouseleave",function(t){n(function(){h.hide(),s.hide()})});var a,p,l=!1;r._el.addEventListener("mousemove",function(e){var o=e.offsetX/t.options.width*t.options.width-h.width/2,s=e.offsetX/t.options.width*t.options.time;o=Math.max(Math.min(o,t.options.width-h.width),0),clearTimeout(a),a=setTimeout(function(){l=!1,t.components.events.forEach(function(o){o._el&&e.offsetX>=o.x*t.options.width/100&&e.offsetX<(o.x+o.width)/100*t.options.width&&"neutral"!==o.type&&(l=!0,o.type!==p&&n(function(){h.removeClass(p),p=o.type,h.addClass(o.type)}))}),l||(h.removeClass(p),p="neutral")},10),n(function(){t.setPreBuffer(s)})}),this.addClass("show")},t}();e.SVGProgressChart=r,window.SVGProgressChart=r||{}}]);