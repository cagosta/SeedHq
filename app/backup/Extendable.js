define( [
    './helpers',
    './plugger',
], function( _, plugger ) {


    /**
     * This is the basic extendable element, it is used by fjs.View, fjs.Controller and others ...
     * It allows user to specifies '+_String:methodName_' to augment set the + method of the prototype of the new element with the defined method
     * if A is extended and A has a method named 'some_random_method',
     * if you do B = A.extend({
     *  '+some_random_method' : add
     * })
     * B.some_random_method <=> function() {

     *  A.prototype.some_random_method()
     *  add()
     * }
     * @export Seed/Extendable
     
     
     */
    var Extendable = function( conf ) {

        conf = conf ||  {}

        this._seedPlugins = conf.plugins ||  []

    }

    Extendable._seedPlugins = []

    Extendable.getSeedPlugins = function() {

        return this._seedPlugins

    }


    /**
     * Initialize an object
     *
     * @this {Extendable}
     * @param {Object} configuration Object
     */

    Extendable.prototype.constructor = function() {}

    /**
     * Call init function from the cstructor signleton scope, useful to add custom afterNew/beforeNew callbacks
     *
     * @param {object} inst The instance scope
     * @param {array} args arguments
     */


    Extendable.use = function( o ) {

        return Extendable( o )

    }



    /**
     * Extend a Constructor with +/- convention
     *
     * @public
     * @param {Object} obj configuration key-value object
     *
     */



    Extendable.extend = function( extension ) {

        var attrs, Constructor;

        Class = function( o ) {

            if ( typeof( arguments ) !== 'boolean' || arguments[ 0 ] !== false ) {
                ( Class.prototype.constructor ).apply( this, arguments )
            }

        }

        attrs = _.clone( this )

        _.extend( Class, attrs )

        // for ( var i in attrs )
        //     if ( attrs.hasOwnProperty( i ) )
        //         Constructor[ i ] = attrs[ i ]
        //         
        // var hooks = Extendable.__hooks,
        //     hooked = _.extend( new this( false ), obj )

        //     for ( var i = 0 i < hooks.length i++ ) {
        //         hooked = hooks[ i ].handle( hooked, obj )
        //     }
        Class.prototype = _.extend( {}, new this( false ), extension )
        // C.prototype = extend(new this(false), pm(this.prototype, obj))

        return Class

    }

    return Extendable

} )