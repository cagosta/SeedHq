define( [
    './helpers'
 ], function( _ ) {


    var ExtendHooker = function( ) {

    }

    ExtendHooker.prototype =  {

        getHooks: function( ) {

        },

        hookify: function( Extendable ) {

            var hooks = Extendable.__hooks = [ ]

            Extendable.registerHook = function( hook ) {
                Extendable.__hooks.push( hook )
            }

            Extendable.hasHook = function( hook ) {
                if ( typeof hook === 's' ) {
                    return !!_.find( hooks, function( h ) {
                        return h.id === hook
                    } )
                }
                return !!_.find( hooks, function( h ) {
                    return h === hook
                } )
            }


            Extendable.unregisterHook = function( hook ) {
                return _.remove( hooks, hook )
            }

            
        }

    }


    return new ExtendHooker

} )