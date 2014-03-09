define( [
    './enumerate'
], function( enumerate ) {

    var rspaces = /%20/g

    return function() {
        var o = arguments[ 0 ] || {}, keys = enumerate( o ),
            i = 0,
            l = keys.length,
            str = []

        for ( ; i < l; i++ )
            str.push( encodeURIComponent( keys[ i ] ) + '=' + encodeURIComponent( o[ keys[ i ] ] ) )

        return str.join( '&' ).replace( rspaces, '+' )
    }
    
} )