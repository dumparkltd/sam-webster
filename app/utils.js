/**
  * Copyright (c) Mozilla Foundation http://www.mozilla.org/
  * This code is available under the terms of the MIT License
  */

function waitFor(r,o){r?o():setTimeout(function(){waitFor(o)},250)}!function(){for(var r,o=function(){},t=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],e=t.length,i=window.console=window.console||{};e--;)r=t[e],i[r]||(i[r]=o)}(),Array.prototype.filter||(Array.prototype.filter=function(r){var o=this.length>>>0;if("function"!=typeof r)throw new TypeError;for(var t=[],e=arguments[1],i=0;o>i;i++)if(i in this){var n=this[i];r.call(e,n,i,this)&&t.push(n)}return t});