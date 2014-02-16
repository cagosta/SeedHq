define( [
    'Seed/plugins/AbstractSeedPlugin',
    './TypeExtendHook'
], function( AbstractSeedPlugin, TypeExtendHook ) {


    /**
     *
     * @constructor
     *
     */


    return AbstractSeedPlugin.extend( {

        constructor: function() {

            this.id = 'type'
            this.ExtendHook = TypeExtendHook

            AbstractSeedPlugin.constructor.apply( this, arguments )

        },

        handle: function( o ) {

            AbstractSeedPlugin.prototype.handle.apply( this, arguments )

        }

    } )

} )