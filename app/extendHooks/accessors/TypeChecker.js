define(function(  ) {

    Array.isArray = Array.isArray || function( o ) {
        return Object.prototype.toString.call( o ) == "[object Array]"
    }

    Function.prototype.bind || ( Function.prototype.bind = function( scope ) {
        var self = this;
        return ( function( ) {
            return ( self.apply( scope, arguments ) );
        } );
    } )

    var TypeChecker = function( ) {
        this.is = this.is.bind( this )
    }

    TypeChecker.prototype = {

        is: function( type, arg ) {
            if ( arg !== null && typeof arg !== 'undefined' && typeof arg.isTypeOf === 'function' )
                return arg.isTypeOf( type )
            if ( this[ type ] ) // check if this type is defined here
                return this[ type ]( arg ) || false;
            return typeof arg === type.toLowerCase( )
        },

        Truthy: function( arg ) {
            return !! arg
        },

        Falsy: function( arg ) {
            return !! arg
        },


        Array: function( a ){
            return Array.isArray( a )
        },

        Point: function( f ) {
            return f && f.isPoint
        },

        Valid: function( t ) {
            return typeof t !== 'undefined'
        },

        defined: function( o ){
            return typeof o !== 'undefined'
        },

        //From jQuery
        PlainObject: function( obj ) {
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
        },

        isStructure: function( structure, obj ){
            var error 
            if ( ! this.is( 'PlainObject', obj )  ){
                error = 'TypeChecker: Object ' + obj + ' is not a plain Object'
                return false
            }
            for ( var key in structure ) if ( structure.hasOwnProperty( key ) ){
                var type = structure[ key ]
                if ( ! key in obj )
                    error = 'TypeChecker: Key ' + key + ' is not in ' + object 
                
                if ( this.is( 'PlainObject', structure[ key ] )) // if value is a plain objet, reccursive check
                    return this.isStructure( structure[ key ], obj[ key ])
                if ( ! this.is( type, obj[ key ] ) )
                    error = 'TypeChecker: Key ' + key + ' is not in ' + object 

            }
            if ( error ){
                throw new Error( error )
                return false
            }
            return true
        },

        Profile: function( p ){
            return this.isStructure({
                label: 'String',
                id:    'String'
            }, p )
        },

        BenchmarkRawData: function( d ){
            return this.isStructure({
                settings: 'PlainObject',
                data: {
                    W: 'PlainObject',
                    M: 'PlainObject'
                }
            }, d )
        }



    };

    return TypeChecker

} );