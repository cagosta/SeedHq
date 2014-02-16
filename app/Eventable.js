define( [
    './Extendable',
    './helpers'
], function( Extendable, _ ) {

    /**
     * For publishing events
     * @export Seed/Eventable
     */

    return Extendable.extend( {

        constructor: function() {

            this._events = {}
            this._attached = []

        },

        /**
         * Publisher method, emit an event
         *
         * @public
         * @param {string} eventName
         * @param {..} [arguments] the arguments to pass through the event pipe
         *
         */

        emit: function( eventName ) {

            var evs = this._events[ eventName ]
            if ( evs ) {
                var args = Array.prototype.slice.call( arguments, 1 )

                // last subscribe is the first to be called
                for ( var i = evs.length; i--; ) {
                    //TODO profiling to this line 
                    evs[ i ].fn.apply( evs[ i ].subscriber, args )
                    //evs[i](args[0], args[1], args[2], args[3])
                }
            }

        },

        // emit alias, for retro compatibility
        fire: function() {

            this.emit.apply( this, arguments )

        },

        /**
    * Publisher method, Subscribe to an event
    *
    * Note : it's important to provide an subscriber object to detach the event when the subscriber is destroyed, else you may have issues to destroy events
    *
    * @public
    * @param {String} eventName '*' means 'all', subsribe multi events with 'evt1 evt2 ...'
    * @param {Object|Function} subscriber if Object, the subscriber instance else the function to attach
    * @param {String|Function|Object} [functionPointer='subscriber.'on'+eventName'] if the subscriber is an object, a string pointes to subscriber method, a function would be executed in the subscriber scope
    * @returns {Object} subscription 
    *
    * @example 
    // call subscriber.onStart when publisher emit 'start'
    var sub = publisher.on('start', subscriber) 

    sub.un() // stops the subscription

    // call subscriber.onStart when publisher emit 'start' and subscriber.onEnd when publisher emit 'end'
    publisher.on('start end', subscriber)

    // call subscriber.onPublisherStart when publisher emit 'start'
    publisher.on('start', subscriber, 'onPublisherStart') 

    // call fn in the subscriber scope
    publisher.on('start', subscriber, fn) 

    // call fn in the subscriber scope (equivalent to previous), use for more compatibility with classic use
    publisher.on('start', fn, subscriber)

    // call fn when publisher emit start, use with caution when you'll never want to detach event at any destroy
    publisher.on('start', fn) 

    */

        on: function( eventName, subscriber, fn ) {

            var evts = eventName.split( ' ' )

            // multimorph API handling
            if ( typeof( subscriber ) === 'function' ) {
                var oldFn = fn
                fn = subscriber
                subscriber = oldFn
            }

            // multi events handling
            if ( evts.length === 1 ) {
                return this._on( evts[ 0 ], subscriber, fn )
            } else {

                var ons = []
                for ( var i = 0; i < evts.length; i++ ) {
                    ons[ i ].push( this._on( evtName, subscriber, fn ) )
                }

                return {
                    un: function() {

                        for ( var i = 0; i < ons.length; i++ ) {
                            ons[ i ].un()
                        }
                    }
                }
            }

        },

        /**
         * @private
         */

        _on: function( eventName, subscriber, f ) {

            // subscriber format validation
            if ( subscriber && typeof( subscriber.attach ) !== 'function' ) {
                throw new Error( 'The subscriber should have a attach(event) method' )
                return
            }

            // fn multimorphism handling
            if ( typeof( f ) === 'string' ) {
                f = subscriber[ f ]
            } else if ( typeof( f ) === 'undefined' ) {
                f = subscriber[ 'on' + _.capitalize( eventName ) ]
            }

            if ( typeof( f ) !== 'function' ) {
                throw new Error( 'Cannot find the function to subscribe to ' + eventName )
                return
            }

            var _this = this,
                subObj = {
                    fn: f,
                    subscriber: subscriber
                },
                ret = {
                    un: function() {

                        _this._rmSubscription( eventName, subObj )
                    }
                };

            // subscriber.attach( ret )


            ( this._events[ eventName ] || ( this._events[ eventName ] = [] ) ).push( subObj )

            return ret

        },

        /**
         * Publisher method, Remove a Subscription, private, use subscription.un()
         *
         * @private
         * @param {string} eventName
         * @param {object} subscription object
         *
         */

        _rmSubscription: function( eventName, subObj ) {

            _.remove( this._events[ eventName ], subObj )
            if ( this._events[ eventName ].length == 0 ) {
                delete this._events[ eventName ]
            }

        },

        /**
         *  Subscriber method
         *  Attach a subscription to this
         *  @param {object} subscription
         */

        attach: function( subscription ) {

            this._attached.push( subscription )

        },

        /**
         *  Subscriber method
         *  Detach all subscription
         */

        detachAll: function() {

            for ( var i = 0; i < this._attached.length; i++ ) {
                this._attached[ i ].un()
            }
            this._attached = []
        }
    } )

} )