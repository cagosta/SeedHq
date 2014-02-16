define( [ '../helpers' ], function( _ ) {

    /**
     * Mix two params, to get the better mix
     *
     * @private
     * @param {String|Array|Object|Number} before
     * @param {String|Array|Object|Number} after
     * @returns an extended object if before and after are objects
     */

    var extendReturn = function( before, after ) {

        if ( typeof( after ) === "undefined" ) {
            return before;
        }

        if ( typeof( after ) === "object" && typeof( before ) === "object" ) {
            return _.extend( {}, before, after );
        }

        return after;
    };


    /**
     * Two Fns executed in once
     *
     * @private
     * @param {Object|Function} before a function or object that is executed before
     * @param  {Object|Function} after a function or object that is executed before
     * @returns {Object|Function} a function that calls before and then after
     */

    var mergeFns = function( before, after ) {

        if ( typeof( before ) === "function" || typeof( after ) === "function" ) {
            return function( ) {
                var beforeR = ( typeof( before ) === "function" ?
                    before.apply( this, arguments ) :
                    before
                ),
                    afterR = ( typeof( after ) === "function" ?
                        after.apply( this, arguments ) :
                        after
                    );

                return extendReturn( beforeR, afterR );
            };
        } else {
            return extendReturn( before, after );
        }

    };



    /**
     * extend an object with +/- convention
     *
     * @private
     * @param {Object} oldObj an object to extend from
     * @param  {Object} a key-value object to add to oldObject, with +key and -key
     * @returns {Object} an extended object
     */


    return {
        name: 'plusMinus',
        handle: function( oldObj, extendObj ) {

            // var resObj =  {},
            var resObj = oldObj,
                nullFn = function() {};

            for ( var i in extendObj )
                if ( extendObj.hasOwnProperty( i ) ) {
                    var reg = /(^\+|^-)(.*)/g;

                    if ( reg.test( i ) ) { // merge fns
                        var key = i.replace( reg, "$2" ),
                            old = oldObj[ key ] || nullFn,
                            extFn = extendObj[ i ];

                        switch ( i.charAt( 0 ) ) {
                            case "+":
                                resObj[ key ] = mergeFns( old, extFn );
                                break;
                            case "-":
                                resObj[ key ] = mergeFns( extFn, old );
                                break;
                        }

                        delete oldObj[ i ]

                    } else { // merge object
                        resObj[ i ] = extendObj[ i ];
                    }
                }
            return resObj;
        }
    }

} )