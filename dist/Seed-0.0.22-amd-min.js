/**
 * SeedHq version: "0.0.22" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/SeedHq for details
 */

define("Seed/helpers",[],function(){return Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;return function(){return t.apply(e,arguments)}}),{capitalize:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},remove:function(e,t){for(var n=e.length;n--;)e[n]===t&&e.splice(n,1);return e},clone:function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},extend:function(e){for(var t=1,n=arguments.length;n>t;t++){var i="object"==typeof arguments[t]||"function"==typeof arguments[t]?arguments[t]:{};for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])}return e},find:function(e,t){for(var n=0,i=e.length;i>n;n++)if(t(e[n],n))return e[n];return!1}}}),define("Seed/Extendable",["./helpers"],function(e){var t=function(){};return t._seedPlugins=[],t.getSeedPlugins=function(){return this._seedPlugins},t.hasSeedPlugin=function(e){for(var t=this.getSeedPlugins(),n=t.length;n--;)if(t[n].getId()===e)return!0;return!1},t.prototype.constructor=function(){},t.use=function(t){var n,i,o,r;return t=t||{},o=t.plugins||[],i=function(){var e=arguments[0]!==!1;this.Class=i,e&&i.prototype.constructor.apply(this,arguments)},n=e.clone(this),e.extend(i,n),i._seedPlugins=o,r=e.extend(new this(!1)),i.prototype=r,i},t.Class=t,t.extend=function(t){var n,i,o,r;i=function(){this.Class=i;var e=arguments[0]!==!1;e&&i.prototype.constructor.apply(this,arguments)},n=e.clone(this),e.extend(i,n),o=e.extend(new this(!1),t),r=this.getSeedPlugins(),i.prototype=o;for(var s=0;s<r.length;s++)r[s].handle({extendedPrototype:this.prototype,Class:i,extension:t});return i},t}),define("Seed/Eventable",["./Extendable","./helpers"],function(e,t){return e.extend({constructor:function(){this._events={},this._attached=[]},emit:function(e){var t=this._events[e];if(t)for(var n=Array.prototype.slice.call(arguments,1),i=t.length;i--;)t[i].fn.apply(t[i].subscriber,n)},fire:function(){this.emit.apply(this,arguments)},on:function(e,t,n){var i=e.split(" ");if("function"==typeof t){var o=n;n=t,t=o}if(1===i.length)return this._on(i[0],t,n);for(var r=[],s=0;s<i.length;s++)r[s].push(this._on(evtName,t,n));return{un:function(){for(var e=0;e<r.length;e++)r[e].un()}}},_on:function(e,n,i){if(n&&"function"!=typeof n.attach)throw new Error("The subscriber should have a attach(event) method");if("string"==typeof i?i=n[i]:"undefined"==typeof i&&(i=n["on"+t.capitalize(e)]),"function"!=typeof i)throw new Error("Cannot find the function to subscribe to "+e);var o=this,r={fn:i,subscriber:n},s={un:function(){o._rmSubscription(e,r)}};return(this._events[e]||(this._events[e]=[])).push(r),s},_rmSubscription:function(e,n){t.remove(this._events[e],n),0==this._events[e].length&&delete this._events[e]},attach:function(e){this._attached.push(e)},detachAll:function(){for(var e=0;e<this._attached.length;e++)this._attached[e].un();this._attached=[]}})}),define("mangrove-utils/extend",[],function(){return function(e){e.prototype&&(e=e.prototype);for(var t=1,n=arguments.length;n>t;t++){var i=arguments[t].prototype||arguments[t];for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])}return e}}),define("Seed/plugins/AbstractExtendHook",["Seed/Extendable","mangrove-utils/extend"],function(e,t){return e.extend({constructor:function(e){this.pluginId=e.pluginId,this.Class=e.Class,this.newPrototype=this.getNewPrototype(),this.extendedPrototype=e.extendedPrototype,this.extension=e.extension,this.confKey="seedPlugin",this.pluginInitialized()||this.initializePlugin()},extendNewPrototype:function(e){t(this.getNewPrototype(),e)},pluginInitialized:function(){return this.getNewPrototypeAttr(this.confKey)?this.getNewPrototypeAttr(this.confKey)[this.pluginId]?!0:!1:!1},initializePlugin:function(){this.getNewPrototypeAttr(this.confKey)||this.setNewPrototypeAttr(this.confKey,{}),this.getNewPrototypeAttr(this.confKey)[this.pluginId]||(this.getNewPrototypeAttr(this.confKey)[this.pluginId]={})},defineNewPrototypeMethod:function(e,t){this.setNewPrototypeAttr(e,t)},getPluginConfig:function(){return this.getNewPrototype()[this.confKey][this.pluginId]},getPluginConfigAttr:function(e){return this.getPluginConfig()[e]},setPluginConfigAttr:function(e,t){this.getPluginConfig()[e]=t},getNewPrototype:function(){return this.getClass().prototype},setNewPrototypeAttr:function(e,t){return this.getNewPrototype()[e]=t},getNewPrototypeAttr:function(e){return this.getNewPrototype()[e]},getExtensionAttr:function(e){return this.getExtension()[e]},setExtensionAttr:function(e,t){return this.getExtension()[e]=t},getExtension:function(){return this.extension},getNewPrototype:function(){return this.Class.prototype},getExtendedPrototypeAttr:function(e){return this.extendedPrototype[e]},getExtendedPrototype:function(){return this.extendedPrototype},getClass:function(){return this.Class}})}),define("Seed/plugins/AbstractSeedPlugin",["Seed/Extendable","./AbstractExtendHook"],function(e,t){return e.extend({constructor:function(){this.ExtendHook=this.ExtendHook||t},getId:function(){return this.id},handle:function(e){this.buildExtendHook(e)},buildExtendHook:function(e){e.pluginId=this.id;var t=this.ExtendHook;new t(e)}})}),define("Seed/plugins/plusMinusSeedPlugin/PlusMinusExtendHook",["Seed/Extendable","Seed/plugins/AbstractExtendHook","Seed/helpers"],function(e,t,n){var i=function(e,t){return"undefined"==typeof t?e:"object"==typeof t&&"object"==typeof e?n.extend({},e,t):t},o=function(e,t){return"function"==typeof e||"function"==typeof t?function(){var n="function"==typeof e?e.apply(this,arguments):e,o="function"==typeof t?t.apply(this,arguments):t;return i(n,o)}:i(e,t)},r=t.extend({constructor:function(){t.prototype.constructor.apply(this,arguments),this.merge()},merge:function(){var e=this.getNewPrototype(),t=e,n=this.getExtension(),i=function(){};for(var r in n)if(n.hasOwnProperty(r)){var s=/(^\+|^-)(.*)/g;if(s.test(r)){var u=r.replace(s,"$2"),c=t[u]||i,a=n[r];switch(r.charAt(0)){case"+":e[u]=o(c,a);break;case"-":e[u]=o(a,c)}delete t[r]}else e[r]=n[r]}},initializePlugin:function(){t.prototype.initializePlugin.call(this,arguments)}});return r}),define("Seed/plugins/plusMinusSeedPlugin/plusMinusSeedPlugin",["Seed/plugins/AbstractSeedPlugin","./PlusMinusExtendHook"],function(e,t){var n=e.extend({constructor:function(){this.id="plusminus",this.ExtendHook=t,e.prototype.constructor.apply(this,arguments)},handle:function(){e.prototype.handle.apply(this,arguments)}});return new n}),define("Seed/plugins/typeSeedPlugin/TypeExtendHook",["Seed/Extendable","Seed/plugins/AbstractExtendHook"],function(e,t){return t.extend({constructor:function(){t.prototype.constructor.apply(this,arguments),this.handleType()},handleType:function(){this.addExtensionType()},addExtensionType:function(){var e,t=this.getExtensionAttr("type"),n=this.getNewPrototypeAttr("types");t&&(e=n.slice(),e.push(t),this.setNewPrototypeAttr("types",e))},initializePlugin:function(){t.prototype.initializePlugin.call(this,arguments),this.extendNewPrototype({types:[],getTypes:function(){return this.types},isA:function(e){return-1!==this.types.indexOf(e)},isAn:function(e){return-1!==this.types.indexOf(e)},isTypeOf:function(e){return-1!==this.types.indexOf(e)}})}})}),define("Seed/plugins/typeSeedPlugin/TypeSeedPlugin",["Seed/plugins/AbstractSeedPlugin","./TypeExtendHook"],function(e,t){return e.extend({constructor:function(){this.id="type",this.ExtendHook=t,e.prototype.constructor.apply(this,arguments)},handle:function(){e.prototype.handle.apply(this,arguments)}})}),define("Seed/plugins/typeSeedPlugin/typeSeedPlugin",["./TypeSeedPlugin"],function(e){return new e}),define("Seed/plugins/accessorsSeedPlugin/AccessorsExtendHook",["Seed/Extendable","Seed/plugins/AbstractExtendHook","Seed/helpers"],function(e,t,n){var i=t.extend({constructor:function(e){this.typeChecker=e.typeChecker,t.prototype.constructor.apply(this,arguments),this.handleAccessors()},handleAccessors:function(){var e=this.getExtensionAttr("accessors");if(e)for(var t=0;t<e.length;t++)this.handleAccessor(e[t])},handleAccessor:function(e){var t=e.charAt(0),i="-"===t,o="-"===t||"+"===t?e.slice(1):e,r=o.split("|"),s=r[1],u=r[0],c=n.capitalize(u),a=i?"_":"",p=a+"get"+c,d=a+"set"+c,h=a+u;this.typeChecker,this.defineGetter({key:h,methodName:p}),s?this.defineTypedSetter({key:h,methodName:d,type:s}):this.defineUntypedSetter({key:h,methodName:d})},defineTypedSetter:function(e){if(!this.getExtensionAttr(e.methodName)){var t=this.typeChecker,n=e.type,i=e.methodName,o=e.key;this.defineNewPrototypeMethod(i,function(e){var i;if(t.is(n,e))return this[o]=e,e;i="AccessorsSeedPlugin -> Validation failed: ";try{i+=JSON.stringify(e)}catch(r){i+=e}throw i+=" is not a "+n,new Error(i)})}},defineGetter:function(e){this.getExtensionAttr(e.methodName)||this.defineNewPrototypeMethod(e.methodName,function(){return this[e.key]})},defineUntypedSetter:function(e){this.getExtensionAttr(e.methodName)||this.defineNewPrototypeMethod(e.methodName,function(t){return this[e.key]=t})},initializePlugin:function(){t.prototype.initializePlugin.call(this,arguments)}});return i}),define("Seed/plugins/accessorsSeedPlugin/TypeChecker",["Seed/Extendable"],function(e){var t=e.extend({constructor:function(){this.is=this.is.bind(this)},is:function(e,t){return null!==t&&"undefined"!=typeof t&&"function"==typeof t.isA?t.isA(e):this[e]?this[e](t)||!1:typeof t===e.toLowerCase()},Truthy:function(e){return!!e},Falsy:function(e){return!!e},Array:function(e){return Array.isArray(e)},Point:function(e){return e&&e.isPoint},Valid:function(e){return"undefined"!=typeof e},defined:function(e){return"undefined"!=typeof e},PlainObject:function(e){var t=Object.prototype.hasOwnProperty,n=Object.prototype.toString;if(!e||"[object Object]"!==n.call(e)||e.nodeType||e.setInterval)return!1;if(e.constructor&&!t.call(e,"constructor")&&!t.call(e.constructor.prototype,"isPrototypeOf"))return!1;var i;for(i in e);return void 0===i||t.call(e,i)},isStructure:function(e,t){var n;if(!this.is("PlainObject",t))return n="TypeChecker: Object "+t+" is not a plain Object",!1;for(var i in e)if(e.hasOwnProperty(i)){var o=e[i];if(!i in t&&(n="TypeChecker: Key "+i+" is not in "+object),this.is("PlainObject",e[i]))return this.isStructure(e[i],t[i]);this.is(o,t[i])||(n="TypeChecker: Key "+i+" is not in "+t)}if(n)throw new Error(n);return!0},Profile:function(e){return this.isStructure({label:"String",id:"String"},e)},BenchmarkRawData:function(e){return this.isStructure({settings:"PlainObject",data:{W:"PlainObject",M:"PlainObject"}},e)}});return Array.isArray=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;return function(){return t.apply(e,arguments)}}),t}),define("Seed/plugins/accessorsSeedPlugin/defaultTypeChecker",["./TypeChecker"],function(e){var t=new e;return t}),define("Seed/plugins/accessorsSeedPlugin/accessorsSeedPlugin",["Seed/plugins/AbstractSeedPlugin","./AccessorsExtendHook","./defaultTypeChecker"],function(e,t,n){var i=e.extend({constructor:function(){this.typeChecker=n,this.id="accessors",this.ExtendHook=t,e.prototype.constructor.apply(this,arguments)},handle:function(t){t.typeChecker=this.typeChecker,e.prototype.handle.apply(this,arguments)}});return new i}),define("Seed/plugins/defaultPlugins",["./plusMinusSeedPlugin/plusMinusSeedPlugin","./typeSeedPlugin/typeSeedPlugin","./accessorsSeedPlugin/accessorsSeedPlugin"],function(e,t,n){return[e,t,n]}),define("Seed/Seed",["./Eventable","./helpers","./plugins/defaultPlugins"],function(e,t,n){return console.log("yep"),e.use({plugins:n}).extend({constructor:function(e){e=e||{},this._events=[],this._attached=[],this._subs=[],this._o=e,this.setOptions()},options:{},bindMethod:function(e){this[e]=this[e].bind(this)},setOptions:function(){var e;if(this.options)for(var n in this.options)this.options.hasOwnProperty(n)&&("undefined"==typeof this._o[n]?this[n]=this.options[n]:(e="set"+t.capitalize(n),"function"==typeof this[e]?this[e](this._o[n]):this[n]=this._o[n]))},sub:function(e,t){if("function"!=typeof e)throw new Error("C is not a valid constructor");var n=new e(t);return this._subs.push(n),n},destroy:function(){this.detachAll();for(var e=0;e<this._subs.length;e++)this._subs[e].destroy()}})});var EngineDetector=function(){this.isNode=!1,this.isBrowser=!1,this.isUnknown=!1,this._exports,this.detect()};EngineDetector.prototype={detect:function(){"undefined"!=typeof module&&module.exports?this._setAsNode():"undefined"!=typeof window?this._setAsBrowser():this._setAsUnknown()},_setAsNode:function(){this.isNode=!0,this.name="node"},_setAsBrowser:function(){this.isBrowser=!0,this._global=window,this.name="browser"},_setAsUnknown:function(){this.isUnknown=!0,this.name="unknown"},setGlobal:function(e){this._global=e},ifNode:function(e){this.isNode&&e()},ifBrowser:function(e){this.isBrowser&&e()},exports:function(e,t){this.isNode?this._global.exports=t:this.isBrowser&&(this._global[e]=t)}};var engine=new EngineDetector,baseUrl,requirejs;engine.ifNode(function(){baseUrl=__dirname,requirejs=require("requirejs"),engine.setGlobal(module)}),engine.ifBrowser(function(){baseUrl="."}),requirejs.config({baseUrl:function(){return"undefined"==typeof define?__dirname:"."}(),shim:{mocha:{exports:"mocha"}},paths:{Seed:".",test:"../test",almond:"bower_components/almond/almond",chai:"bower_components/chai/chai","chai-as-promised":"bower_components/chai-as-promised/lib/chai-as-promised",mocha:"bower_components/mocha/mocha","normalize-css":"bower_components/normalize-css/normalize.css",requirejs:"bower_components/requirejs/require",async:"bower_components/requirejs-plugins/src/async",depend:"bower_components/requirejs-plugins/src/depend",font:"bower_components/requirejs-plugins/src/font",goog:"bower_components/requirejs-plugins/src/goog",image:"bower_components/requirejs-plugins/src/image",json:"bower_components/requirejs-plugins/src/json",mdown:"bower_components/requirejs-plugins/src/mdown",noext:"bower_components/requirejs-plugins/src/noext",propertyParser:"bower_components/requirejs-plugins/src/propertyParser","Markdown.Converter":"bower_components/requirejs-plugins/lib/Markdown.Converter",text:"bower_components/requirejs-plugins/lib/text","sinon-chai":"bower_components/sinon-chai/lib/sinon-chai",sinonjs:"bower_components/sinonjs/sinon",backbone:"bower_components/backbone/backbone","mangrove-utils":"bower_components/mangrove-utils/app"}});var isStandalone=!!requirejs._defined,synchronous=isStandalone;if(engine.ifNode(function(){synchronous=!0}),synchronous){var SeedHq=requirejs("Seed/Seed");engine.exports("Seed",SeedHq)}else requirejs(["Seed/Seed"],function(e){engine.exports("Seed",e)});define("Seed/main",function(){});