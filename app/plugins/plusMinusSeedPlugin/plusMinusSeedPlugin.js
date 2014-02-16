define( [
    'Seed/plugins/AbstractSeedPlugin',
    './PlusMinusExtendHook'
], function( AbstractSeedPlugin, PlusMinusExtendHook ) {


    /**
     *
     * @constructor
     *
     */


    var PlusMinusSeedPlugin = AbstractSeedPlugin.extend( {

        constructor: function() {

            this.id = 'plusminus'
            this.ExtendHook = PlusMinusExtendHook

            AbstractSeedPlugin.prototype.constructor.apply( this, arguments )

        },

        handle: function( o ) {

            AbstractSeedPlugin.prototype.handle.apply( this, arguments )

        }

    } )


    return new PlusMinusSeedPlugin

} )