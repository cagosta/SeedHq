(function () {
/**
 * almond 0.2.7 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("bower_components/almond/almond", function(){});

define( 'mangrove-utils/clone',[],function() {

    return function( o ) { // clones an object (only lvl 1, see hardClone)
        var res = {};
        for ( var i in o )
            if ( o.hasOwnProperty( i ) ) res[ i ] = o[ i ];
        return res;
    };

} );
define( 'mangrove-utils/eachKey',[],function() {

    return function( o, f ) {
        for ( var i in o )
            if ( o.hasOwnProperty( i ) ) {
                f( i, o[ i ] );
            }
    };

} );
define( 'mangrove-utils/enumerate',[], function() {

    return Object.keys || function() {
        var k, arr = [],
            o = !! o ? ( !! o.callee ? Array.prototype.slice.call( o ) : o ) : {}

        for ( k in o )
            if ( arr.hasOwnProperty.call( o, k ) )
                arr.push( k )

        return arr
    }
    
} );
define( 'mangrove-utils/extend',[],function() {

    return function( o ) {
        if ( o.prototype ) o = o.prototype;
        for ( var i = 1, n = arguments.length; i < n; i++ ) {
            var e = arguments[ i ].prototype || arguments[ i ];
            for ( var j in e )
                if ( e.hasOwnProperty( j ) ) {
                    o[ j ] = e[ j ];
                }
        }
        return o;
    };

} );
define( 'mangrove-utils/isArray',[],function() {

    return function( o ) {
        return ( typeof( o ) === 'object' && o && o.constructor.toString().indexOf( 'Array' ) !== -1 );
    }

} );
define( 'mangrove-utils/hardClone',[ './isArray' ], function( isArray ) {

    return function( obj ) { // USE WITH CAUTION : clones recursively an object
        if ( typeof( obj ) !== 'object' ) return obj;
        if ( !isArray( obj ) ) {
            var o = {};
            for ( var i in obj ) {
                if ( i && obj.hasOwnProperty( i ) ) {
                    var t = typeof( obj[ i ] );
                    if ( t === 'string' || t === 'number' || t === 'boolean' || obj[ i ] === null )
                        o[ i ] = obj[ i ];
                    else // array or obj
                        o[ i ] = arguments.callee( obj[ i ] );
                }
            }
            return o;
        } else {
            var a = [];
            for ( var i = obj.length; i--; ) {
                var t = typeof( obj[ i ] );
                if ( t === 'string' || t === 'number' || t === 'boolean' || obj[ i ] === null )
                    a[ i ] = obj[ i ];
                else // array or obj
                    a[ i ] = arguments.callee( obj[ i ] );
            }
            return a;
        }
    }

} );
define( 'mangrove-utils/is',[
  './isArray',
 ], function( isArray ) {

    var Is = function() {};

    Is.prototype = {

        is: function( type, arg ) {
            return this[ 'is' + type.capitalize() ]( arg ) || false;
        },

        isNumber: function( i ) {
            return typeof i === 'number';
        },

        isString: function( i ) {
            return typeof i === 'string';
        },

        isArray: function( i ) {
            return isArray( i );
        },

        isValid: function( i ) {
            return typeof i !== 'undefined';
        },

        isFunction: function( f ) {
            return typeof f === 'function';
        },

        isPoint: function( f ) {
            return f && f.isPoint;
        },


        isPlainObject: function( obj ) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                toString = Object.prototype.toString;
            if ( !obj || toString.call( obj ) !== '[object Object]' || obj.nodeType || obj.setInterval ) {
                return false;
            }

            // Not own constructor property must be Object
            if ( obj.constructor && !hasOwnProperty.call( obj, 'constructor' ) && !hasOwnProperty.call( obj.constructor.prototype, 'isPrototypeOf' ) ) {
                return false;
            }
            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for ( key in obj ) {}

            return key === undefined || hasOwnProperty.call( obj, key );
        }

    };

    var is = new Is();
    return is.is.bind( is );

} );
define( 'mangrove-utils/merge',[],function() {

    return function( o, b ) {
        var j = {};
        for ( var i in b )
            if ( b.hasOwnProperty( i ) ) j[ i ] = b[ i ];
        for ( i in o )
            if ( o.hasOwnProperty( i ) ) j[ i ] = o[ i ];
        return j;
    }

} );
define( 'mangrove-utils/objectify',[], function() {
    var ramp = /&amp;|&/g

    return function() {
        var o = {}, str = typeof arguments[ 0 ] == "string" ? arguments[ 0 ] : "",
            pairs = !! ~str.search( ramp ) ? str.split( ramp ) : str.length ? [ str ] : [],
            i = 0,
            l = pairs.length

        for ( ; i < l; i++ )
            ( function( pair, o ) {
                var pair = decodeURIComponent( pair.replace( /\+/g, "%20" ) ),
                    idx = pair.indexOf( "=" ),
                    key = pair.split( "=", 1 ),
                    value = pair.slice( idx + 1 )

                    o[ key ] = value
            }( pairs[ i ], o ) )

        return o
    }
} );
define( 'mangrove-utils/serialize',[
    './enumerate'
], function( enumerate ) {

    var rspaces = /%20/g

    return function() {
        var o = arguments[ 0 ] || {}, keys = enumerate( o ),
            i = 0,
            l = keys.length,
            str = []

        for ( ; i < l; i++ )
            str.push( encodeURIComponent( keys[ i ] ) + '=' + encodeURIComponent( o[ keys[ i ] ] ) )

        return str.join( '&' ).replace( rspaces, '+' )
    }
    
} );
define( 'mangrove-utils/treeValue',[],function() {

    return function( string, scope ) {
        var tree = string.split( '.' ),
            value = scope;
        for ( var i = 0, n = tree.length; i < n; i++ ) {
            var lastChar = tree[ i ].charAt( tree[ i ].length - 1 );
            if ( lastChar === ')' ) {
                var fnName = tree[ i ].substr( 0, tree[ i ].indexOf( '(' ) );
                value = value[ fnName ]();
            } else if ( lastChar === ']' ) {
                var valueName = tree[ i ].substr( 0, tree[ i ].indexOf( '[' ) );
                value = value[ fnName ];
            } else {
                value = value[ tree[ i ] ];
            }
            if ( !value ) break;
        }
        return value || null;
    };

} );
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility


define( 'mangrove-utils/bindPolyfill',[],function() {

    if ( !Function.prototype.bind ) {
        Function.prototype.bind = function( oThis ) {
            if ( typeof this !== "function" ) {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError( "Function.prototype.bind - what is trying to be bound is not callable" );
            }

            var aArgs = Array.prototype.slice.call( arguments, 1 ),
                fToBind = this,
                fNOP = function() {},
                fBound = function() {
                    return fToBind.apply( this instanceof fNOP && oThis ? this : oThis,
                        aArgs.concat( Array.prototype.slice.call( arguments ) ) );
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    return Function.prototype.bind

} );
define( 'mangrove-utils/cover',[],function() {

    return function( parent, son ) {

        var sonRatio = son[ 1 ] / son[ 0 ],
            parentRatio = parent[ 1 ] / parent[ 0 ],
            fitWidth = ( sonRatio >= parentRatio ),
            r,
            nwidth,
            nheight;

        if ( fitWidth )
            return [  parent[ 0 ], parent[ 0 ] * son[ 1 ] / son[ 0 ] ]
        else
            return [ parent[ 1 ] * son[ 0 ] / son[ 1 ] , parent[ 1 ] ]

    }

} );
/**
 * mangrove-utils version: "0.0.24" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/mangrove-utils for details
 */

define( 'mangrove-utils/mangrove-utils',[
    './clone',
    './eachKey',
    './enumerate',
    './extend',
    './hardClone',
    './is',
    './isArray',
    './merge',
    './objectify',
    './serialize',
    './treeValue',
    './bindPolyfill',
    './cover'
 ], function( clone, eachKey, enumerate, extend, hardClone, is, isArray, merge, objectify, serialize, treeValue, bindPolyfill, cover ) {


    return {
        clone: clone,
        eachKey: eachKey,
        enumerate: enumerate,
        extend: extend,
        hardClone: hardClone,
        is: is,
        isArray: isArray,
        merge: merge,
        objectify: objectify,
        serialize: serialize,
        treeValue: treeValue,
        bindPolyfill: bindPolyfill,
        cover: cover
    }
} );
var EngineDetector = function() {
    this.isNode = false
    this.isBrowser = false
    this.isUnknown = false
    this._exports
    this.detect()
}

EngineDetector.prototype = {

    detect: function() {
        if ( typeof module !== 'undefined' && module.exports )
            this._setAsNode()
        else if ( typeof window !== "undefined" )
            this._setAsBrowser()
        else
            this._setAsUnknown()
    },

    _setAsNode: function() {
        this.isNode = true
        this.name = 'node'
    },

    _setAsBrowser: function() {
        this.isBrowser = true
        this._global = window
        this.name = 'browser'
    },

    _setAsUnknown: function() {
        this.isUnknown = true
        this.name = 'unknown'
    },

    setGlobal: function( e ) {
        this._global = e
    },

    ifNode: function( f ) {
        if ( this.isNode )
            f()
    },

    ifBrowser: function( f ) {
        if ( this.isBrowser )
            f()
    },


    exports: function( key, exported ) {
        if ( this.isNode ) {
            this._global.exports = exported
        } else if ( this.isBrowser )
            this._global[  key ] = exported
    },

}

var engine = new EngineDetector()


var baseUrl, requirejs;

engine.ifNode( function() {

    baseUrl = __dirname
    requirejs = require( 'requirejs' )
    engine.setGlobal( module )

} )

engine.ifBrowser( function() {
    baseUrl = '.'
} )


requirejs.config( {
    baseUrl: function(){ return ( typeof define === 'undefined') ? __dirname: '.'}(),
    shim: {
        mocha: {
            exports: 'mocha'
        }
    },
    paths: {
        'mangrove-utils': '.',
        engineDetector: 'bower_components/engineDetector/app',
        almond: 'bower_components/almond/almond',
        chai: 'bower_components/chai/chai',
        'chai-as-promised': 'bower_components/chai-as-promised/lib/chai-as-promised',
        mocha: 'bower_components/mocha/mocha',
        'normalize-css': 'bower_components/normalize-css/normalize.css',
        requirejs: 'bower_components/requirejs/require',
        async: 'bower_components/requirejs-plugins/src/async',
        depend: 'bower_components/requirejs-plugins/src/depend',
        font: 'bower_components/requirejs-plugins/src/font',
        goog: 'bower_components/requirejs-plugins/src/goog',
        image: 'bower_components/requirejs-plugins/src/image',
        json: 'bower_components/requirejs-plugins/src/json',
        mdown: 'bower_components/requirejs-plugins/src/mdown',
        noext: 'bower_components/requirejs-plugins/src/noext',
        propertyParser: 'bower_components/requirejs-plugins/src/propertyParser',
        'Markdown.Converter': 'bower_components/requirejs-plugins/lib/Markdown.Converter',
        text: 'bower_components/requirejs-plugins/lib/text',
        'sinon-chai': 'bower_components/sinon-chai/lib/sinon-chai',
        sinonjs: 'bower_components/sinonjs/sinon',
        ifEngineIsNode: 'bower_components/engineDetector/app/ifEngineIsNode',
        ifEngineIsBrowser: 'bower_components/engineDetector/app/ifEngineIsBrowser'
    }
} )


var isStandalone = !! requirejs._defined,
    synchronous = isStandalone

engine.ifNode(function(){

    synchronous = true

})

if ( synchronous ) { // case standalone

    var mangroveUtils = requirejs( 'mangrove-utils/mangrove-utils' )

    engine.exports( 'mangroveUtils', mangroveUtils )


} else {

    requirejs( [ 'mangrove-utils/mangrove-utils' ], function( mangroveUtils ) {
        engine.exports( 'mangroveUtils', mangroveUtils )
    } )

}
;
define("mangrove-utils/main", function(){});
}());