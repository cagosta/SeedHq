define( [
    'Seed/Extendable',
    'Seed/plugins/AbstractExtendHook'
], function( Extendable, AbstractExtendHook ) {


    /**
     *
     * @constructor
     *
     */


    return AbstractExtendHook.extend( {

        constructor: function() {

            AbstractExtendHook.prototype.constructor.apply( this, arguments )

            this.handleType()

        },

        handleType: function() {

            this.addExtensionType()

        },

        addExtensionType: function() {

            var extensionType = this.getExtensionAttr( 'type' ),
                types = this.getNewPrototypeAttr( 'types' ),
                currentTypes;

            if ( !extensionType )
                return


            currentTypes = types.slice()
            currentTypes.push( extensionType )

            this.setNewPrototypeAttr( 'types', currentTypes )

        },

        initializePlugin: function() {

            AbstractExtendHook.prototype.initializePlugin.call( this, arguments )

            this.extendNewPrototype( {

                types: [],

                getTypes: function() {
                    return this.types
                },

                isA: function( type ) {

                    return this.types.indexOf( type ) !== -1

                },

                isAn: function( type ) {

                    return this.types.indexOf( type ) !== -1

                },

                isTypeOf: function( type ) { // retro compatibility

                    return this.types.indexOf( type ) !== -1

                }

            } )

        }

    } )

} )