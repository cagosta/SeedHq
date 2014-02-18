define( [
    'Seed/Extendable',
    './AbstractExtendHook'
 ], function( Seed, AbstractExtendHook ) {


    /**
     *
     * @constructor
     *
     */

    return Seed.extend( {

        constructor: function() {

            this.ExtendHook = this.ExtendHook || AbstractExtendHook
            this.extendHooks = []

        },

        getId: function() {

            return this.id

        },

        handle: function( o ) {

            this.buildExtendHook( o )

        },

        buildExtendHook: function( o ) {

            o.pluginId = this.id

            var ExtendHook = this.ExtendHook,
                extendHook;

            extendHook = new ExtendHook( o )
            this.extendHooks.push( extendHook )
            this.onExtend( extendHook )

        },

        onExtend: function( extendHook ) {

        }

    } )

} )