define( [
    'Seed/Extendable',
    'Seed/plugins/typeSeedPlugin/typeSeedPlugin'
], function( Seed, typeSeedPlugin ) {


    var basicInheritenceTests = function( Extendable ) {


        describe( 'Extendable basic inheritence', function() {

            it( 'should work', function() {

                var Vehicle, vehicle, Car, car;

                Vehicle = Extendable.extend( {

                    constructor: function() {

                        this.isVehicle = true
                        this.initializeHasWheels()

                    },

                    initializeHasWheels: function() {

                        this.hasWheels = false

                    },

                    vehicleMethod: function() {

                    },

                    classAttr: true

                } )

                vehicle = new Vehicle

                // expect( Vehicle.initializeHasWheels ).to.exist

                expect( vehicle instanceof Vehicle ).to.be.true
                expect( vehicle.hasWheels ).to.be.false


                Car = Vehicle.extend( {

                    constructor: function() {

                        Vehicle.prototype.constructor.apply( this, arguments )
                        this.isCar = true

                    },

                    initializeHasWheels: function() {

                        this.hasWheels = true

                    }

                } )

                car = new Car

                expect( car.vehicleMethod ).to.exist
                expect( car.isCar ).to.be.true
                expect( car.hasWheels ).to.be.true

            } )

            it( 'should be possible to retrive the Class from an instance', function() {

                var Vehicle, vehicle, Car, car;

                Vehicle = Extendable.extend( {

                    constructor: function() {

                        this.isVehicle = true
                        this.initializeHasWheels()

                    },

                    initializeHasWheels: function() {

                        this.hasWheels = false

                    },

                    vehicleMethod: function() {

                    },

                    classAttr: true

                } )

                vehicle = new Vehicle
                expect( vehicle.Class ).to.exist
                expect( vehicle.Class ).to.equal( Vehicle )

                Car = Vehicle.extend( {

                } )

                car = new Car
                expect( car.Class ).to.equal( Car )

            } )

        } )

    }

    describe( 'Seed', function() {

        describe( ' before extension', function() {

            var Extendable = Seed

            describe( 'basic Extendable', function() {

                basicInheritenceTests( Extendable )

                describe( 'Extendable Class methods', function() {

                    it( 'should have getSeedPlugins method', function() {

                        expect( Extendable.getSeedPlugins ).to.exist

                    } )

                    it( 'should have a getSeedPlugins, returning []', function() {

                        expect( Extendable.getSeedPlugins().length ).to.equal( 0 )

                    } )

                    it( 'should have a hasSeedPlugin method return false', function() {

                        expect( Extendable.hasSeedPlugin( 'type' ) ).to.be.false

                    } )

                } )

                describe( 'in case of an instance', function() {

                    var instance

                    before( function() {

                        instance = new Extendable()

                    } )


                } )


            } )

            describe( 'in case of type plugin', function() {

                it( 'should not work', function() {

                    var Class = Extendable.extend( {

                        type: 'Class'

                    } )

                    var object = new Class( {
                        instanciation: true
                    } )

                    expect( object.getTypes ).to.be.a( 'undefined' )

                } )

            } )

        } )


        describe( 'after extension', function() {

            var Extendable

            Extendable = Seed.use( {
                plugins: [ typeSeedPlugin ]
            } )

            basicInheritenceTests( Extendable )

            describe( 'plugin', function() {


                it( 'should respond to hasSeedPlugin(type)', function() {

                    expect( Extendable.hasSeedPlugin( 'type' ) ).to.be.true

                } )

                it( 'should have .getSeedPlugins array', function() {

                    expect( Extendable.getSeedPlugins ).to.exist
                    expect( Extendable.getSeedPlugins().length ).to.equal( 1 )

                } )

            } )

            describe( 'type plugin', function() {

                it( 'should be possible to specify a type to a class', function() {

                    var Class = Extendable.extend( {

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


                it( 'should comport well with multiple inheritance', function() { 


                    var Corp = Extendable.extend( {

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


            } )


        } )

        describe( 'basic Extendable, after extension', function() {

            var Extendable = Seed

            it( 'should not have plugins', function() {

                expect( Extendable.getSeedPlugins().length ).to.equal( 0 )

                var Class = Extendable.extend( {

                    type: 'Class'

                } )

                var object = new Class( {
                    instanciation: true
                } )

                expect( object.getTypes ).to.be.a( 'undefined' )

            } )

        } )

    } )

} )