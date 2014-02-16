define( [
    'Seed/Seed',
    'Seed/plugins/plusMinusSeedPlugin',
    'Seed/plugins/accessorsSeedPlugin',
    'Seed/plugins/typeSeedPlugin/typeSeedPlugin'
], function( Extendable, plusMinusExtendHook, accessorsExtendHook, typeExtendHook ) {

    // Extendable.unregisterHook( plusMinusExtendHook )
    // Extendable.unregisterHook( accessorsExtendHook )
    // Extendable.unregisterHook( typeExtendHook )

    describe( 'Extendable', function() {

        describe( 'inheritance', function() {

            it( 'should work', function() {

                var Class = Extendable.extend( {

                    sayHello: function() {
                        return 'world'
                    }

                } )
                var object = new Class
                expect( object.sayHello() ).to.equal( 'world' )

            } )

            it( 'should not handle + - basically', function() {

                var Class = Extendable.extend( {

                    '+constructor': function() {
                        this.name = 'plusminus'
                    },

                    sayHello: function() {
                        return 'world'
                    }

                } )

                var object = new Class
                expect( object.name ).to.not.exist

            } )

        } )

        describe( 'hooks', function() {

            describe( 'plus minus extend hook', function() {

                it( 'should be registrable and just work', function() {

                    Extendable.registerHook( plusMinusExtendHook )

                    expect( Extendable.hasHook( plusMinusExtendHook ) ).to.be.true

                    var Mother = Extendable.extend( {

                        constructor: function() {
                            this.motherConstructorCalled = true
                            this.name = 'mother'
                        }

                    } )

                    var Daughter = Mother.extend( {

                        '+constructor': function() {
                            this.name = 'daughter'
                        }

                    } )

                    var object = new Daughter
                    expect( object.name ).to.equal( 'daughter' )
                    expect( object.motherConstructorCalled ).to.be.true
                    expect( object[ '+constructor' ] ).to.be.an( 'undefined' )
                } )


                it( 'should be unregistrable ', function() {

                    Extendable.unregisterHook( plusMinusExtendHook )
                    expect( Extendable.hasHook( plusMinusExtendHook ) ).to.be.false

                    var Class = Extendable.extend( {

                        '+constructor': function() {
                            this.name = 'plusminus'
                        }

                    } )

                    var object = new Class

                    expect( object.name ).to.not.exist


                } )


            } )

            describe( 'accessors extend hook', function() {

                Extendable.registerHook( accessorsExtendHook )

                it( 'should be possible to define public accessors', function() {

                    expect( Extendable.hasHook( accessorsExtendHook ) ).to.be.true
                    var Class = Extendable.extend( {

                        constructor: function() {
                            this.name = 'cyril'
                        },

                        accessors: [ 'name' ]

                    } )

                    var object = new Class
                    expect( object.getName ).to.be.a( 'function' )
                    expect( object.setName ).to.be.a( 'function' )
                    expect( object.__extendHooks.accessors.allAccessors[ 0 ] ).to.equal( 'name' )
                    object.setName( 'sam' )
                    expect( object.getName() ).to.equal( 'sam' )
                    expect( object.name ).to.equal( 'sam' )
                } )

                it( 'should be possible to define private accessors', function() {

                    var Class = Extendable.extend( {

                        constructor: function() {
                            this._name = 'cyril'
                        },

                        accessors: [  '-name' ]

                    } )

                    var object = new Class
                    expect( object._getName ).to.be.a( 'function' )
                    expect( object._setName ).to.be.a( 'function' )
                    expect( object._getName() ).to.equal( 'cyril' )
                    object._setName( 'piercus' )
                    expect( function() {
                        object._setName( 'piercus' )
                    } ).to.not.
                    throw ( Error )
                    expect( object._getName() ).to.equal( 'piercus' )
                    expect( object._name ).to.equal( 'piercus' )
                } )

                it( 'should be possible to define prive typed accessors', function() {

                    var Class = Extendable.extend( {

                        accessors: [ '-name|String' ],

                        constructor: function() {
                            this._name = 'cyril'
                        }

                    } )

                    var object = new Class
                    expect( function() { 
                        object._setName( null )
                    } ).to.
                    throw ( Error )

                } )

                it( 'should comport well with multiple inheritance', function() {

                    var Corp = Extendable.extend( {

                        accessors: [  '+coordinate|Point' ]

                    } )

                    var Planet = Corp.extend( {

                        accessors: [ '+coordinate|Point', '+livable|Boolean' ]

                    } )

                    var corp = new Corp
                    var planet = new Planet

                    expect( Corp.extend ).to.be.a( 'Function' )
                    expect( corp.getLivable ).to.be.an( 'undefined' )

                    planet.setCoordinate( { 
                        x: 3,
                        y: 0,
                        isPoint: true
                    } )
                    expect( planet.getCoordinate().x ).to.equal( 3 )
                    expect( function() { 
                        planet.setLivable( 'fsdfsd' )
                    } ).to.
                    throw ( Error )
                    planet.setLivable( true )
                    expect( planet.getLivable() ).to.be.true

                } )

                it( 'should be possible to erage accessors', function() {

                    var Class = Extendable.extend( {

                        accessors: [ '+name|String' ],

                        constructor: function() {
                            this._name = 'cyril'
                        },

                        getName: function() {
                            return 'foo'
                        }

                    } )

                    var object = new Class

                    expect( object.getName() ).to.equal( 'foo' )

                } )

                describe( 'type checking ', function() {

                    it( 'should handle native type', function() {

                        var Class = Extendable.extend( {

                            constructor: function() {},

                            accessors: [ 'lastName|String' ]
                        } )

                        var object = new Class
                        expect( function() {
                            object.setLastName( 'agosta' ) 
                        } ).to.not.
                        throw ( Error )

                        expect( object.getLastName() ).to.equal( 'agosta' )

                        expect( function() {
                            object.setLastName( undefined )
                        } ).to.
                        throw ( Error )
                        expect( object.getLastName() ).to.equal( 'agosta' )

                    } )

                    it( 'should handle custom types ', function() { // Seed/extendHooks/attribute/TypeChecker to define custom type

                        var Class = Extendable.extend( {

                            accessors: [ 'point|Point' ]

                        } )
                        var object = new Class

                        expect( function() { 
                            object.setPoint( 'abcaca' )
                        } ).to.
                        throw ( Error )
                        expect( function() {
                            object.setPoint( { 
                                isPoint: true
                            } )
                        } ).to.not.
                        throw ( Error )

                    } )


                } )

                describe( 'type extend hook', function() {

                    Extendable.registerHook( typeExtendHook )

                    it( 'should be possible to specify a type to a class', function() {

                        var Class = Extendable.extend( {

                            type: 'Class'

                        } )

                        var object = new Class

                        expect( object.getTypes()[  0 ] ).to.equal( 'Class' )
                        expect( object.getTypes().length ).to.equal( 1 )
                        expect( object.isTypeOf( 'Class' ) ).to.be.true
                        expect( object.isTypeOf( 'bar' ) ).to.be.false

                    } )

                    it( 'should comport well with multiple inheritance', function() { 


                        var Corp = Extendable.extend( {

                            type: 'Corp'

                        } )

                        var Planet = Corp.extend( {

                            type: 'Planet'

                        } )

                        var corp = new Corp
                        var planet = new Planet


                        expect( corp.isTypeOf( 'Corp' ) ).to.be.true
                        expect( corp.isTypeOf( 'Planet' ) ).to.be.false
                        expect( planet.isTypeOf( 'Corp' ) ).to.be.true
                        expect( planet.isTypeOf( 'Planet' ) ).to.be.true
                        expect( planet.isTypeOf( 'String' ) ).to.be.false


                    } )

                    it( 'should comport well with accessors type checking', function() {

                        var Point = Extendable.extend( {

                            type: 'Point'

                        } )

                        var Planet = Extendable.extend( {

                            accessors: [ '+coordinate|Point' ],


                            type: 'Planet'
                        } )

                        var point = new Point

                        var planet = new Planet

                        expect( function() { 
                            planet.setCoordinate( null )
                        } ).to.
                        throw ( Error )
                        expect( function() { 
                            planet.setCoordinate( point )
                        } ).to.not.
                        throw ( Error )
                        planet.setCoordinate( point )
                        expect( planet.getCoordinate() ).to.equal( point )


                    } )

                } )

            } )


        } )

    } )

} )