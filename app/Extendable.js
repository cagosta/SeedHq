define( [
    './helpers'
], function( _ ) {


    /**
     * This is the basic extendable element,
     *
     * @export Seed/Extendable
     *
     */

    var Extendable = function() {

    }

    Extendable._seedPlugins = []

    Extendable.getSeedPlugins = function() {

        return this._seedPlugins

    }

    Extendable.hasSeedPlugin = function( id ) {

        var plugins = this.getSeedPlugins()

        for ( var i = plugins.length; i--; ) {

            if ( plugins[ i ].getId() === id )
                return true
        }

        return false

    }


    /**
     * Initialize an object
     *
     * @this {Extendable}
     * @param {Object} configuration Object
     */

    Extendable.prototype.constructor = function() {}


    Extendable.use = function( useOptions ) {

        var attrs, Class, extension = {}, plugins, proto;

        useOptions = useOptions || {}

        plugins = useOptions.plugins ||  []

        Class = function() {

            var instanciation = arguments[ 0 ] !== false

            this.Class = Class

            if ( instanciation ) {

                Class.prototype.constructor.apply( this, arguments )
            }

        }

        attrs = _.clone( this )
        _.extend( Class, attrs )

        Class._seedPlugins = plugins

        proto = _.extend( ( new this( false ) ) )

        Class.prototype = proto

        return Class

    }


    Extendable.Class = Extendable

    Extendable.extend = function( extension ) {

        var attrs, Class, proto, plugins;

        Class = function() {

            this.Class = Class

            var instanciation = arguments[ 0 ] !== false

            if ( instanciation ) {

                Class.prototype.constructor.apply( this, arguments )
            }


        }


        attrs = _.clone( this )
        _.extend( Class, attrs )


        proto = _.extend( new this( false ), extension )


        plugins = this.getSeedPlugins()

        Class.prototype = proto;


        for ( var i = 0; i < plugins.length; i++ )
            plugins[ i ].handle( {
                extendedPrototype: this.prototype,
                Class: Class,
                extension: extension
            } )



        return Class

    }

    return Extendable

} )