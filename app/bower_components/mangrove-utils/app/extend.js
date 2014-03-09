define( function() {

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