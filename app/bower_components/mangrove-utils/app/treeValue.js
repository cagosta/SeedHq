define( function() {

    return function( string, scope ) {
        var tree = string.split( '.' ),
            value = scope;
        for ( var i = 0, n = tree.length; i < n; i++ ) {
            var lastChar = tree[ i ].charAt( tree[ i ].length - 1 );
            if ( lastChar === ')' ) {
                var fnName = tree[ i ].substr( 0, tree[ i ].indexOf( '(' ) );
                value = value[ fnName ]();
            } else if ( lastChar === ']' ) {
                var valueName = tree[ i ].substr( 0, tree[ i ].indexOf( '[' ) );
                value = value[ fnName ];
            } else {
                value = value[ tree[ i ] ];
            }
            if ( !value ) break;
        }
        return value || null;
    };

} );