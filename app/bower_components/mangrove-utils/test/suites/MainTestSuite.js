define( [
    'mangrove-utils/mangrove-utils',
    'engineDetector/engineDetector'
 ], function( mangroveUtils, engineDetector ) {

    describe( 'mangrove-utils/mangrove-utils', function() {

        it( 'should load without blowing', function() {

            expect( mangroveUtils ).to.exist

        } )

        it( 'should be an object of helpers', function() {

            expect( mangroveUtils.extend ).to.exist
            expect( mangroveUtils.merge ).to.exist

        } )

        describe( 'cover', function() {
            var cover = mangroveUtils.cover
            var testBigger = function( a, b ) {
                var r = cover( a, b )
                expect( r[ 0 ] >= a[ 0 ] ).to.be.true
                expect( r[ 1 ] >= a[ 1 ] ).to.be.true
            }
            var testCover = function( a, b, t ) {
                testBigger( a, b )
                expect( cover( a, b ) ).to.deep.equal( t )
            }
            var testCovers = function( list ) {
                for ( var i = 0; i < list.length; i++ )
                    testCover( list[ i ][ 0 ], list[ i ][ 1 ], list[ i ][ 2 ] )
            }
            it( 'should give an array fitting ', function() {
                testCovers([
                    [
                        [ 100, 100 ], [ 100, 100 ], [ 100, 100 ]
                    ],
                    [
                        [ 100, 100 ], [ 50, 50 ], [ 100, 100 ]
                    ],
                    [
                        [ 1, 2 ], [ 1, 4 ], [ 1, 4 ]
                    ],
                    [
                        [ 1, 2 ], [ 1, 0.5 ], [ 4, 2 ]
                    ],
                    [
                        [ 2, 1 ], [ 2, 4 ], [ 2, 4 ]
                    ],
                    [
                        [ 2, 1 ], [ 2, 0.5 ], [ 4, 1 ]
                    ]
                ])
            } )
        } )

        describe( 'extend', function() {

            var extend = require( 'mangrove-utils/extend' )

            it( 'should extend correctly', function() {

                expect( extend( {
                    yo: 'mother'
                }, { 
                    yo: 'daugther'
                } ).yo ).to.equal( 'daugther' )

            } )

        } )

        describe( 'dom', function() {


            engineDetector.ifBrowser( function() {

                it( 'should load without blowing', function( done ) {

                    var domUtils = require( [ 'mangrove-utils/dom/all' ], function( dom ) {

                        expect( dom ).to.exist
                        expect( dom.addEventListener ).to.exist
                        done()

                    } )

                } )

            } )

        } )

    } )

} )