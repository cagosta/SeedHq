define( [
    'engineDetector/engineDetector',
    './ifEngineIsNode!jsdom'
 ], function( engine, jsdom ) {

    if ( engine.isNode ) {
        var doc = jsdom.jsdom( "<html><body></body></html>", jsdom.level( 1, 'core' ) );

        return doc.parentWindow

    } else if ( engine.isBrowser ) {

        return window

    }


} )