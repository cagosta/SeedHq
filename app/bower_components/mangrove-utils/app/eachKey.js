define( function() {

    return function( o, f ) {
        for ( var i in o )
            if ( o.hasOwnProperty( i ) ) {
                f( i, o[ i ] );
            }
    };

} );