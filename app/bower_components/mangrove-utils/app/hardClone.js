define( [ './isArray' ], function( isArray ) {

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

} )