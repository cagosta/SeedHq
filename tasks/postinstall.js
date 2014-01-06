module.exports = function( grunt ) {

    var bower = require( 'bower' )

    grunt.registerTask( 'bower_install', function() {
        var done = this.async()
        bower.commands.install([]).on('end', function( ){
            done()
        })
    } )

    grunt.registerTask( 'postinstall', 'Install mocha && mocha phantomjs globally with npm -g', [
        'bower_install',
        'inject_rjsconfig'
    ] )


}