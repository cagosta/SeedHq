define( [
    '../helpers'
], function(  _  ) {


    var TypeExtendHook = function( ) {
            this.id          = 'type'
            this.handle      = this.handle.bind( this )
    }

    var TypeHookHandler = function( o ) {

        this.id           = 'type'
        this.oldObj       = o.oldObj
        this.extendObj    = o.extendObj
        // console.log( 'type', this.getExtendObj( ).type, this.getOldObj( ).types )
        if ( ! this.hasHook( ) ){
            this.initializeHook( )
        }
        this.handleExtendObjType( )
    }

    TypeHookHandler.prototype = {

        handleExtendObjType: function( ){
            var oldTypes = this.getOldObj( ).getTypes( ).slice( ), // copy array of previoustypes
                newType = this.getExtendObj( ).type
                 
            this.getOldObj( ).types = oldTypes
            if ( typeof newType !== 'string' ) // no type or invalid type type ( ha ha )
                return
            if ( oldTypes.indexOf( newType ) !== -1 )
                return
            this.getOldObj( ).types.push( newType )
        },

        hasHook: function(  ){
            return this.getOldObj( ).__extendHooks && this.oldObj.__extendHooks[ this.id ]
        },

        getHookConfigurationObject: function( ){
            return this.getOldObj( ).__extendHooks[ this.id ]
        },

        getTypes: function( ){
            return this.getOldObj( ).types
        },

        initializeHook: function( ){
            if ( ! this.getOldObj( ).__extendHooks )
                this.getOldObj( ).__extendHooks = { }

            this.getOldObj( ).__extendHooks[ this.id ] = {
                id:       this.id
            }

            this.getOldObj( ).isTypeOf = function( type ){
                return this.types.indexOf( type ) !== -1
            } 

            this.getOldObj( ).types = [ ]

            this.getOldObj( ).getTypes = function( ){
                return this.types
            }
        },

        getOldObj: function( ){
            return this.oldObj
        },

        getExtendObj: function( ){
            return this.extendObj
        }

    }

    TypeExtendHook.prototype = {

        configure: function( ){

        },


        handle: function( oldObj, extendObj ){

            new TypeHookHandler({
                oldObj:    oldObj,
                extendObj: extendObj
            })

            return oldObj
        }

    }

    return new TypeExtendHook

} )