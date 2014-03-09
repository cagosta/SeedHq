define( function() {

    return function( o ) {
        return ( typeof( o ) === 'object' && o && o.constructor.toString().indexOf( 'Array' ) !== -1 );
    }

} );