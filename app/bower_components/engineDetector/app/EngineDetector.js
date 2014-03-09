define( function() {


    var EngineDetector = function() {
        this.isNode = false
        this.isBrowser = false
        this.isUnknown = false
        this._exports
        this.detect()
    }

    EngineDetector.prototype = {

        detect: function() {

            try { // do not detect node with 'module' because it is node defined with the r.js loader
                process.argv // todo
                this._setAsNode()
            } catch(e){
            }
            try {
                window.location.search
                this._setAsBrowser()
            } catch(e){
            }
            if ( ! this.isNode && ! this.isBrowser )
                this._setAsUnknown()
        },

        _setAsNode: function() {
            this.isNode = true
            this.name = 'node'
        },

        _setAsBrowser: function() {
            this.isBrowser = true
            this._global = window
            this.name = 'browser'
        },

        _setAsUnknown: function() {
            this.isUnknown = true
            this.name = 'unknown'
        },

        setGlobal: function( e ) {
            this._global = e
        },

        ifNode: function( f ) {
            if ( this.isNode )
                f()
        },

        ifNotNode: function( f ) {
            if ( !this.isNode )
                f()
        },

        ifNotBrowser: function( f ) {
            if ( !this.isBrowser )
                f()
        },

        ifBrowser: function( f ) {
            if ( this.isBrowser )
                f()
        },


        exports: function( key, exported ) {
            if ( this.isNode ) {
                this._global.exports = exported
            } else if ( this.isBrowser )
                this._global[  key ] = exported
        }

    }

    return EngineDetector


} )