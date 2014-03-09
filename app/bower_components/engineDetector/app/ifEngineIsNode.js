define( [
    'engineDetector/engineDetector'
 ], function( engineDetector ) {

    var ifEngineIsNode = {

        load: function( name, req, onLoad, config, isBuid ) {
            
            if ( config.isBuild ){
                onLoad(function( ){
                    return null
                })
                return 
            }
            engineDetector.ifNode( function() {
                req( [ name ], function( module ) {
                    onLoad( module )
                } )

            } )

            engineDetector.ifNotNode( function() {

                onLoad( null )

            } )

        }

    }

    return ifEngineIsNode

} )