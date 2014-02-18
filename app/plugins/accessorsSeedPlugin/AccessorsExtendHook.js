define( [
    'Seed/Extendable',
    'Seed/plugins/AbstractExtendHook',
    'Seed/helpers'
 ], function( Extendable, AbstractExtendHook, _ ) {


    var AccessorsExtendHook = AbstractExtendHook.extend( {

        constructor: function( o ) {

            this.typeChecker = o.typeChecker
            AbstractExtendHook.prototype.constructor.apply( this, arguments )

            this.handleAccessors()

        },

        handleAccessors: function() {

            var accessors = this.getExtensionAttr( 'accessors' )

            if ( !accessors )
                return

            for ( var i = 0; i < accessors.length; i++ ) {
                this.handleAccessor( accessors[ i ] )
            }

        },

        handleAccessor: function( rawAccessor ) {


            // dirty, to clean this shit

            var firstChar = rawAccessor.charAt( 0 ),
                isPrivate = ( firstChar === '-' ),
                isPublic = !isPrivate,
                accessor = ( firstChar === '-' ||  firstChar === '+' ) ? rawAccessor.slice( 1 ) :  rawAccessor, // remove + and - 
                accessorSplit = accessor.split( '|' ),
                type = accessorSplit[ 1 ],
                name = accessorSplit[ 0 ],
                capitalizedName = _.capitalize( name ),
                prefix = ( isPrivate ? '_' : '' ),
                getterName = prefix + 'get' + capitalizedName,
                setterName = prefix + 'set' + capitalizedName,
                accessorKey = prefix + name,
                typeChecker = this.typeChecker,
                self = this


                this.defineGetter( {
                    key: accessorKey,
                    methodName: getterName
                } )

                if ( type ) {

                    this.defineTypedSetter( {
                        key: accessorKey,
                        methodName: setterName,
                        type: type
                    } )

                } else {

                    this.defineUntypedSetter( {
                        key: accessorKey,
                        methodName: setterName
                    } )

                }


        },

        defineTypedSetter: function( o ) {

            if ( this.getExtensionAttr( o.methodName ) ) // Handle case extension define the getter
                return

            var typeChecker = this.typeChecker,
                type = o.type,
                methodName = o.methodName,
                key = o.key;

            this.defineNewPrototypeMethod( methodName, function( v ) {

                var error

                if ( typeChecker.is( type, v ) ) { // Validation pass !
                    this[ key ] = v
                    return v
                }

                // Validation not ok, not sure what to do here ..
                error = 'AccessorsSeedPlugin -> Validation failed: '

                try { // Try to stringify value sent, for pretty error purpose
                    error += JSON.stringify( v )
                } catch ( e ) { // if failed, add object
                    error += v
                }
                error += ' is not a ' + type

                debugger
                throw new Error( error )

            } )

        },

        defineGetter: function( o ) {

            if ( this.getExtensionAttr( o.methodName ) ) // handle case extension already define the getter
                return

            this.defineNewPrototypeMethod( o.methodName, function() {

                return this[ o.key ]

            } )

        },

        defineUntypedSetter: function( o ) {

            if ( this.getExtensionAttr( o.methodName ) ) // handle case extension already define the getter
                return

            this.defineNewPrototypeMethod( o.methodName, function( v ) {

                return this[ o.key ] = v

            } )

        },

        initializePlugin: function() {

            AbstractExtendHook.prototype.initializePlugin.call( this, arguments )

        }

    } )

    return AccessorsExtendHook

} )