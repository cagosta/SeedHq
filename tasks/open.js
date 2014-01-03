module.exports = function( grunt ) {


    grunt.config.set( 'open', {

        server_index: {
            path: 'http://localhost:<%= connect.options.port %>'
        },

        test_page: {
            path: 'http://localhost:<%= connect.options.port %>/test'
        },

        host: {
            path: 'http://<%= config.deploy.host %>'
        }

    } )

}