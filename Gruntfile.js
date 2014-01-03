'use strict'


var GruntInitializer = function( o ) {
    this.grunt = o.grunt
    this.initiliazeConfig()
    this.initializeGrunt( )
    this.loadGruntDependencies()
    this.loadTasks()
}

GruntInitializer.prototype = {

    initiliazeConfig: function() {
        this.moduleConfig = this.grunt.file.readJSON( './config.json' )
        this.packageConfig = this.grunt.file.readJSON( './package.json' )
        this.config = this.moduleConfig
        for ( var i in this.packageConfig ) // extend module config with package.json
            if ( this.packageConfig.hasOwnProperty( i ) )
                if ( !this.config[ i ])
                    this.config[ i ] = this.packageConfig[ i ]
    },

    loadGruntDependencies: function() {
        require( 'matchdep' ).filter( 'grunt-*' ).forEach( this.grunt.loadNpmTasks )
    },

    initializeGrunt: function() {

        this.grunt.initConfig( {

            config: this.config

        } )
    },

    loadTasks: function() {
        this.grunt.loadTasks( 'tasks' )
    }

}


module.exports = function( grunt ) {

    new GruntInitializer( {
        grunt: grunt
    } )

}