
### Eventable
The event system let you subscribe and emit event. Seed is both a publisher and a subscriber.
    // S a class inheriting from Seed
    
    // p is our publisher
    var p  = new S();

#### Subscribe with a subscriber
In a basic approach, an event is simply a publisher, an eventName and a function. It's true, (see [Subscribe just a function]), but when you do that, you might detach the subscription by hand when you don't need it.

Attach a subscriber, in practice is a good way to manage life-cycle of the subscription, to detach it. In short if your JavaScript is Object-Oriented with events, you will need to explicity attach the subscription to the subscriber.

With Seed.js it looks like 

    // subscribe an event, if exists 
    var S1 = S.extend({
      'onEvt1' : function() {
        /* code 0 , has to be called on evt1 */
      },
      
      'alsoOnEvt1' : function() {
        /* code 1, has to be called on evt1 */
      }
    });
    
    var s1 = new S1();
    
    // call s1.onEvt1 on 'evt1'
    p.on('evt1', s1);

    // call s1.alsoOnEvt1 on 'evt1'
    p.on('evt1', s1, 'alsoOnEvt1');
    
    // call /* custom code */ on 'evt1'
    p.on('evt1', s1, function(){ /* code 3, custom code */ });

The subscriber s1 is an object, that has chances to be destroyed
    // if we destroy s1, subscription will be detached
    s1.destroy();

#### Subscribe just a function

    p.on('evt1', function() {/* custom code */});

#### emit an event

    p.emit('evt1');
    
#### Detach
the detach function is useful just from the subscriber, cause the publisher do not know who is subscribing what event, else it would call functions explicitly.

    //detach all the events s1 subscribed
    s1.detachAll();
    
    //detach one subscription
    var subscription = p.on('evt2', s1);
    subscription.un();

