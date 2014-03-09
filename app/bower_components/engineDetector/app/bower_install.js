
var bower = require( 'bower' )
console.log('Installing bower dependencies ... ')

bower.commands.install([]).on('end', function( ){

    console.log('Installed bower dependencies.')
    
})