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

        },

        getId: function() {

            return this.id

        },

        handle: function( o ) {

            this.buildExtendHook( o )

        },

        buildExtendHook: function( o ) {

            o.pluginId = this.id

            var ExtendHook = this.ExtendHook

            new ExtendHook( o )

        }

    } )

} )