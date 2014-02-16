define( [
    'Seed/Extendable',
    'Seed/plugins/AbstractExtendHook',
    'Seed/helpers'
], function( Extendable, AbstractExtendHook, _ ) {


    /**
     *
     * @constructor PlusMinusExtendHook
     *
     * TODO clean this shit
     * From old code
     * See related tests in test/app/
     *
     */


    /**
     * Mix two params, to get the better mix
     *
     * @private
     * @param {String|Array|Object|Number} before
     * @param {String|Array|Object|Number} after
     * @returns an extended object if before and after are objects
     */

    var extendReturn = function( before, after ) {

        if ( typeof( after ) === 'undefined' ) {
            return before
        }

        if ( typeof( after ) === 'object' && typeof( before ) === 'object' ) {
            return _.extend( {}, before, after )
        }

        return after
    }



    /**
     * Two Fns executed in once
     *
     * @private
     * @param {Object|Function} before a function or object that is executed before
     * @param  {Object|Function} after a function or object that is executed before
     * @returns {Object|Function} a function that calls before and then after
     */

    var mergeFns = function( before, after ) {

        if ( typeof( before ) === 'function' || typeof( after ) === 'function' ) {
            return function() {
                var beforeR = ( typeof( before ) === 'function' ?
                    before.apply( this, arguments ) :
                    before
                ),
                    afterR = ( typeof( after ) === 'function' ?
                        after.apply( this, arguments ) :
                        after
                    )

                    return extendReturn( beforeR, afterR )
            }
        } else {
            return extendReturn( before, after )
        }

    }


    var PlusMinusExtendHook = AbstractExtendHook.extend( {

        constructor: function() {

            AbstractExtendHook.prototype.constructor.apply( this, arguments )

            this.merge()

        },

        merge: function() {
            // var resObj =  {},


            var resObj = this.getNewPrototype(),
                oldObj = resObj,
                extendObj = this.getExtension(),
                nullFn = function() {}

            for ( var i in extendObj )
                if ( extendObj.hasOwnProperty( i ) ) {
                    var reg = /(^\+|^-)(.*)/g

                    if ( reg.test( i ) ) { // merge fns
                        var key = i.replace( reg, '$2' ),
                            old = oldObj[ key ] || nullFn,
                            extFn = extendObj[ i ]

                        switch ( i.charAt( 0 ) ) {
                            case '+':
                                resObj[ key ] = mergeFns( old, extFn )
                                break
                            case '-':
                                resObj[ key ] = mergeFns( extFn, old )
                                break
                        }

                        delete oldObj[ i ]

                    } else { // merge object
                        resObj[ i ] = extendObj[ i ]
                    }
                }

        },

        initializePlugin: function() {

            AbstractExtendHook.prototype.initializePlugin.call( this, arguments )

        }

    } )

    return PlusMinusExtendHook

} )