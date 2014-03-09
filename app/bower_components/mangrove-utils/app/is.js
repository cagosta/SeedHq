define( [
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