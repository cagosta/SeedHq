define( function() {

    return function( o, b ) {
        var j = {};
        for ( var i in b )
            if ( b.hasOwnProperty( i ) ) j[ i ] = b[ i ];
        for ( i in o )
            if ( o.hasOwnProperty( i ) ) j[ i ] = o[ i ];
        return j;
    }

} );