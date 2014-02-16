define( [
    './extendHooker',
    'backbone',
    'underscore'
 ], function( extendHooker, backbone, _ ) {

    extendHooker.hookify( backbone.Model )

    backbone.Model.extend = function( protoProps, staticProps ) {

        var parent = this


        var child = function( ){
            this.constructor.apply( this, arguments )
        }


        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function() {
            // this.constructor = child
        }

        Surrogate.prototype = parent.prototype


        var hooks = backbone.Model.__hooks,
            hooked = new Surrogate,
            hooked = _.extend( hooked, protoProps )

        for ( var i = 0; i < hooks.length; i++ ) {
            hooked = hooks[ i ].handle( hooked, protoProps )
        }

        child.prototype = hooked

        child.extend = backbone.Model.extend

        child.__super__ = parent.prototype

        return child
    }

    return backbone

} )

