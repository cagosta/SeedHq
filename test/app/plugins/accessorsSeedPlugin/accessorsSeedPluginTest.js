define( [
    'Seed/Extendable',
    'Seed/plugins/accessorsSeedPlugin/accessorsSeedPlugin'
 ], function( Extendable, accessorsSeedPlugin ) {



    describe( 'AccessorsSeedPlugin', function() {

        var AccessorsExtendable = Extendable.use( {
            plugins: [ accessorsSeedPlugin ]
        } )

        it( 'should have accessor plugin', function() {

            expect( AccessorsExtendable.hasSeedPlugin( 'accessors' ) ).to.be.true

        } )

        it( 'should be possible to define public accessors', function() {


            var Class = AccessorsExtendable.extend( {

                constructor: function() {

                    this.name = 'cyril'

                },

                accessors: [ 'name' ]

            } )

            var object = new Class
            expect( object.getName ).to.be.a( 'function' )
            expect( object.setName ).to.be.a( 'function' )
            object.setName( 'sam' )
            expect( object.getName() ).to.equal( 'sam' )
            expect( object.name ).to.equal( 'sam' )

        } )

        it( 'should be possible to define private accessors', function() {

            var Class = AccessorsExtendable.extend( {

                constructor: function() {

                    this._name = 'cyril'

                },

                accessors: [ '-name' ]

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

            var Class = AccessorsExtendable.extend( {

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

            var Corp = AccessorsExtendable.extend( {

                accessors: [ '+coordinate|Point' ]

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

        it( 'should be possible to erase accessors', function() {

            var Class = AccessorsExtendable.extend( {

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

                var Class = AccessorsExtendable.extend( {

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

            it( 'should handle custom types ', function() { // Seed/plugins/accessors/TypeChecker to define custom type

                var Class = AccessorsExtendable.extend( {

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

    } )

} )