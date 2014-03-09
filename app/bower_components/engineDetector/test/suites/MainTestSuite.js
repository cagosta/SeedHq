define( [
    'engineDetector/engineDetector'
 ], function( engineDetector ) {

    describe( 'engineDetector/engineDetector', function() {


        it( 'should load without blowing', function() {

            expect( engineDetector ).to.exist

        } )

        it( 'should have ifNode and ifBrower function defined', function() {

            expect( engineDetector.ifNode ).to.exist
            expect( engineDetector.ifBrowser ).to.exist

        } )

        it( 'should detect well browser and node', function() {

            var isNode = typeof module !== 'undefined',
                isBrowser = typeof window !== 'undefined',
                ifNodeCalled = false,
                ifBrowserCalled = false;

            engineDetector.ifNode( function() {
                ifNodeCalled = true
            } )

            engineDetector.ifBrowser( function() {
                ifBrowserCalled = true
            } )

            if ( isNode ) {

                expect( engineDetector.isNode ).to.be.true
                expect( ifNodeCalled ).to.be.true
            } else if ( isBrowser ) {
                expect( engineDetector.isBrowser ).to.be.true
                expect( ifBrowserCalled ).to.be.true
            }

            describe( 'requirejs plugins ifEngineIsNode, ifEngineIsBrowser', function() {

                before( function( done ) { // dirty hack
                    try {

                        require( [ 'ifEngineIsBrowser!test/browser-required', 'fakeWindowOnNode!test/browser-required' ], function( browserRequired ) {


                            done()
                        } )
                    } catch ( e ) {
                        console.log( 'eroor the first time motherfucker' ) // fix me !
                        done()
                    }

                } )

                it( 'should not blow when ifEngineIsBrowser is asked', function( done ) {


                    var called = 0

                    require( [ 'ifEngineIsBrowser!test/browser-required' ], function( browserRequired ) {


                        called++
                        engineDetector.ifNotBrowser( function() {

                            expect( browserRequired ).to.be.null

                        } )

                        engineDetector.ifBrowser( function() {

                            expect( browserRequired.loaded ).to.be.true

                        } )

                        done()

                    } )

                } )


                it( 'should not blow when requiring a node module on node ', function( done ) {


                    require( [ 'ifEngineIsNode!test/node-required' ], function( nodeRequired ) {


                        engineDetector.ifNotNode( function() {

                            expect( nodeRequired ).to.be.null


                        } )

                        done()

                    } )

                } )



                it( 'should not blow when requiring a node module on node ', function( done ) {


                    require( [ 'ifEngineIsNode!test/node-required' ], function( nodeRequired ) {

                        engineDetector.ifNode( function() {

                            expect( nodeRequired.loaded ).to.be.true

                        } )

                        done()

                    } )

                } )

                describe( 'window module', function() {

                    it( 'should return window global on browser and a fake jsdom window on node', function( done ) {

                        if ( engineDetector.isBrowser ){ // does not pass on mocha - phantomjs but pass in the browser ??  JSON.stringify cannot serialize cyclic structures.
                            done()
                            return 
                        } 
                            

                        require( [ './window' ], function( fakeWindow ) {

                            expect( fakeWindow ).to.exist
                            expect( fakeWindow.document ).to.exist
                            done()

                        } )

                    } )

                } )

            } )

        } )



        // describe( 'requirejs plugins fakeWindowOnNode', function() {

        //     it( 'should load module which require browser on node', function( done ) {


        //         before( function( done ) { // dirty hack
        //             try {

        //                 require( [ 'fakeWindowOnNode!test/browser-required' ], function( browserRequired ) {


        //                     done()
        //                 } )
        //             } catch ( e ) {
        //                 console.log( 'eroor the first time motherfucker' ) // fix me !
        //                 done()
        //             }

        //         } )

        //         require( [ 'fakeWindowOnNode!test/browser-required' ], function( browserRequired ) {

        //             engineDetector.ifNode( function() {

        //                 expect( browserRequired.loaded ).to.be.true
        //             } )

        //             engineDetector.ifNotNode( function() {

        //                 expect( browserRequired.loaded ).to.be.true

        //             } )

        //             done()
        //         } )

        //     } )

        // } )

    } )

} )