define( [
    './accessors/defaultTypeChecker',
    '../helpers'
], function( defaultTypeChecker, _, Seed ) {

    var AccessorHandler = function( oldPrototype, accessorString, extendObj, typeChecker ){
        this.id              = 'accessors'
        this.accessorString = accessorString
        this.extendObj       = extendObj
        this.typeChecker     = typeChecker
        this.typeChecker.is  = this.typeChecker.is.bind( this.typeChecker )
        this.oldPrototype    = oldPrototype
        this.create( )
    }

    AccessorHandler.prototype = {

        create: function( ){
            var firstChar            =  this.accessorString.charAt( 0 ),
                isPrivate            =  ( firstChar === '-' ),
                isPublic             =  ! isPrivate,
                accessorString       =  ( firstChar === '-' || firstChar === '+' ) ? this.accessorString.slice( 1 ) : this.accessorString, // remove + and - 
                accessorStringSplit  =  accessorString.split( '|' ),
                type                 =  accessorStringSplit[ 1 ],
                name                 =  accessorStringSplit[ 0 ],
                capitalizedName      =  _.capitalize( name ),
                prefix               =  ( isPrivate ? '_' : '' ),
                getterName           =  prefix + 'get' + capitalizedName,
                setterName           =  prefix + 'set' + capitalizedName,
                accessorName         =  prefix + name,
                typeChecker          =  this.typeChecker,
                self                 =  this,
                error 
            // console.log( this.getExtendHookConfiguration( ).allAccessors )
            // console.log( name, this.accessorString) 
            if ( !_.find( this.getExtendHookConfiguration( ).allAccessors, function( x ){ return x } ) )
                // console.log( 'accessorsExtendHook - erasing parent accessors ' + name )
            // else 
                this.getExtendHookConfiguration( ).allAccessors.push( name )

            this.addMethod( getterName, function( ) {
                return this[ accessorName ]
            } )

            if ( type )
                this.addMethod( setterName, function( v ) {
                    if ( self.typeChecker.is( type, v ) ){
                        this[ accessorName ] = v
                        return v
                    }
                    else {
                        try {
                            error = JSON.stringify( v ) + ' is not a ' + type
                        } catch(e ){
                            
                        }
                        debugger // dev mode, TODO
                        throw new Error( error )
                    }
                } )
            else 
                this.addMethod( setterName, function( v ) {
                    this[ accessorName ] = v
                    return v
                })
        },

        getOldObj: function( ) {
            return this.oldPrototype
        },

        getExtendObj: function( ) {
            return this.extendObj
        },

        getExtendHookConfiguration: function( ) {
            return this.getOldObj( ).__extendHooks[ this.id ]
        },

        addMethod: function( methodName, f ){
            if ( ! this.extendObj[ methodName ] )
                this.oldPrototype[ methodName ] = f
            // else 
                // console.log( 'accessorsExtendHook - ' + methodName + ' is define in extendObj' )
        }

    }


    var AccessorExtendHook = function( ){
            this.id          = 'accessors'
            this.handle      = this.handle.bind( this )
            this.typeChecker = defaultTypeChecker
    }

    AccessorExtendHook.prototype = {

        configure: function( confObj ){
            if ( confObj.typeChecker )
                this.typeChecker = confObj.typeChecker
        },

        initializeHook: function( oldObj, extendObj ){
            var accessors = [] // add 
            extendObj.__extendHooks = oldObj.__extendHooks || { }
            extendObj.__extendHooks[ this.id ] = {
                id: this.id,
                allAccessors: accessors
            }
        },

        hasHook: function( oldObj ){
            return oldObj && oldObj.__extendHooks && oldObj.__extendHooks[ this.id ]
        },

        handle: function( oldObj, extendObj ){
            var accessors = extendObj.accessors

            if ( ! this.hasHook( oldObj ) )
                this.initializeHook( oldObj, extendObj )

            if ( !accessors )
                return oldObj

            for ( var i = 0; i < accessors.length; i++ ){
                new AccessorHandler( oldObj, accessors[ i ], extendObj, this.typeChecker )
            }
            

            return oldObj
        }

    }

    return new AccessorExtendHook

} )