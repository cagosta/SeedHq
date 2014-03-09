define( function() {

    return function( o ) { // clones an object (only lvl 1, see hardClone)
        var res = {};
        for ( var i in o )
            if ( o.hasOwnProperty( i ) ) res[ i ] = o[ i ];
        return res;
    };

} );