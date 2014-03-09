define( [
    'engineDetector/engineDetector',
 ], function( engineDetector ) {

    var jsdom
    engineDetector.ifNode( function() {

        jsdom = require( 'jsdom' )

    } )

    return {

        load: function( name, req, onLoad, config ) {

            engineDetector.ifNode( function() {

                jsdom.env(
                    "http://nodejs.org/dist/",
                    function( errors, window ) {
                        
                        global.window = window // is this right ? dont think so ..
                        req( [ name ], function( module ) {
                            onLoad( module )
                        } )

                    }
                )
            } )

            engineDetector.ifNotNode( function() {

                req( [ name ], function( module ) {

                    onLoad( module )

                } )

            } )



        }
    }

} )