define( function() {

    return function( parent, son ) {

        var sonRatio = son[ 1 ] / son[ 0 ],
            parentRatio = parent[ 1 ] / parent[ 0 ],
            fitWidth = ( sonRatio >= parentRatio );

        if ( fitWidth )
            return [  parent[ 0 ], parent[ 0 ] * sonRatio ]
        else
            return [ parent[ 1 ] / sonRatio , parent[ 1 ] ]

    }

} )