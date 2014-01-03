module.exports = function( grunt ) {


    grunt.config.set( 'exec.headless_test', {

        command: 'mocha-phantomjs test/index.html'

    } )

    grunt.config.set( 'exec.node_test', {

        command: 'node test/test_main.js'

    } )

    grunt.registerTask( 'test:headless', 'Run tests in the browser', [
        'exec:headless_test'
    ] )

    grunt.registerTask( 'test:node', 'Run tests with node', [
        'exec:node_test'
    ] )

    grunt.registerTask( 'test:all', 'Run tests in all environements', [
        'test:browser',
        'test:node',
        'test:headless'
    ] )


    grunt.registerTask( 'test:browser', 'Run tests with phantomjs', [
        'inject_rjsconfig',
        'open:test_page'
    ] )

    grunt.registerTask( 'test', function( options ) {

        options = options ||  'headless'

        grunt.task.run( [ 'test:' + options ] )

    } )

}