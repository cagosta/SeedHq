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

            this.ExtendHook = AbstractExtendHook

        },

        getId: function() {

            return this.id

        },

        handle: function( o ) {

            this.buildExtendHook( o )

        },

        buildExtendHook: function( o ) {

            var ExtendHook = this.ExtendHook
            o.pluginId = this.id

            new ExtendHook( o )

        }

    } )

} )