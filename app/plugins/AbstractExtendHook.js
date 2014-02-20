define( [
	'Seed/Extendable',
	'mangrove-utils/extend'
 ], function( Extendable, extend ) {


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


		},

		extendNewPrototype: function( o ) {

			extend( this.getNewPrototype(), o )

		},


		pluginInitialized: function() {

			if ( !this.getNewPrototypeAttr( this.confKey ) )
				return false

			if ( !this.getNewPrototypeAttr( this.confKey )[  this.pluginId ] )
				return false

			return true
		},

		initializePlugin: function() {

			if ( !this.getNewPrototypeAttr( this.confKey ) ) {
				this.setNewPrototypeAttr( this.confKey, {} )
			}

			if ( !this.getNewPrototypeAttr( this.confKey )[  this.pluginId ] )
				this.getNewPrototypeAttr( this.confKey )[  this.pluginId ] = {}

		},

		defineNewPrototypeMethod: function( methodName, f ) {

			this.setNewPrototypeAttr( methodName, f )

		},

		getPluginConfig: function() {

			return this.getNewPrototype()[ this.confKey ][  this.pluginId ]

		},

		getPluginConfigAttr: function( key ) {

			return this.getPluginConfig()[ key ]

		},

		setPluginConfigAttr: function( key, value ) {

			this.getPluginConfig()[ key ] = value

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