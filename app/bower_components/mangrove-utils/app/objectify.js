define( [], function() {
    var ramp = /&amp;|&/g

    return function() {
        var o = {}, str = typeof arguments[ 0 ] == "string" ? arguments[ 0 ] : "",
            pairs = !! ~str.search( ramp ) ? str.split( ramp ) : str.length ? [ str ] : [],
            i = 0,
            l = pairs.length

        for ( ; i < l; i++ )
            ( function( pair, o ) {
                var pair = decodeURIComponent( pair.replace( /\+/g, "%20" ) ),
                    idx = pair.indexOf( "=" ),
                    key = pair.split( "=", 1 ),
                    value = pair.slice( idx + 1 )

                    o[ key ] = value
            }( pairs[ i ], o ) )

        return o
    }
} )