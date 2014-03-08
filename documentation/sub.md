### What is sub ?

Sub let you instanciate sub-instance, so when the parent object is destroyed, sub-objects are destroyed too.

    var File = S.extend({
      options : {
        title : 'untilted'
      }
    });
    
    var Computer = S.extend({
      /* computer stuff */
    });
    
    var c = new Computer();
    var f = c.sub(File, { title : 'Banana.js' });
    
    // when i destroy the computer, the file is destroyed with it
    c.destroy();

#### Going further with sub
Same example as before but we can, in a elegant way, using Seed's subParams method, manage a reference between computer and file

    var File = S.extend({
      options : {
        title : 'untilted',
        computer : null
      },
      
      '+constructor' : function() {
        this.computer.files.push(this);
      },
      
      '+destroy' : function() {
        this.computer.files.remove(this);
      }
    });
    
    var Computer = S.extend({
      options : {
        files : []
      },
      
      /* computer stuff */
      // subParams function can be extended
      '+subParams' : function() {
        return { computer : this };
      }
    });
    
    var c = new Computer();
    var f = c.sub(File, { /* constructor options*/ });
    
    // we now have references
    f.computer
    computer.files 
