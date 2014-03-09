/**
 * almond 0.2.7 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

/**
 * mangrove-utils version: "0.0.27" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/mangrove-utils for details
 */

var requirejs,require,define;!function(e){function n(e,n){return y.call(e,n)}function r(e,n){var r,o,t,i,s,u,c,a,f,l,p=n&&n.split("/"),d=m.map,g=d&&d["*"]||{};if(e&&"."===e.charAt(0))if(n){for(p=p.slice(0,p.length-1),e=p.concat(e.split("/")),a=0;a<e.length;a+=1)if(l=e[a],"."===l)e.splice(a,1),a-=1;else if(".."===l){if(1===a&&(".."===e[2]||".."===e[0]))break;a>0&&(e.splice(a-1,2),a-=2)}e=e.join("/")}else 0===e.indexOf("./")&&(e=e.substring(2));if((p||g)&&d){for(r=e.split("/"),a=r.length;a>0;a-=1){if(o=r.slice(0,a).join("/"),p)for(f=p.length;f>0;f-=1)if(t=d[p.slice(0,f).join("/")],t&&(t=t[o])){i=t,s=a;break}if(i)break;!u&&g&&g[o]&&(u=g[o],c=a)}!i&&u&&(i=u,s=c),i&&(r.splice(0,s,i),e=r.join("/"))}return e}function o(n,r){return function(){return f.apply(e,b.call(arguments,0).concat([n,r]))}}function t(e){return function(n){return r(n,e)}}function i(e){return function(n){d[e]=n}}function s(r){if(n(g,r)){var o=g[r];delete g[r],h[r]=!0,a.apply(e,o)}if(!n(d,r)&&!n(h,r))throw new Error("No "+r);return d[r]}function u(e){var n,r=e?e.indexOf("!"):-1;return r>-1&&(n=e.substring(0,r),e=e.substring(r+1,e.length)),[n,e]}function c(e){return function(){return m&&m.config&&m.config[e]||{}}}var a,f,l,p,d={},g={},m={},h={},y=Object.prototype.hasOwnProperty,b=[].slice;l=function(e,n){var o,i=u(e),c=i[0];return e=i[1],c&&(c=r(c,n),o=s(c)),c?e=o&&o.normalize?o.normalize(e,t(n)):r(e,n):(e=r(e,n),i=u(e),c=i[0],e=i[1],c&&(o=s(c))),{f:c?c+"!"+e:e,n:e,pr:c,p:o}},p={require:function(e){return o(e)},exports:function(e){var n=d[e];return"undefined"!=typeof n?n:d[e]={}},module:function(e){return{id:e,uri:"",exports:d[e],config:c(e)}}},a=function(r,t,u,c){var a,f,m,y,b,v,w=[],j=typeof u;if(c=c||r,"undefined"===j||"function"===j){for(t=!t.length&&u.length?["require","exports","module"]:t,b=0;b<t.length;b+=1)if(y=l(t[b],c),f=y.f,"require"===f)w[b]=p.require(r);else if("exports"===f)w[b]=p.exports(r),v=!0;else if("module"===f)a=w[b]=p.module(r);else if(n(d,f)||n(g,f)||n(h,f))w[b]=s(f);else{if(!y.p)throw new Error(r+" missing "+f);y.p.load(y.n,o(c,!0),i(f),{}),w[b]=d[f]}m=u?u.apply(d[r],w):void 0,r&&(a&&a.exports!==e&&a.exports!==d[r]?d[r]=a.exports:m===e&&v||(d[r]=m))}else r&&(d[r]=u)},requirejs=require=f=function(n,r,o,t,i){return"string"==typeof n?p[n]?p[n](r):s(l(n,r).f):(n.splice||(m=n,r.splice?(n=r,r=o,o=null):n=e),r=r||function(){},"function"==typeof o&&(o=t,t=i),t?a(e,n,r,o):setTimeout(function(){a(e,n,r,o)},4),f)},f.config=function(e){return m=e,m.deps&&f(m.deps,m.callback),f},requirejs._defined=d,define=function(e,r,o){r.splice||(o=r,r=[]),n(d,e)||n(g,e)||(g[e]=[e,r,o])},define.amd={jQuery:!0}}(),define("bower_components/almond/almond",function(){}),define("mangrove-utils/clone",[],function(){return function(e){var n={};for(var r in e)e.hasOwnProperty(r)&&(n[r]=e[r]);return n}}),define("mangrove-utils/eachKey",[],function(){return function(e,n){for(var r in e)e.hasOwnProperty(r)&&n(r,e[r])}}),define("mangrove-utils/enumerate",[],function(){return Object.keys||function(){var e,n=[],r=r?r.callee?Array.prototype.slice.call(r):r:{};for(e in r)n.hasOwnProperty.call(r,e)&&n.push(e);return n}}),define("mangrove-utils/extend",[],function(){return function(e){e.prototype&&(e=e.prototype);for(var n=1,r=arguments.length;r>n;n++){var o=arguments[n].prototype||arguments[n];for(var t in o)o.hasOwnProperty(t)&&(e[t]=o[t])}return e}}),define("mangrove-utils/isArray",[],function(){return function(e){return"object"==typeof e&&e&&-1!==e.constructor.toString().indexOf("Array")}}),define("mangrove-utils/hardClone",["./isArray"],function(e){return function(n){if("object"!=typeof n)return n;if(e(n)){for(var r=[],o=n.length;o--;){var t=typeof n[o];r[o]="string"===t||"number"===t||"boolean"===t||null===n[o]?n[o]:arguments.callee(n[o])}return r}var i={};for(var o in n)if(o&&n.hasOwnProperty(o)){var t=typeof n[o];i[o]="string"===t||"number"===t||"boolean"===t||null===n[o]?n[o]:arguments.callee(n[o])}return i}}),define("mangrove-utils/is",["./isArray"],function(e){var n=function(){};n.prototype={is:function(e,n){return this["is"+e.capitalize()](n)||!1},isNumber:function(e){return"number"==typeof e},isString:function(e){return"string"==typeof e},isArray:function(n){return e(n)},isValid:function(e){return"undefined"!=typeof e},isFunction:function(e){return"function"==typeof e},isPoint:function(e){return e&&e.isPoint},isPlainObject:function(e){var n=Object.prototype.hasOwnProperty,r=Object.prototype.toString;if(!e||"[object Object]"!==r.call(e)||e.nodeType||e.setInterval)return!1;if(e.constructor&&!n.call(e,"constructor")&&!n.call(e.constructor.prototype,"isPrototypeOf"))return!1;var o;for(o in e);return void 0===o||n.call(e,o)}};var r=new n;return r.is.bind(r)}),define("mangrove-utils/merge",[],function(){return function(e,n){var r={};for(var o in n)n.hasOwnProperty(o)&&(r[o]=n[o]);for(o in e)e.hasOwnProperty(o)&&(r[o]=e[o]);return r}}),define("mangrove-utils/objectify",[],function(){var e=/&amp;|&/g;return function(){for(var n={},r="string"==typeof arguments[0]?arguments[0]:"",o=~r.search(e)?r.split(e):r.length?[r]:[],t=0,i=o.length;i>t;t++)(function(e,n){var e=decodeURIComponent(e.replace(/\+/g,"%20")),r=e.indexOf("="),o=e.split("=",1),t=e.slice(r+1);n[o]=t})(o[t],n);return n}}),define("mangrove-utils/serialize",["./enumerate"],function(e){var n=/%20/g;return function(){for(var r=arguments[0]||{},o=e(r),t=0,i=o.length,s=[];i>t;t++)s.push(encodeURIComponent(o[t])+"="+encodeURIComponent(r[o[t]]));return s.join("&").replace(n,"+")}}),define("mangrove-utils/treeValue",[],function(){return function(e,n){for(var r=e.split("."),o=n,t=0,i=r.length;i>t;t++){var s=r[t].charAt(r[t].length-1);if(")"===s){var u=r[t].substr(0,r[t].indexOf("("));o=o[u]()}else"]"===s?(r[t].substr(0,r[t].indexOf("[")),o=o[u]):o=o[r[t]];if(!o)break}return o||null}}),define("mangrove-utils/bindPolyfill",[],function(){return Function.prototype.bind||(Function.prototype.bind=function(e){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var n=Array.prototype.slice.call(arguments,1),r=this,o=function(){},t=function(){return r.apply(this instanceof o&&e?this:e,n.concat(Array.prototype.slice.call(arguments)))};return o.prototype=this.prototype,t.prototype=new o,t}),Function.prototype.bind}),define("mangrove-utils/cover",[],function(){return function(e,n){var r=n[1]/n[0],o=e[1]/e[0],t=r>=o;return t?[e[0],e[0]*r]:[e[1]/r,e[1]]}}),define("mangrove-utils/mangrove-utils",["./clone","./eachKey","./enumerate","./extend","./hardClone","./is","./isArray","./merge","./objectify","./serialize","./treeValue","./bindPolyfill","./cover"],function(e,n,r,o,t,i,s,u,c,a,f,l,p){return{clone:e,eachKey:n,enumerate:r,extend:o,hardClone:t,is:i,isArray:s,merge:u,objectify:c,serialize:a,treeValue:f,bindPolyfill:l,cover:p}});var EngineDetector=function(){this.isNode=!1,this.isBrowser=!1,this.isUnknown=!1,this._exports,this.detect()};EngineDetector.prototype={detect:function(){"undefined"!=typeof module&&module.exports?this._setAsNode():"undefined"!=typeof window?this._setAsBrowser():this._setAsUnknown()},_setAsNode:function(){this.isNode=!0,this.name="node"},_setAsBrowser:function(){this.isBrowser=!0,this._global=window,this.name="browser"},_setAsUnknown:function(){this.isUnknown=!0,this.name="unknown"},setGlobal:function(e){this._global=e},ifNode:function(e){this.isNode&&e()},ifBrowser:function(e){this.isBrowser&&e()},exports:function(e,n){this.isNode?this._global.exports=n:this.isBrowser&&(this._global[e]=n)}};var engine=new EngineDetector,baseUrl,requirejs;engine.ifNode(function(){baseUrl=__dirname,requirejs=require("requirejs"),engine.setGlobal(module)}),engine.ifBrowser(function(){baseUrl="."}),requirejs.config({baseUrl:function(){return"undefined"==typeof define?__dirname:"."}(),shim:{mocha:{exports:"mocha"}},paths:{"mangrove-utils":".",engineDetector:"bower_components/engineDetector/app",almond:"bower_components/almond/almond",chai:"bower_components/chai/chai","chai-as-promised":"bower_components/chai-as-promised/lib/chai-as-promised",mocha:"bower_components/mocha/mocha","normalize-css":"bower_components/normalize-css/normalize.css",requirejs:"bower_components/requirejs/require",async:"bower_components/requirejs-plugins/src/async",depend:"bower_components/requirejs-plugins/src/depend",font:"bower_components/requirejs-plugins/src/font",goog:"bower_components/requirejs-plugins/src/goog",image:"bower_components/requirejs-plugins/src/image",json:"bower_components/requirejs-plugins/src/json",mdown:"bower_components/requirejs-plugins/src/mdown",noext:"bower_components/requirejs-plugins/src/noext",propertyParser:"bower_components/requirejs-plugins/src/propertyParser","Markdown.Converter":"bower_components/requirejs-plugins/lib/Markdown.Converter",text:"bower_components/requirejs-plugins/lib/text","sinon-chai":"bower_components/sinon-chai/lib/sinon-chai",sinonjs:"bower_components/sinonjs/sinon",ifEngineIsNode:"bower_components/engineDetector/app/ifEngineIsNode",ifEngineIsBrowser:"bower_components/engineDetector/app/ifEngineIsBrowser"}});var isStandalone=!!requirejs._defined,synchronous=isStandalone;if(engine.ifNode(function(){synchronous=!0}),synchronous){var mangroveUtils=requirejs("mangrove-utils/mangrove-utils");engine.exports("mangroveUtils",mangroveUtils)}else requirejs(["mangrove-utils/mangrove-utils"],function(e){engine.exports("mangroveUtils",e)});define("mangrove-utils/main",function(){});