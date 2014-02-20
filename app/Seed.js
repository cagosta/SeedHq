/**
 * SeedHq version: "0.0.25" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/SeedHq for details
 */


define( [
    './Eventable',
    './helpers', // remove me 
    './plugins/defaultPlugins'
 ], function( Eventable, helpers, defaultPlugins ) {


    /**
     * @class Seed
     * @param {object} o configuration object
     * @example
     *
     */

    return Eventable.use( {
        plugins: defaultPlugins
    } ).extend( {

        /**
         * init instance attributes
         *
         * @param {object} o configuration object
         */
        constructor: function( o ) {

            ( o = o ||  {} )

            //publisher init
            this._events = []

            //subscriber init
            this._attached = []

            this._subs = []

            this._o = o


            this.setOptions()

        },

        /**
         * no options by default
         */

        options: {},

        /**
         * keys declared in options are set as attribute in the instance
         */
        bindMethod: function( methodName ) {

            this[ methodName ] = this[ methodName ].bind( this )

        },

        setOptions: function() {

            var setter
            if ( this.options ) {
                for ( var i in this.options )
                    if ( this.options.hasOwnProperty( i ) ) {
                        if ( typeof( this._o[ i ] ) === 'undefined' ) this[ i ] = this.options[ i ]
                        else {
                            setter = 'set' + helpers.capitalize( i )
                            if ( typeof this[ setter ] === 'function' ) { // accessors extend hook todo
                                this[ setter ]( this._o[ i ] )
                            } else {
                                this[ i ] = this._o[ i ]
                            }
                        }
                    }
            }

        },

        /**
         * Build a sub instance, that will be destroyed with this
         * @params {function} C Constructor of the sub instance
         * @params {object} o configuration options of the sub instance
         * @returns {object} c instance built
         */

        sub: function( C, o ) {

            if ( typeof( C ) !== 'function' ) {
                throw new Error( 'C is not a valid constructor' )
            }
            var c = new C( o )
            this._subs.push( c )
            return c

        },



        /**
         * Destroy the objects, his events and his sub objects
         */

        destroy: function() {

            this.detachAll()
            for ( var i = 0; i < this._subs.length; i++ ) {
                this._subs[ i ].destroy()
            }
        }

    } )

} )