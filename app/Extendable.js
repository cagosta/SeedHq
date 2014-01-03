define( [
    './helpers',
    './extendHooker',
    './extendHookRegistrations'
 ], function( _ , extendHooker, hookList ) {


    /**
     * This is the basic extendable element, it is used by fjs.View, fjs.Controller and others ...
     * It allows user to specifies '+_String:methodName_' to augment set the + method of the prototype of the new element with the defined method
     * if A is extended and A has a method named 'some_random_method',
     * if you do B = A.extend({
     *  '+some_random_method' : add
     * })
     * B.some_random_method <=> function() {
     *  A.prototype.some_random_method();
     *  add();
     * }
     * @export Seed/Extendable


     */
    var Extendable = function( ) {};

    /**
     * Initialize an object
     *
     * @this {Extendable}
     * @param {Object} configuration Object
     */

    Extendable.prototype.constructor = function( ) {};

    // here we hookify Extendable
    
    extendHooker.hookify( Extendable )
    for ( var i = 0; i < hookList.length; i++ ){
        Extendable.registerHook( hookList[i] )
    }

    /**
     * Call init function from the cstructor signleton scope, useful to add custom afterNew/beforeNew callbacks
     *
     * @param {object} inst The instance scope
     * @param {array} args arguments
     */

    Extendable[ 'new' ] = function( inst, args ) {
        
    };




    /**
     * Singleton extend with +/- convention
     *
     * @private
     * @param {Object} basicObj configuration key-value object with +/-key
     * @returns {Object} extObj
     *
     */

    var extendCstr = function( basicObj, extObj ) {

        var Res;
        Res = function( o ) {
            Res[ 'new' ].call( Res, this, arguments );
        };

        var attrs = _.extend( {}, basicObj, pm( basicObj, extObj ) );

        for ( var i in attrs )
            if ( attrs.hasOwnProperty( i ) ) {
                Res[ i ] = attrs[ i ];
            }

        return Res;
    };



    /**
     * Extend a Constructor with +/- convention
     *
     * @public
     * @param {Object} obj configuration key-value object with '+key' or '-key'
     *
     */


    Extendable.extend = function( obj ) {

        var C = function( o ) {
            // C[ 'new' ].call( C, this, arguments );
            // ( typeof( args[ 0 ] ) !== 'boolean' || args[ 0 ] !== false ) && this.constructor.apply( this, arguments );
            ( typeof( arguments[ 0 ] ) !== 'boolean' || arguments[ 0 ] !== false ) && ( C.prototype.constructor).apply( this, arguments );
        };


        //copy constructor ownProperty (i.e. extend and new)
        var attrs = _.clone( this );

        for ( var i in attrs )
            if ( attrs.hasOwnProperty( i ) ) {
                C[ i ] = attrs[ i ];
            }

        var hooks = Extendable.__hooks,
            hooked = _.extend( new this( false ), obj )

            for ( var i = 0; i < hooks.length; i++ ) {
                hooked = hooks[ i ].handle( hooked, obj )
            }

        C.prototype = hooked
        // C.prototype = extend(new this(false), pm(this.prototype, obj));

        return C;
    };

    return Extendable;

} );