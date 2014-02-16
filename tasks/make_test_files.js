var TestFileMaker = function( o ) {


    this.force = true


    this.grunt = o.grunt

    this.moduleName = this.grunt.mangroveConfig.get( 'name.raw' )

    this.filePath = o.filePath
    this.targetFolder = o.targetFolder
    this.template = o.template

    this.path = require( 'path' )
    this.mkdirp = require( 'mkdirp' )
    this.fs = require( 'fs' )


    this.source = {
        path: this.filePath,
        dirname: this.path.dirname( this.filePath ),
        extension: this.path.extname( this.filePath )
    }

    this.setSource( 'basename', this.path.basename( this.filePath, this.getSource( 'extension' ) ) )

    this.target = {
        folder: this.targetFolder,
        basename: this.getSource( 'basename' ) + 'Test',
        dirname: this.targetFolder + '/' + this.getSource( 'dirname' )
    }


    this.setTarget( 'path', [
        this.getTarget( 'dirname' ),
        this.getTarget( 'basename' ) + this.getSource( 'extension' )
    ].join( '/' ) )

    this.setTarget( 'exists', this.fs.existsSync( this.getTarget( 'path' ) ) )


    this.setTarget( 'modulePath', this.moduleName + '/' + this.getSource( 'path' ).replace( '.js', '' ).replace( 'app/', '' ) )
    this.setTarget( 'moduleName', this.getSource( 'basename' ) )

    this.setTarget( 'file', this.template
        .replace( /<%= modulePath %>/g, this.getTarget( 'modulePath' ) )
        .replace( /<%= moduleName %>/g, this.getTarget( 'moduleName' ) )
    )

    this.setTarget( 'testModulePath', this.getTarget( 'folder' ) + '/' + this.getTarget( 'modulePath' ) + 'Test' )

    if ( this.getTarget( 'exists' ) )
        if ( !this.force )
            return

        // this.log()
    this.write()

}

TestFileMaker.prototype = {


    log: function() {

        console.log( '<< Source' )
        console.log( this.source )
        console.log( '<< Target' )
        console.log( this.target )

    },

    mkdir: function() {

        this.mkdirp.sync( this.getTarget( 'dirname' ) )

    },

    write: function() {

        this.mkdir()
        this.fs.writeFileSync( this.getTarget( 'path' ), this.getTarget( 'file' ) )

    },

    getTarget: function( label ) {

        return this.target[  label ]

    },

    setTarget: function( label, value ) {

        return this.target[ label ] = value

    },

    setSource: function( key, value ) {

        return this.source[  key ] = value

    },

    getSource: function( key ) {

        return this.source[  key ]

    }


}


var TestFilesMaker = function( o ) {

    this.grunt = o.grunt
    this.task = o.task
    this.async = this.task.async()

    this.initDependencies()

    this.fileMakers = []

    this.loadTemplate()

    this.targetFolder = 'test'
    this.ignores = [ '.git', 'dist', 'documentation', 'tasks', 'testStructure', 'bower_components', 'assets' ]



    this.appFinder = this.findit( 'app' )
    this.initEvents()

}


TestFilesMaker.prototype = {

    initDependencies: function() {

        this.findit = require( 'findit' )
        this.fs = require( 'fs' )
        this.path = require( 'path' )

    },

    loadTemplate: function() {

        this.template = this.fs.readFileSync( 'test/test.js.template', 'utf-8' )

    },


    initEvents: function() {

        this.appFinder.on( 'directory', this.onDirectory.bind( this ) )
        this.appFinder.on( 'file', this.onFile.bind( this ) )
        this.appFinder.on( 'link', this.onLink.bind( this ) )
        this.appFinder.on( 'end', this.onEnd.bind( this ) )

    },

    onDirectory: function( dir, stat, stop ) {

        var base = this.path.basename( dir );

        if ( this.ignores.indexOf( base ) !== -1 )
            stop()


    },

    onFile: function( file, stat ) {

        if ( /main.js/.test( file )  || /dashux.js/.test( file ) )
            return

        if ( !/.js/.test( file ) ) // only js!
            return

        if ( /json/.test( file ) ) // oops
            return

        this.fileMakers.push(
            new TestFileMaker( {
                filePath: file,
                grunt: this.grunt,
                targetFolder: this.targetFolder,
                template: this.template
            } )
        )

    },

    onLink: function( link, stat ) {

        // console.log( link )

    },

    listPaths: function() {

        this.paths = []

        this.fileMakers.forEach( function( fileMaker, i ) {

            this.paths.push( fileMaker.getTarget( 'modulePath' ) )

        }.bind( this ) )

    },

    writePaths: function() {

        this.fs.writeFileSync( 'test/tests.json', JSON.stringify( this.paths, null, '\t' ) )

    },

    onEnd: function() {

        this.listPaths()
        this.writePaths()

    }

}



module.exports = function( grunt ) {

    grunt.registerTask( 'make_test_files', function() {

        new TestFilesMaker( {
            grunt: grunt,
            task: this
        } )

    } )

}