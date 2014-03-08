## Extend with Seed.js
### +constructor Example
In good inheritance system, where constructor is the function called at object instanciation you often do this :

    var C2 = C.extend({
      constructor : function(o) {
        C.prototype.constructor.apply(this, arguments);
        /* some stuff 0 here */
      },
      
      method1 : function() {
        /* some stuff 1 here */
        C.prototype.method1.apply(this, arguments);
      }
    });

You can rewrite it and avoid repeating method names with Seed.js

     var C2 = C.extend({
       '+constructor' : function(o) {
         /* some stuff 0 here */
       },
       
       '-method1' : function() {
        /* some stuff 1 here */
      }
     });
 
It promote code-reuse between subClass and super class, the sub class do not know whet the super class do

### What does it returns

Without Seed.js, it would look like this : 

    var C2 = C.extend({
    
      method1 : function() {
        var before = /* some stuff 1 here */
        var after = C.prototype.method1.apply(this, arguments);
        return merge(before, after);
      },
      
      // or in the other way
      method2 : function() {
        var before = C.prototype.method2.apply(this, arguments);
        var after = /* some stuff 2 here */
        return merge(before, after);
      }
      
    });
    
equivalent to


     var C2 = C.extend({
       '-method1' : function(o) {
         return /* some stuff 1 here */
       },
       
       '+method2' : function() {
         return /* some stuff 2 here */
       }
     });

`merge(before, after)` apply the following rules :
*   if, between `after` and `before`, an object is undefined, return the other
*   if `before` and `after` are objects, merge objects
*   else return `after`

### With objects

Now `C` is having object in his prototype

    C.prototype.colors = {
      'grey' : '#888888',
      'black' : '#FFFFFF'
    };
    
You can do 

    var C2 = C.extend({
    
      colors : merge(C.prototype.colors, {
        white : '#000000'
      })
      
    });
Equivalent to 

     var C2 = C.extend({
    
      '+colors' : {
        white : '#000000'
      }
      
    });
