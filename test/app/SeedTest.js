define( [
    'Seed/Seed'
], function( Seed ) {


    describe( 'Seed', function() {

        describe( 'plugins', function() {

            it( 'should have plusminus, type and accessors plugins', function() {

                expect( Seed.hasSeedPlugin( 'plusminus' ) ).to.be.true
                expect( Seed.hasSeedPlugin( 'type' ) ).to.be.true
                expect( Seed.hasSeedPlugin( 'accessors' ) ).to.be.true

            } )

            it( 'should validate basis plusminus plugin tests', function() {

                expect( Seed.hasSeedPlugin( 'plusminus' ) ).to.be.true

                var Mother = Seed.extend( {

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

            it( 'should validate basic type plugin tests', function() {

                var Class = Seed.extend( {

                    type: 'Class'

                } )

                var object = new Class( {
                    instanciation: true
                } )

                expect( object.getTypes()[  0 ] ).to.equal( 'Class' )
                expect( object.getTypes().length ).to.equal( 1 )
                expect( object.isA( 'Class' ) ).to.be.true
                expect( object.isA( 'bar' ) ).to.be.false

            } )

            it( 'should validate other type plugin tests', function() {


                var Corp = Seed.extend( {

                    type: 'Corp'

                } )

                var Planet = Corp.extend( {

                    type: 'Planet'

                } )

                var corp = new Corp
                var planet = new Planet


                expect( corp.isA( 'Corp' ) ).to.be.true
                expect( corp.isA( 'Planet' ) ).to.be.false
                expect( planet.isA( 'Corp' ) ).to.be.true
                expect( planet.isA( 'Planet' ) ).to.be.true
                expect( planet.isA( 'String' ) ).to.be.false


            } )

            it( 'should validate basic accessors tests', function() {

                it( 'should comport well with multiple inheritance', function() {

                    var Corp = Seed.extend( {

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

            } )

        } )


        describe( '+options', function() {


            var Mother, Daughter;

            it( 'should append all values defined in +options key to the instance', function() {


                Mother = Seed.extend( {

                    '+options': {
                        hey: 'mother',
                        foo: 'bar'
                    }


                } )

                var mother = new Mother()
                expect( mother.hey ).to.equal( 'mother' )
                expect( mother.foo ).to.equal( 'bar' )

            } )

            it( 'should +options transmit to children', function() {

                Daughter = Mother.extend( {

                    '+options': {
                        daughter: true
                    }

                } )

                daughter = new Daughter()
                expect( daughter.hey ).to.equal( 'mother' )
                expect( daughter.daughter ).to.equal( true )


            } )

            it( 'should erase default +options by objects sent during instanciation', function() {


                daughter = new Daughter( {
                    hey: 'sam'
                } )

                expect( daughter.hey ).to.equal( 'sam' )
                expect( daughter.foo ).to.equal( 'bar' )

            } )

        } )

    } )

} )