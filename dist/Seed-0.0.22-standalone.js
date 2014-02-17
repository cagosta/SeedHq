(function () {
/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
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
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

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
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
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
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

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
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

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
        return req(cfg);
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

define( 'Seed/helpers',[],function() {


    // dirty, todo
    Function.prototype.bind || ( Function.prototype.bind = function( scope ) {

        var self = this
        return ( function() {

            return ( self.apply( scope, arguments ) )
        } )
    } )

    return {

        capitalize: function( s ) {

            return ( s.charAt( 0 ).toUpperCase() + s.slice( 1 ) )

        },

        remove: function( a, v ) {

            for ( var i = a.length; i--; ) {
                if ( a[ i ] === v ) a.splice( i, 1 )
            }
            return a

        },

        clone: function( o ) { // clones an object 

            var res = {};
            for ( var i in o )
                if ( o.hasOwnProperty( i ) ) res[ i ] = o[ i ]
            return res

        },

        extend: function( o ) {

            for ( var i = 1, n = arguments.length; i < n; i++ ) {
                var e = typeof( arguments[ i ] ) === 'object' || typeof( arguments[ i ] ) === 'function' ? arguments[ i ] : {}
                for ( var j in e )
                    if ( e.hasOwnProperty( j ) ) {
                        o[ j ] = e[ j ]
                    }
            }
            return o

        },

        find: function( a, f ) {

            for ( var i = 0, n = a.length; i < n; i++ ) {
                if ( f( a[ i ], i ) ) return a[ i ]
            }
            return false
        }

    }

} );
define( 'Seed/Extendable',[
    './helpers'
], function( _ ) {


    /**
     * This is the basic extendable element,
     *
     * @export Seed/Extendable
     *
     */

    var Extendable = function() {

    }

    Extendable._seedPlugins = []

    Extendable.getSeedPlugins = function() {

        return this._seedPlugins

    }

    Extendable.hasSeedPlugin = function( id ) {

        var plugins = this.getSeedPlugins()

        for ( var i = plugins.length; i--; ) {

            if ( plugins[ i ].getId() === id )
                return true
        }

        return false

    }


    /**
     * Initialize an object
     *
     * @this {Extendable}
     * @param {Object} configuration Object
     */

    Extendable.prototype.constructor = function() {}


    Extendable.use = function( useOptions ) {

        var attrs, Class, extension = {}, plugins, proto;

        useOptions = useOptions || {}

        plugins = useOptions.plugins ||  []

        Class = function() {

            var instanciation = arguments[ 0 ] !== false

            this.Class = Class

            if ( instanciation ) {

                Class.prototype.constructor.apply( this, arguments )
            }

        }

        attrs = _.clone( this )
        _.extend( Class, attrs )

        Class._seedPlugins = plugins

        proto = _.extend( ( new this( false ) ) )

        Class.prototype = proto

        return Class

    }


    Extendable.Class = Extendable

    Extendable.extend = function( extension ) {

        var attrs, Class, proto, plugins;

        Class = function() {

            this.Class = Class

            var instanciation = arguments[ 0 ] !== false

            if ( instanciation ) {

                Class.prototype.constructor.apply( this, arguments )
            }


        }


        attrs = _.clone( this )
        _.extend( Class, attrs )


        proto = _.extend( new this( false ), extension )


        plugins = this.getSeedPlugins()

        Class.prototype = proto;


        for ( var i = 0; i < plugins.length; i++ )
            plugins[ i ].handle( {
                extendedPrototype: this.prototype,
                Class: Class,
                extension: extension
            } )



        return Class

    }

    return Extendable

} );
define( 'Seed/Eventable',[
    './Extendable',
    './helpers'
], function( Extendable, _ ) {

    /**
     * For publishing events
     * @export Seed/Eventable
     */

    return Extendable.extend( {

        constructor: function() {

            this._events = {}
            this._attached = []

        },

        /**
         * Publisher method, emit an event
         *
         * @public
         * @param {string} eventName
         * @param {..} [arguments] the arguments to pass through the event pipe
         *
         */

        emit: function( eventName ) {

            var evs = this._events[ eventName ]
            if ( evs ) {
                var args = Array.prototype.slice.call( arguments, 1 )

                // last subscribe is the first to be called
                for ( var i = evs.length; i--; ) {
                    //TODO profiling to this line 
                    evs[ i ].fn.apply( evs[ i ].subscriber, args )
                    //evs[i](args[0], args[1], args[2], args[3])
                }
            }

        },

        // emit alias, for retro compatibility
        fire: function() {

            this.emit.apply( this, arguments )

        },

        /**
    * Publisher method, Subscribe to an event
    *
    * Note : it's important to provide an subscriber object to detach the event when the subscriber is destroyed, else you may have issues to destroy events
    *
    * @public
    * @param {String} eventName '*' means 'all', subsribe multi events with 'evt1 evt2 ...'
    * @param {Object|Function} subscriber if Object, the subscriber instance else the function to attach
    * @param {String|Function|Object} [functionPointer='subscriber.'on'+eventName'] if the subscriber is an object, a string pointes to subscriber method, a function would be executed in the subscriber scope
    * @returns {Object} subscription 
    *
    * @example 
    // call subscriber.onStart when publisher emit 'start'
    var sub = publisher.on('start', subscriber) 

    sub.un() // stops the subscription

    // call subscriber.onStart when publisher emit 'start' and subscriber.onEnd when publisher emit 'end'
    publisher.on('start end', subscriber)

    // call subscriber.onPublisherStart when publisher emit 'start'
    publisher.on('start', subscriber, 'onPublisherStart') 

    // call fn in the subscriber scope
    publisher.on('start', subscriber, fn) 

    // call fn in the subscriber scope (equivalent to previous), use for more compatibility with classic use
    publisher.on('start', fn, subscriber)

    // call fn when publisher emit start, use with caution when you'll never want to detach event at any destroy
    publisher.on('start', fn) 

    */

        on: function( eventName, subscriber, fn ) {

            var evts = eventName.split( ' ' )

            // multimorph API handling
            if ( typeof( subscriber ) === 'function' ) {
                var oldFn = fn
                fn = subscriber
                subscriber = oldFn
            }

            // multi events handling
            if ( evts.length === 1 ) {
                return this._on( evts[ 0 ], subscriber, fn )
            } else {

                var ons = []
                for ( var i = 0; i < evts.length; i++ ) {
                    ons[ i ].push( this._on( evtName, subscriber, fn ) )
                }

                return {
                    un: function() {

                        for ( var i = 0; i < ons.length; i++ ) {
                            ons[ i ].un()
                        }
                    }
                }
            }

        },

        /**
         * @private
         */

        _on: function( eventName, subscriber, f ) {

            // subscriber format validation
            if ( subscriber && typeof( subscriber.attach ) !== 'function' ) {
                throw new Error( 'The subscriber should have a attach(event) method' )
                return
            }

            // fn multimorphism handling
            if ( typeof( f ) === 'string' ) {
                f = subscriber[ f ]
            } else if ( typeof( f ) === 'undefined' ) {
                f = subscriber[ 'on' + _.capitalize( eventName ) ]
            }

            if ( typeof( f ) !== 'function' ) {
                throw new Error( 'Cannot find the function to subscribe to ' + eventName )
                return
            }

            var _this = this,
                subObj = {
                    fn: f,
                    subscriber: subscriber
                },
                ret = {
                    un: function() {

                        _this._rmSubscription( eventName, subObj )
                    }
                };

            // subscriber.attach( ret )


            ( this._events[ eventName ] || ( this._events[ eventName ] = [] ) ).push( subObj )

            return ret

        },

        /**
         * Publisher method, Remove a Subscription, private, use subscription.un()
         *
         * @private
         * @param {string} eventName
         * @param {object} subscription object
         *
         */

        _rmSubscription: function( eventName, subObj ) {

            _.remove( this._events[ eventName ], subObj )
            if ( this._events[ eventName ].length == 0 ) {
                delete this._events[ eventName ]
            }

        },

        /**
         *  Subscriber method
         *  Attach a subscription to this
         *  @param {object} subscription
         */

        attach: function( subscription ) {

            this._attached.push( subscription )

        },

        /**
         *  Subscriber method
         *  Detach all subscription
         */

        detachAll: function() {

            for ( var i = 0; i < this._attached.length; i++ ) {
                this._attached[ i ].un()
            }
            this._attached = []
        }
    } )

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
define( 'Seed/plugins/AbstractExtendHook',[
	'Seed/Extendable',
	'mangrove-utils/extend'
], function( Extendable, extend ) {


	/**
	 *
	 * @constructor
	 *
	 */

	return Extendable.extend( {

		constructor: function( o ) {

			this.pluginId = o.pluginId

			this.Class = o.Class
			this.newPrototype = this.getNewPrototype()


			this.extendedPrototype = o.extendedPrototype


			this.extension = o.extension
			this.confKey = 'seedPlugin'


			if ( !this.pluginInitialized() )
				this.initializePlugin()


		},

		extendNewPrototype: function( o ) {

			extend( this.getNewPrototype(), o )

		},


		pluginInitialized: function() {

			if ( !this.getNewPrototypeAttr( this.confKey ) )
				return false

			if ( !this.getNewPrototypeAttr( this.confKey )[  this.pluginId ] )
				return false

			return true
		},

		initializePlugin: function() {

			if ( !this.getNewPrototypeAttr( this.confKey ) ) {
				this.setNewPrototypeAttr( this.confKey, {} )
			}

			if ( !this.getNewPrototypeAttr( this.confKey )[  this.pluginId ] )
				this.getNewPrototypeAttr( this.confKey )[  this.pluginId ] = {}

		},

		defineNewPrototypeMethod: function( methodName, f ) {

			this.setNewPrototypeAttr( methodName, f )

		},

		getPluginConfig: function() {

			return this.getNewPrototype()[ this.confKey ][  this.pluginId ]

		},

		getPluginConfigAttr: function( key ) {

			return this.getPluginConfig()[ key ]

		},

		setPluginConfigAttr: function( key, value ) {

			this.getPluginConfig()[ key ] = value

		},

		getNewPrototype: function() {

			return this.getClass().prototype

		},


		setNewPrototypeAttr: function( key, value ) {

			return this.getNewPrototype()[ key ] = value

		},

		getNewPrototypeAttr: function( key ) {

			return this.getNewPrototype()[ key ]

		},

		getExtensionAttr: function( key ) {

			return this.getExtension()[ key ]

		},

		setExtensionAttr: function( key, value ) {

			return this.getExtension()[ key ] = value

		},


		getExtension: function() {

			return this.extension

		},

		getNewPrototype: function() {

			return this.Class.prototype

		},

		getExtendedPrototypeAttr: function( key ) {

			return this.extendedPrototype[  key ]

		},

		getExtendedPrototype: function() {

			return this.extendedPrototype

		},

		getClass: function() {

			return this.Class

		}

	} )



} );
define( 'Seed/plugins/AbstractSeedPlugin',[
    'Seed/Extendable',
    './AbstractExtendHook'
], function( Seed, AbstractExtendHook ) {


    /**
     *
     * @constructor
     *
     */

    return Seed.extend( {

        constructor: function() {

            this.ExtendHook = this.ExtendHook || AbstractExtendHook

        },

        getId: function() {

            return this.id

        },

        handle: function( o ) {

            this.buildExtendHook( o )

        },

        buildExtendHook: function( o ) {

            o.pluginId = this.id

            var ExtendHook = this.ExtendHook

            new ExtendHook( o )

        }

    } )

} );
define( 'Seed/plugins/plusMinusSeedPlugin/PlusMinusExtendHook',[
    'Seed/Extendable',
    'Seed/plugins/AbstractExtendHook',
    'Seed/helpers'
], function( Extendable, AbstractExtendHook, _ ) {


    /**
     *
     * @constructor PlusMinusExtendHook
     *
     * TODO clean this shit
     * From old code
     * See related tests in test/app/
     *
     */


    /**
     * Mix two params, to get the better mix
     *
     * @private
     * @param {String|Array|Object|Number} before
     * @param {String|Array|Object|Number} after
     * @returns an extended object if before and after are objects
     */

    var extendReturn = function( before, after ) {

        if ( typeof( after ) === 'undefined' ) {
            return before
        }

        if ( typeof( after ) === 'object' && typeof( before ) === 'object' ) {
            return _.extend( {}, before, after )
        }

        return after
    }



    /**
     * Two Fns executed in once
     *
     * @private
     * @param {Object|Function} before a function or object that is executed before
     * @param  {Object|Function} after a function or object that is executed before
     * @returns {Object|Function} a function that calls before and then after
     */

    var mergeFns = function( before, after ) {

        if ( typeof( before ) === 'function' || typeof( after ) === 'function' ) {
            return function() {
                var beforeR = ( typeof( before ) === 'function' ?
                    before.apply( this, arguments ) :
                    before
                ),
                    afterR = ( typeof( after ) === 'function' ?
                        after.apply( this, arguments ) :
                        after
                    )

                    return extendReturn( beforeR, afterR )
            }
        } else {
            return extendReturn( before, after )
        }

    }


    var PlusMinusExtendHook = AbstractExtendHook.extend( {

        constructor: function() {

            AbstractExtendHook.prototype.constructor.apply( this, arguments )

            this.merge()

        },

        merge: function() {
            // var resObj =  {},


            var resObj = this.getNewPrototype(),
                oldObj = resObj,
                extendObj = this.getExtension(),
                nullFn = function() {}

            for ( var i in extendObj )
                if ( extendObj.hasOwnProperty( i ) ) {
                    var reg = /(^\+|^-)(.*)/g

                    if ( reg.test( i ) ) { // merge fns
                        var key = i.replace( reg, '$2' ),
                            old = oldObj[ key ] || nullFn,
                            extFn = extendObj[ i ]

                        switch ( i.charAt( 0 ) ) {
                            case '+':
                                resObj[ key ] = mergeFns( old, extFn )
                                break
                            case '-':
                                resObj[ key ] = mergeFns( extFn, old )
                                break
                        }

                        delete oldObj[ i ]

                    } else { // merge object
                        resObj[ i ] = extendObj[ i ]
                    }
                }

        },

        initializePlugin: function() {

            AbstractExtendHook.prototype.initializePlugin.call( this, arguments )

        }

    } )

    return PlusMinusExtendHook

} );
define( 'Seed/plugins/plusMinusSeedPlugin/plusMinusSeedPlugin',[
    'Seed/plugins/AbstractSeedPlugin',
    './PlusMinusExtendHook'
], function( AbstractSeedPlugin, PlusMinusExtendHook ) {


    /**
     *
     * @constructor
     *
     */


    var PlusMinusSeedPlugin = AbstractSeedPlugin.extend( {

        constructor: function() {

            this.id = 'plusminus'
            this.ExtendHook = PlusMinusExtendHook

            AbstractSeedPlugin.prototype.constructor.apply( this, arguments )

        },

        handle: function( o ) {

            AbstractSeedPlugin.prototype.handle.apply( this, arguments )

        }

    } )


    return new PlusMinusSeedPlugin

} );
define( 'Seed/plugins/typeSeedPlugin/TypeExtendHook',[
    'Seed/Extendable',
    'Seed/plugins/AbstractExtendHook'
], function( Extendable, AbstractExtendHook ) {


    /**
     *
     * @constructor
     *
     */


    return AbstractExtendHook.extend( {

        constructor: function() {

            AbstractExtendHook.prototype.constructor.apply( this, arguments )

            this.handleType()

        },

        handleType: function() {

            this.addExtensionType()

        },

        addExtensionType: function() {

            var extensionType = this.getExtensionAttr( 'type' ),
                types = this.getNewPrototypeAttr( 'types' ),
                currentTypes;

            if ( !extensionType )
                return


            currentTypes = types.slice()
            currentTypes.push( extensionType )

            this.setNewPrototypeAttr( 'types', currentTypes )

        },

        initializePlugin: function() {

            AbstractExtendHook.prototype.initializePlugin.call( this, arguments )

            this.extendNewPrototype( {

                types: [],

                getTypes: function() {
                    return this.types
                },

                isA: function( type ) {

                    return this.types.indexOf( type ) !== -1

                },

                isAn: function( type ) {

                    return this.types.indexOf( type ) !== -1

                },

                isTypeOf: function( type ) { // retro compatibility

                    return this.types.indexOf( type ) !== -1

                }

            } )

        }

    } )

} );
define( 'Seed/plugins/typeSeedPlugin/TypeSeedPlugin',[
    'Seed/plugins/AbstractSeedPlugin',
    './TypeExtendHook'
], function( AbstractSeedPlugin, TypeExtendHook ) {


    /**
     *
     * @constructor
     *
     */


    return AbstractSeedPlugin.extend( {

        constructor: function() {

            this.id = 'type'
            this.ExtendHook = TypeExtendHook

            AbstractSeedPlugin.prototype.constructor.apply( this, arguments )

        },

        handle: function( o ) {

            AbstractSeedPlugin.prototype.handle.apply( this, arguments )

        }

    } )

} );
define( 'Seed/plugins/typeSeedPlugin/typeSeedPlugin',[
    './TypeSeedPlugin'
], function( TypeSeedPlugin ) {

    return new TypeSeedPlugin

} );
define( 'Seed/plugins/accessorsSeedPlugin/AccessorsExtendHook',[
    'Seed/Extendable',
    'Seed/plugins/AbstractExtendHook',
    'Seed/helpers'
], function( Extendable, AbstractExtendHook, _ ) {


    var AccessorsExtendHook = AbstractExtendHook.extend( {

        constructor: function( o ) {

            this.typeChecker = o.typeChecker
            AbstractExtendHook.prototype.constructor.apply( this, arguments )

            this.handleAccessors()

        },

        handleAccessors: function() {

            var accessors = this.getExtensionAttr( 'accessors' )

            if ( !accessors )
                return

            for ( var i = 0; i < accessors.length; i++ ) {
                this.handleAccessor( accessors[ i ] )
            }

        },

        handleAccessor: function( rawAccessor ) {


            // dirty, to clean this shit

            var firstChar = rawAccessor.charAt( 0 ),
                isPrivate = ( firstChar === '-' ),
                isPublic = !isPrivate,
                accessor = ( firstChar === '-' ||  firstChar === '+' ) ? rawAccessor.slice( 1 ) :  rawAccessor, // remove + and - 
                accessorSplit = accessor.split( '|' ),
                type = accessorSplit[ 1 ],
                name = accessorSplit[ 0 ],
                capitalizedName = _.capitalize( name ),
                prefix = ( isPrivate ? '_' : '' ),
                getterName = prefix + 'get' + capitalizedName,
                setterName = prefix + 'set' + capitalizedName,
                accessorKey = prefix + name,
                typeChecker = this.typeChecker,
                self = this


                this.defineGetter( {
                    key: accessorKey,
                    methodName: getterName
                } )

                if ( type ) {

                    this.defineTypedSetter( {
                        key: accessorKey,
                        methodName: setterName,
                        type: type
                    } )

                } else {

                    this.defineUntypedSetter( {
                        key: accessorKey,
                        methodName: setterName
                    } )

                }


        },

        defineTypedSetter: function( o ) {

            if ( this.getExtensionAttr( o.methodName ) ) // Handle case extension define the getter
                return

            var typeChecker = this.typeChecker,
                type = o.type,
                methodName = o.methodName,
                key = o.key;

            this.defineNewPrototypeMethod( methodName, function( v ) {

                var error

                if ( typeChecker.is( type, v ) ) { // Validation pass !
                    this[ key ] = v
                    return v
                }

                // Validation not ok, not sure what to do here ..
                error = 'AccessorsSeedPlugin -> Validation failed: '

                try { // Try to stringify value sent, for pretty error purpose
                    error += JSON.stringify( v )
                } catch ( e ) { // if failed, add object
                    error += v
                }
                error += ' is not a ' + type

                throw new Error( error )

            } )

        },

        defineGetter: function( o ) {

            if ( this.getExtensionAttr( o.methodName ) ) // handle case extension already define the getter
                return

            this.defineNewPrototypeMethod( o.methodName, function() {

                return this[ o.key ]

            } )

        },

        defineUntypedSetter: function( o ) {

            if ( this.getExtensionAttr( o.methodName ) ) // handle case extension already define the getter
                return

            this.defineNewPrototypeMethod( o.methodName, function( v ) {

                return this[ o.key ] = v

            } )

        },

        initializePlugin: function() {

            AbstractExtendHook.prototype.initializePlugin.call( this, arguments )

        }

    } )

    return AccessorsExtendHook

} );
define( 'Seed/plugins/accessorsSeedPlugin/TypeChecker',[
    'Seed/Extendable'
], function( Extendable ) {


    var TypeChecker = Extendable.extend( {

        constructor: function() {

            this.is = this.is.bind( this )
        },

        is: function( type, arg ) {

            if ( arg !== null && typeof arg !== 'undefined' && typeof arg.isA === 'function' )
                return arg.isA( type )

            if ( this[ type ] ) // check if this type is defined here
                return this[ type ]( arg ) || false

            return typeof arg === type.toLowerCase()

        },

        Truthy: function( arg ) {

            return !!arg

        },

        Falsy: function( arg ) {

            return !!arg

        },

        Array: function( a ) {

            return Array.isArray( a )

        },

        Point: function( f ) {

            return f && f.isPoint

        },

        Valid: function( t ) {

            return typeof t !== 'undefined'

        },

        defined: function( o ) {

            return typeof o !== 'undefined'

        },

        //From jQuery
        PlainObject: function( obj ) {

            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                toString = Object.prototype.toString
            if ( !obj || toString.call( obj ) !== '[object Object]' || obj.nodeType || obj.setInterval ) {
                return false
            }

            // Not own constructor property must be Object
            if ( obj.constructor && !hasOwnProperty.call( obj, 'constructor' ) && !hasOwnProperty.call( obj.constructor.prototype, 'isPrototypeOf' ) ) {
                return false
            }
            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key
            for ( key in obj ) {}

            return key === undefined || hasOwnProperty.call( obj, key )

        },

        isStructure: function( structure, obj ) {

            var error
            if ( !this.is( 'PlainObject', obj ) ) {
                error = 'TypeChecker: Object ' + obj + ' is not a plain Object'
                return false
            }
            for ( var key in structure )
                if ( structure.hasOwnProperty( key ) ) {
                    var type = structure[  key ]
                    if ( !key in obj )
                        error = 'TypeChecker: Key ' + key + ' is not in ' + object

                    if ( this.is( 'PlainObject', structure[ key ] ) ) // if value is a plain objet, reccursive check
                        return this.isStructure( structure[ key ], obj[ key ] )
                    if ( !this.is( type, obj[ key ] ) )
                        error = 'TypeChecker: Key ' + key + ' is not in ' + obj

                }
            if ( error ) {
                throw new Error( error )
                return false
            }
            return true

        },

        Profile: function( p ) {

            return this.isStructure( {
                label: 'String',
                id: 'String'
            }, p )

        },

        BenchmarkRawData: function( d ) {

            return this.isStructure( {
                settings: 'PlainObject',
                data: {
                    W: 'PlainObject',
                    M: 'PlainObject'
                }
            }, d )
        }



    } )


    Array.isArray = Array.isArray || function( o ) {

            return Object.prototype.toString.call( o ) == "[object Array]"
        }

    Function.prototype.bind || ( Function.prototype.bind = function( scope ) {

        var self = this
        return ( function() {

            return ( self.apply( scope, arguments ) )
        } )
    } )



    return TypeChecker

} );
define( 'Seed/plugins/accessorsSeedPlugin/defaultTypeChecker',[
    './TypeChecker'
], function( TypeChecker ) {


    var typeChecker = ( new TypeChecker )

    return typeChecker

} );
define( 'Seed/plugins/accessorsSeedPlugin/accessorsSeedPlugin',[
    'Seed/plugins/AbstractSeedPlugin',
    './AccessorsExtendHook',
    './defaultTypeChecker'
], function( AbstractSeedPlugin, AccessorsExtendHook, defaultTypeChecker ) {


    /**
     *
     * @constructor
     *
     */


    var AccessorsSeedPlugin = AbstractSeedPlugin.extend( {

        constructor: function() {

            this.typeChecker = defaultTypeChecker // add typeChecker
            this.id = 'accessors'
            this.ExtendHook = AccessorsExtendHook

            AbstractSeedPlugin.prototype.constructor.apply( this, arguments )


        },

        handle: function( o ) {

            o.typeChecker = this.typeChecker
            AbstractSeedPlugin.prototype.handle.apply( this, arguments )

        }

    } )


    return new AccessorsSeedPlugin

} );
define( 'Seed/plugins/defaultPlugins',[
    './plusMinusSeedPlugin/plusMinusSeedPlugin',
    './typeSeedPlugin/typeSeedPlugin',
    './accessorsSeedPlugin/accessorsSeedPlugin'
], function( plusMinusSeedPlugin, typeSeedPlugin, accessorsSeedPlugin ) {

    return [ plusMinusSeedPlugin, typeSeedPlugin, accessorsSeedPlugin ]

} );
/**
 * SeedHq version: "0.0.22" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/SeedHq for details
 */


define( 'Seed/Seed',[
    './Eventable',
    './helpers', // remove me 
    './plugins/defaultPlugins'
 ], function( Eventable, helpers, defaultPlugins ) {


    console.log( 'yep' )
    /**
     * @class Seed
     * @param {object} o configuration object
     * @example
     *
     */

    return Eventable.use( {
        plugins: defaultPlugins
    } ).extend( {

        /**
         * init instance attributes
         *
         * @param {object} o configuration object
         */
        constructor: function( o ) {

            ( o = o ||  {} )

            //publisher init
            this._events = []

            //subscriber init
            this._attached = []

            this._subs = []

            this._o = o


            this.setOptions()

        },

        /**
         * no options by default
         */

        options: {},

        /**
         * keys declared in options are set as attribute in the instance
         */
        bindMethod: function( methodName ) {

            this[ methodName ] = this[ methodName ].bind( this )

        },

        setOptions: function() {

            var setter
            if ( this.options ) {
                for ( var i in this.options )
                    if ( this.options.hasOwnProperty( i ) ) {
                        if ( typeof( this._o[ i ] ) === 'undefined' ) this[ i ] = this.options[ i ]
                        else {
                            setter = 'set' + helpers.capitalize( i )
                            if ( typeof this[ setter ] === 'function' ) { // accessors extend hook todo
                                this[ setter ]( this._o[ i ] )
                            } else {
                                this[ i ] = this._o[ i ]
                            }
                        }
                    }
            }

        },

        /**
         * Build a sub instance, that will be destroyed with this
         * @params {function} C Constructor of the sub instance
         * @params {object} o configuration options of the sub instance
         * @returns {object} c instance built
         */

        sub: function( C, o ) {

            if ( typeof( C ) !== 'function' ) {
                throw new Error( 'C is not a valid constructor' )
            }
            var c = new C( o )
            this._subs.push( c )
            return c

        },



        /**
         * Destroy the objects, his events and his sub objects
         */

        destroy: function() {

            this.detachAll()
            for ( var i = 0; i < this._subs.length; i++ ) {
                this._subs[ i ].destroy()
            }
        }

    } )

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
        Seed: '.',
        test: '../test',
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
        backbone: 'bower_components/backbone/backbone',
        'mangrove-utils': 'bower_components/mangrove-utils/app'
    }
} )


var isStandalone = !! requirejs._defined,
    synchronous = isStandalone

    engine.ifNode( function() {

        synchronous = true

    } )

    if ( synchronous ) { // case standalone

        var SeedHq = requirejs( 'Seed/Seed' )

        engine.exports( 'Seed', SeedHq )


    } else {

        requirejs( [ 'Seed/Seed' ], function( SeedHq ) {
            engine.exports( 'Seed', SeedHq )
        } )

    };
define("Seed/main", function(){});
}());