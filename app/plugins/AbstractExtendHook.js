define( [
	'Seed/Extendable'
], function( Extendable ) {


	/**
	 *
	 * @constructor
	 *
	 */

	return Extendable.extend( {

		constructor: function( o ) {

			this.pluginId = o.pluginId


			this.Class = o.Class
			this.newPrototype = this.getNewPrototype()


			this.extendedPrototype = o.extendedPrototype


			this.extension = o.extension
			this.confKey = 'seedPlugin'


			if ( !this.pluginInitialized() )
				this.initializePlugin()



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


		pluginInitialized: function() {

			return !!this.getPluginConfig()

		},

		initializePlugin: function() {


			this.setNewPrototypeAttr( this.confKey, {} )

			this.setNewPrototypeAttr( 'types', [] )

			this.setNewPrototypeAttr( 'getTypes', function() {

				return this.types

			} )

			this.setNewPrototypeAttr( 'isA', function( type ) {

				return this.types.indexOf( type ) !== -1

			} )

			this.setNewPrototypeAttr( 'isTypeOf', function( type ) { // retro compatibility

				return this.types.indexOf( type ) !== -1

			} )


		},

		getPluginConfig: function() {

			return this.getNewPrototype()[ this.confKey ]

		},

		getPluginConfigAttr: function( key ) {

			return this.getNewPrototype()[ this.confKey ][ key ]

		},

		setPluginConfigAttr: function( key, value ) {

			this.getNewPrototype()[ this.confKey ][ key ] = value

		},

		getNewPrototype: function() {

			return this.getClass().prototype

		},


		setNewPrototypeAttr: function( key, value ) {

			return this.getNewPrototype()[ key ] = value

		},

		getNewPrototypeAttr: function( key ) {

			return this.getNewPrototype()[ key ]

		},

		getExtensionAttr: function( key ) {

			return this.getExtension()[ key ]

		},

		setExtensionAttr: function( key, value ) {

			return this.getExtension()[ key ] = value

		},


		getExtension: function() {

			return this.extension

		},

		getNewPrototype: function() {

			return this.Class.prototype

		},

		getExtendedPrototypeAttr: function( key ) {

			return this.extendedPrototype[  key ]

		},

		getExtendedPrototype: function() {

			return this.extendedPrototype

		},

		getClass: function() {

			return this.Class

		}

	} )



} )