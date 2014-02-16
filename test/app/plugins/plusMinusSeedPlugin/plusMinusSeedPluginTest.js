define( [
    'Seed/Extendable',
    'Seed/plugins/plusMinusSeedPlugin/plusMinusSeedPlugin',
    'test/app/ExtendableTest'
], function( Extendable, plusMinusSeedPlugin, extendableBasicInheritanceTests ) {


    var Extendable = Extendable

    describe( 'plusMinusSeedPlugin', function() {

        extendableBasicInheritanceTests( Extendable )


        describe( 'plus minus extend hook', function() {

            var PlusMinusExtendable = Extendable.use( {
                plugins: [ plusMinusSeedPlugin ]
            } )

            extendableBasicInheritanceTests( PlusMinusExtendable )


            describe( 'after plus minus registration', function() {

                it( 'should just work', function() {

                    expect( PlusMinusExtendable.hasSeedPlugin( 'plusminus' ) ).to.be.true

                    var Mother = PlusMinusExtendable.extend( {

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


                it( 'should not impact defaut Extendable ', function() {

                    expect( Extendable.hasSeedPlugin( 'plusminus' ) ).to.be.false
                    var Class = Extendable.extend( {

                        '+constructor': function() {
                            this.name = 'plusminus'
                        }

                    } )

                    var object = new Class

                    expect( object.name ).to.not.exist

                } )


            } )


        } )


    } )

} )