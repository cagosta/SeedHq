define( [
    'chai',
    'chai-as-promised',
    'sinonjs',
    'sinon-chai',
    'mocha',
    'mangrove-utils/bindPolyfill',
    'json!./tests.json'
], function( chai, chaiAsPromise, sinon, sinonChai, mocha, bind, tests ) {


    /**
     *
     * Manage mocha, requirejs, phantomjs, mocha-phantomsjs mess
     *
     * This is full of epic hack to have all of this working
     *
     * Careful, since requirejs is used, you cannot use the `mocha` command anymore.
     * Add your tests by append the r.js path in the ./test.json array
     *
     * To do: clean this
     *
     */



    var TestRunner = function() {

        this.testIds = tests

        this.initializeSuitePaths()



        this.detectExecutionEnvironment()
        this.initializeGlobal()
        this.initializeMocha()

        this.chai = chai
        this.chai.use( chaiAsPromise )
        this.chai.use( sinonChai )

        this.defineGlobals()

        this.requireSuites( this.onSuiteReady.bind( this ) )

    }

    TestRunner.prototype = {

        initializeSuitePaths: function() {

            this.suitePaths = []


            this.testIds.forEach( function( p, i ) {

                var path = p.split( '/' ),
                    testPath;

                testPath = 'test/app/' + path.slice( 1, path.length ).join( '/' ) + 'Test'
                this.suitePaths[ i ] = testPath

            }.bind( this ) )

        },

        initializeMocha: function() {

            this.mocha = mocha
            if ( this.isNode ) {
                var Mocha = require( 'mocha/index' )
                this.mocha = new Mocha( {
                    ui: 'bdd',
                    reporter: 'spec'
                } )
            }

        },

        onSuiteReady: function() {

            this.run()

        },

        run: function() {

            if ( this.global.mochaPhantomJS ) {
                this.global.mochaPhantomJS.run()
            } else
                this.mocha.run()

        },

        runTestSuite: function( testSuite ) {

            testSuite( this.config )

        },

        initializeGlobal: function() {

            if ( this.isBrowser ) {
                this.global = window
            } else if ( this.isNode ) {
                this.global = global
            }

        },

        defineGlobals: function() {

            this.global.expect = this.chai.expect
            this.global.expect = this.chai.expect
            if ( this.isNode ) {
                global.define = requirejs.define
            }

        },

        requireSuites: function( cb ) {

            this.mocha.suite.emit( 'pre-require', this.global, null, this )

            if ( this.isNode ) {
                this.addAllFiles()
            }


            require( this.suitePaths, function() {

                this.run()

            }.bind( this ) )

        },

        addAllFiles: function() {

            for ( var i = 0; i < this.suitePaths.length; i++ ) {
                this.addFile( this.suitePaths[ i ] )
            }

        },

        addFile: function( suitePath ) {

            this.mocha.addFile( this.getFullPath( suitePath ) )

        },

        getFullPath: function( suitePath ) {

            return suitePath

        },

        setTestSuites: function( t ) {

            this.testSuites = t

        },

        getMochaLayout: function() {

            return document.getElementById( 'mocha' )

        },

        detectExecutionEnvironment: function() {

            this.isBrowser = ( typeof window !== 'undefined' )
            this.isNode = !this.isBrowser
        }
    }

    return TestRunner


} )