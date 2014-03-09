define( [], function() {

    return Object.keys || function() {
        var k, arr = [],
            o = !! o ? ( !! o.callee ? Array.prototype.slice.call( o ) : o ) : {}

        for ( k in o )
            if ( arr.hasOwnProperty.call( o, k ) )
                arr.push( k )

        return arr
    }
    
} )