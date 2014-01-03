module.exports = function( grunt ) {

    var lrSnippet = require( 'connect-livereload' )( {
            port: grunt.config.get('config.livereloadPort'),
        } ),
        mountFolder = function( connect, dir ) {
            return connect.static( require( 'path' ).resolve( dir ) )
        };

    grunt.config.set( 'connect', {

        options: {
            port: 9000,
            hostname: 'localhost' // change this to '0.0.0.0' to access the server from outside
        },

        livereload: {
            options: {
                middleware: function( connect ) {
                    return [
                        lrSnippet,
                        mountFolder( connect, '.' )
                        ]
                }
            }
        }
    } )

}