define( [
    'Seed/plugins/AbstractSeedPlugin',
    './AccessorsExtendHook',
    './defaultTypeChecker'
], function( AbstractSeedPlugin, AccessorsExtendHook, defaultTypeChecker ) {


    /**
     *
     * @constructor
     *
     */


    var AccessorsSeedPlugin = AbstractSeedPlugin.extend( {

        constructor: function() {

            this.typeChecker = defaultTypeChecker // add typeChecker
            this.id = 'accessors'
            this.ExtendHook = AccessorsExtendHook

            AbstractSeedPlugin.prototype.constructor.apply( this, arguments )


        },

        handle: function( o ) {

            o.typeChecker = this.typeChecker
            AbstractSeedPlugin.prototype.handle.apply( this, arguments )

        }

    } )


    return new AccessorsSeedPlugin

} )