define( function() {



    return ( function() {
        
        if ( window.addEventListener )
            return function( el, ev, fn, c ) {
                return el.addEventListener( ev, fn, !! c )
            }
        return function( el, ev, fn ) {
            return el.attachEvent( 'on' + ev, function( e ) {
                var e = e || window.event
                e.target = e.target || e.srcElement
                e.relatedTarget = e.relatedTarget || e.fromElement || e.toElement
                e.isImmediatePropagationStopped = e.isImmediatePropagationStopped || false
                e.preventDefault = e.preventDefault || function() {
                        e.returnValue = false
                    }
                e.stopPropagation = e.stopPropagation || function() {
                    e.cancelBubble = true
                }
                e.stopImmediatePropagation = e.stopImmediatePropagation || function() {
                    e.stopPropagation()
                    e.isImmediatePropagationStopped = true
                }
                if ( !e.isImmediatePropagationStopped )
                    fn( e )
            } )
        }
    }() )

} )