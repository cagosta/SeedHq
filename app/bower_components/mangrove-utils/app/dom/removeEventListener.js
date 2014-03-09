define( function() {

    return ( function() {
        if ( window.removeEventListener )
            return function( el, ev, fn, c ) {
                return el.removeEventListener( ev, fn, !! c )
            }
        return function( el, ev, fn ) {
            el.detachEvent( ev, fn )
        }
    }() )

} )