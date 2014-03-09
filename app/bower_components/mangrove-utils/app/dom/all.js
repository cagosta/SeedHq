define( [
    './addEventListener',
    './keyCodes',
    './ready',
    './removeEventListener'
 ], function( addEventListener, keyCodes, ready, removeEventListener ) {


    return {
        addEventListener: addEventListener,
        keyCodes: keyCodes,
        ready: ready,
        removeEventListener: removeEventListener
    }

} )