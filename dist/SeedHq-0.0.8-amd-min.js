/**
 * SeedHq version: "0.0.8" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/SeedHq for details
 */

define("SeedHq/helpers",[],function(){return{capitalize:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},remove:function(e,t){for(var n=e.length;n--;)e[n]===t&&e.splice(n,1);return e},clone:function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},extend:function(e){for(var t=1,n=arguments.length;n>t;t++){var o="object"==typeof arguments[t]||"function"==typeof arguments[t]?arguments[t]:{};for(var i in o)o.hasOwnProperty(i)&&(e[i]=o[i])}return e},find:function(e,t){for(var n=0,o=e.length;o>n;n++)if(t(e[n],n))return e[n];return!1}}}),define("SeedHq/extendHooker",["./helpers"],function(e){var t=function(){};return t.prototype={getHooks:function(){},hookify:function(t){var n=t.__hooks=[];t.registerHook=function(e){t.__hooks.push(e)},t.hasHook=function(t){return"s"==typeof t?!!e.find(n,function(e){return e.id===t}):!!e.find(n,function(e){return e===t})},t.unregisterHook=function(t){return e.remove(n,t)}}},new t}),define("SeedHq/extendHooks/plusMinusExtendHook",["../helpers"],function(e){var t=function(t,n){return"undefined"==typeof n?t:"object"==typeof n&&"object"==typeof t?e.extend({},t,n):n},n=function(e,n){return"function"==typeof e||"function"==typeof n?function(){var o="function"==typeof e?e.apply(this,arguments):e,i="function"==typeof n?n.apply(this,arguments):n;return t(o,i)}:t(e,n)};return{name:"plusMinus",handle:function(e,t){var o=e,i=function(){};for(var r in t)if(t.hasOwnProperty(r)){var s=/(^\+|^-)(.*)/g;if(s.test(r)){var c=r.replace(s,"$2"),u=e[c]||i,h=t[r];switch(r.charAt(0)){case"+":o[c]=n(u,h);break;case"-":o[c]=n(h,u)}delete e[r]}else o[r]=t[r]}return o}}}),define("SeedHq/extendHooks/accessors/TypeChecker",[],function(){Array.isArray=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;return function(){return t.apply(e,arguments)}});var e=function(){this.is=this.is.bind(this)};return e.prototype={is:function(e,t){return null!==t&&"undefined"!=typeof t&&"function"==typeof t.isTypeOf?t.isTypeOf(e):this[e]?this[e](t)||!1:typeof t===e.toLowerCase()},Truthy:function(e){return!!e},Falsy:function(e){return!!e},Array:function(e){return Array.isArray(e)},Point:function(e){return e&&e.isPoint},Valid:function(e){return"undefined"!=typeof e},defined:function(e){return"undefined"!=typeof e},PlainObject:function(e){var t=Object.prototype.hasOwnProperty,n=Object.prototype.toString;if(!e||"[object Object]"!==n.call(e)||e.nodeType||e.setInterval)return!1;if(e.constructor&&!t.call(e,"constructor")&&!t.call(e.constructor.prototype,"isPrototypeOf"))return!1;var o;for(o in e);return void 0===o||t.call(e,o)},isStructure:function(e,t){var n;if(!this.is("PlainObject",t))return n="TypeChecker: Object "+t+" is not a plain Object",!1;for(var o in e)if(e.hasOwnProperty(o)){var i=e[o];if(!o in t&&(n="TypeChecker: Key "+o+" is not in "+object),this.is("PlainObject",e[o]))return this.isStructure(e[o],t[o]);this.is(i,t[o])||(n="TypeChecker: Key "+o+" is not in "+object)}if(n)throw new Error(n);return!0},Profile:function(e){return this.isStructure({label:"String",id:"String"},e)},BenchmarkRawData:function(e){return this.isStructure({settings:"PlainObject",data:{W:"PlainObject",M:"PlainObject"}},e)}},e}),define("SeedHq/extendHooks/accessors/defaultTypeChecker",["./TypeChecker"],function(e){var t=new e;return t}),define("SeedHq/extendHooks/accessorsExtendHook",["./accessors/defaultTypeChecker","../helpers"],function(e,t){var n=function(e,t,n,o){this.id="accessors",this.accessorString=t,this.extendObj=n,this.typeChecker=o,this.typeChecker.is=this.typeChecker.is.bind(this.typeChecker),this.oldPrototype=e,this.create()};n.prototype={create:function(){var e,n=this.accessorString.charAt(0),o="-"===n,i="-"===n||"+"===n?this.accessorString.slice(1):this.accessorString,r=i.split("|"),s=r[1],c=r[0],u=t.capitalize(c),h=o?"_":"",a=h+"get"+u,d=h+"set"+u,f=h+c,p=(this.typeChecker,this);t.find(this.getExtendHookConfiguration().allAccessors,function(e){return e})||this.getExtendHookConfiguration().allAccessors.push(c),this.addMethod(a,function(){return this[f]}),s?this.addMethod(d,function(t){if(p.typeChecker.is(s,t))return this[f]=t,t;try{e=JSON.stringify(t)+" is not a "+s}catch(n){}throw new Error(e)}):this.addMethod(d,function(e){return this[f]=e,e})},getOldObj:function(){return this.oldPrototype},getExtendObj:function(){return this.extendObj},getExtendHookConfiguration:function(){return this.getOldObj().__extendHooks[this.id]},addMethod:function(e,t){this.extendObj[e]||(this.oldPrototype[e]=t)}};var o=function(){this.id="accessors",this.handle=this.handle.bind(this),this.typeChecker=e};return o.prototype={configure:function(e){e.typeChecker&&(this.typeChecker=e.typeChecker)},initializeHook:function(e,t){var n=[];t.__extendHooks=e.__extendHooks||{},t.__extendHooks[this.id]={id:this.id,allAccessors:n}},hasHook:function(e){return e&&e.__extendHooks&&e.__extendHooks[this.id]},handle:function(e,t){var o=t.accessors;if(this.hasHook(e)||this.initializeHook(e,t),!o)return e;for(var i=0;i<o.length;i++)new n(e,o[i],t,this.typeChecker);return e}},new o}),define("SeedHq/extendHooks/typeExtendHook",["../helpers"],function(){var e=function(){this.id="type",this.handle=this.handle.bind(this)},t=function(e){this.id="type",this.oldObj=e.oldObj,this.extendObj=e.extendObj,this.hasHook()||this.initializeHook(),this.handleExtendObjType()};return t.prototype={handleExtendObjType:function(){var e=this.getOldObj().getTypes().slice(),t=this.getExtendObj().type;this.getOldObj().types=e,"string"==typeof t&&-1===e.indexOf(t)&&this.getOldObj().types.push(t)},hasHook:function(){return this.getOldObj().__extendHooks&&this.oldObj.__extendHooks[this.id]},getHookConfigurationObject:function(){return this.getOldObj().__extendHooks[this.id]},getTypes:function(){return this.getOldObj().types},initializeHook:function(){this.getOldObj().__extendHooks||(this.getOldObj().__extendHooks={}),this.getOldObj().__extendHooks[this.id]={id:this.id},this.getOldObj().isTypeOf=function(e){return-1!==this.types.indexOf(e)},this.getOldObj().types=[],this.getOldObj().getTypes=function(){return this.types}},getOldObj:function(){return this.oldObj},getExtendObj:function(){return this.extendObj}},e.prototype={configure:function(){},handle:function(e,n){return new t({oldObj:e,extendObj:n}),e}},new e}),define("SeedHq/extendHookRegistrations",["./extendHooks/plusMinusExtendHook","./extendHooks/accessorsExtendHook","./extendHooks/typeExtendHook"],function(e,t,n){return[t,n,e]}),define("SeedHq/Extendable",["./helpers","./extendHooker","./extendHookRegistrations"],function(e,t,n){var o=function(){};o.prototype.constructor=function(){},t.hookify(o);for(var i=0;i<n.length;i++)o.registerHook(n[i]);return o["new"]=function(){},o.extend=function(t){var n=function(){("boolean"!=typeof arguments[0]||arguments[0]!==!1)&&n.prototype.constructor.apply(this,arguments)},i=e.clone(this);for(var r in i)i.hasOwnProperty(r)&&(n[r]=i[r]);for(var s=o.__hooks,c=e.extend(new this(!1),t),r=0;r<s.length;r++)c=s[r].handle(c,t);return n.prototype=c,n},o}),define("SeedHq/Eventable",["./Extendable","./helpers"],function(e,t){return e.extend({constructor:function(){this._events={},this._attached=[]},emit:function(e){var t=this._events[e];if(t)for(var n=Array.prototype.slice.call(arguments,1),o=t.length;o--;)t[o].fn.apply(t[o].subscriber,n)},fire:function(){this.emit.apply(this,arguments)},on:function(e,t,n){var o=e.split(" ");if("function"==typeof t){var i=n;n=t,t=i}if(1===o.length)return this._on(o[0],t,n);for(var r=[],s=0;s<o.length;s++)r[s].push(this._on(evtName,t,n));return{un:function(){for(var e=0;e<r.length;e++)r[e].un()}}},_on:function(e,n,o){if(n&&"function"!=typeof n.attach)throw new Error("The subscriber should have a attach(event) method");if("string"==typeof o?o=n[o]:"undefined"==typeof o&&(o=n["on"+t.capitalize(e)]),"function"!=typeof o)throw new Error("Cannot find the function to subscribe to "+e);var i=this,r={fn:o,subscriber:n},s={un:function(){i._rmSubscription(e,r)}};return(this._events[e]||(this._events[e]=[])).push(r),s},_rmSubscription:function(e,n){t.remove(this._events[e],n),0==this._events[e].length&&delete this._events[e]},attach:function(e){this._attached.push(e)},detachAll:function(){for(var e=0;e<this._attached.length;e++)this._attached[e].un();this._attached=[]}})}),define("SeedHq/SeedHq",["./Eventable","./helpers"],function(e){return e.extend({constructor:function(e){e=e||{},this._events=[],this._attached=[],this._subs=[],this._o=e,e._a&&(this._a=e._a),this.setOptions()},options:{},bindMethod:function(e){this[e]=this[e].bind(this)},setOptions:function(){var e;if(this.options)for(var t in this.options)this.options.hasOwnProperty(t)&&("undefined"==typeof this._o[t]?this[t]=this.options[t]:(e="set"+helpers.capitalize(t),"function"==typeof this[e]?this[e](this._o[t]):this[t]=this._o[t]))},sub:function(e,t){if("function"!=typeof e)throw new Error("C is not a valid constructor");var n=new e(this.subParams(t));return this._subs.push(n),n},subParams:function(e){return e||(e={}),e._parent=this,this._a&&(e._a=this._a),e},destroy:function(){this.detachAll();for(var e=0;e<this._subs.length;e++)this._subs[e].destroy()}})});var EngineDetector=function(){this.isNode=!1,this.isBrowser=!1,this.isUnknown=!1,this._exports,this.detect()};EngineDetector.prototype={detect:function(){"undefined"!=typeof module&&module.exports?this._setAsNode():"undefined"!=typeof window?this._setAsBrowser():this._setAsUnknown()},_setAsNode:function(){this.isNode=!0,this.name="node"},_setAsBrowser:function(){this.isBrowser=!0,this._global=window,this.name="browser"},_setAsUnknown:function(){this.isUnknown=!0,this.name="unknown"},setGlobal:function(e){this._global=e},ifNode:function(e){this.isNode&&e()},ifBrowser:function(e){this.isBrowser&&e()},exports:function(e,t){this.isNode?this._global.exports=t:this.isBrowser&&(this._global[e]=t)}};var engine=new EngineDetector,baseUrl,requirejs;engine.ifNode(function(){baseUrl=__dirname,requirejs=require("requirejs"),engine.setGlobal(module)}),engine.ifBrowser(function(){baseUrl="."}),requirejs.config({baseUrl:function(){return"undefined"==typeof define?__dirname:"."}(),shim:{mocha:{exports:"mocha"}},paths:{SeedHq:".",almond:"bower_components/almond/almond",chai:"bower_components/chai/chai","chai-as-promised":"bower_components/chai-as-promised/lib/chai-as-promised",mocha:"bower_components/mocha/mocha","normalize-css":"bower_components/normalize-css/normalize.css",requirejs:"bower_components/requirejs/require",async:"bower_components/requirejs-plugins/src/async",depend:"bower_components/requirejs-plugins/src/depend",font:"bower_components/requirejs-plugins/src/font",goog:"bower_components/requirejs-plugins/src/goog",image:"bower_components/requirejs-plugins/src/image",json:"bower_components/requirejs-plugins/src/json",mdown:"bower_components/requirejs-plugins/src/mdown",noext:"bower_components/requirejs-plugins/src/noext",propertyParser:"bower_components/requirejs-plugins/src/propertyParser","Markdown.Converter":"bower_components/requirejs-plugins/lib/Markdown.Converter",text:"bower_components/requirejs-plugins/lib/text","sinon-chai":"bower_components/sinon-chai/lib/sinon-chai",sinonjs:"bower_components/sinonjs/sinon"}});var isStandalone=!!requirejs._defined,synchronous=isStandalone;if(engine.ifNode(function(){synchronous=!0}),synchronous){var SeedHq=requirejs("SeedHq/SeedHq");engine.exports("SeedHq",SeedHq)}else requirejs(["SeedHq/SeedHq"],function(e){engine.exports("SeedHq",e)});define("SeedHq/main",function(){});