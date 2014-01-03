define( function( ) {

    return {

        capitalize: function( s ) {
            return ( s.charAt( 0 ).toUpperCase( ) + s.slice( 1 ) )
        },

        remove: function( a, v ) {
            for ( var i = a.length; i--; ) {
                if ( a[ i ] === v ) a.splice( i, 1 )
            }
            return a
        },

        clone: function( o ) { // clones an object (only lvl 1, see hardClone)
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

} )