module.exports = function( grunt ){


    grunt.registerTask( 'server', [
        'build',
        'connect:livereload',
        'open:test_page',
        'watch'
    ] )


}