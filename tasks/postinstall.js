module.exports = function( grunt ) {

    var bower = require( 'bower' )

    grunt.config.set( 'exec.npminstall_phantomjs', {
        command: 'if ! hash phantomjs 2>/dev/null; then sudo npm install -g phantomjs; fi;'
    } )

    grunt.config.set( 'exec.npminstall_mochaphantomjs', {

        command: 'if ! hash mocha-phantomjs 2>/dev/null; then sudo npm install -g mocha-phantomjs; fi;'

    } )

    grunt.registerTask( 'bower_install', function() {
        var done = this.async()
        bower.commands.install([]).on('end', function( ){
            done()
        })
    } )

    grunt.registerTask( 'postinstall', 'Install mocha && mocha phantomjs globally with npm -g', [
        'bower_install',
        'exec:npminstall_phantomjs',
        'exec:npminstall_mochaphantomjs',
        'inject_rjsconfig'
    ] )


}