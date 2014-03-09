define( [
    'engineDetector/engineDetector'
 ], function( engineDetector ) {

    return {

        load: function( name, req, onLoad, config ) {

            engineDetector.ifBrowser( function() {

                req( [ name ], function( module ) {
                    onLoad( module )
                } )

            } )

            engineDetector.ifNotBrowser( function() {

                onLoad( null )

            } )

        }


    }

} )