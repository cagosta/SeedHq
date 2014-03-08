# SeedHq  
[![Build Status](https://secure.travis-ci.org/cagosta/SeedHq.png?branch=master)](https://travis-ci.org/cagosta/SeedHq)


## Introduction

Elegant customizable inheritance, attributes and events in JavaScript.
 
*   **inheritance**, `Seed.extend` and the `'+method'` convention help you inherit fast and easily, see [Extend with Seed.js](documentation/Extendable.md)
*   **attributes**, with easy and flexible `options` keyword, see [Manage attributes with 'options'](documentation/options.md)
*   **events** and **subscriptions**, to avoid object persistance due to dirty event subscriptions see [Use events](SeedHq/blob/master/documentation/Events.md)
*   **sub**, build a sub object of a parent one see [What is it sub ?](documentation/sub.md)


## Basic Usage


### Extend your own Constructors 

```js
    var Fruit = S.extend({
      options : {
        // by default the fruit is Tasty
        isTasty : true,
        //and no one owns it
        owner : null
      },
      
      // i like to taste any fruit
      taste : function() {
        console.log('I like to taste a fruit');
      },
      
      dump : function() {
        return {
          objectType :  'a fruit'
        }
      }
    });
    
    var Banana = Fruit.extend({
      // by default the banana is owned by a banana eater and is yellow
      '+options' : {
        owner : 'banana eater',
        color : 'yellow'
      },
      
      // but the taste of the banana depends if it tasty
      '+taste' : function() {
        console.log(this.isTasty ? 'GREAT' : 'beurk');
      },
      
      '+dump' : function() {
        return {
          color : this.color
        }
      }
    });
    
```

### Instanciate them

```
var oldBanana = new Banana({
  isTasty : false,
  color : 'black',
  owner : 'me'
});

// options are set as attributes in the instance
oldBanana.isTasty 
//=> false

// +taste in Banana is executed after taste in Fruit
oldBanana.taste();
// I like to test fruits
// beurk

var favoriteBanana = new r.Banana();

favoriteBanana.taste(); 
// I like to test fruits
// GREAT

favoriteBanana.dump();
//=> { color : 'yellow', objectType : 'a fruit'}

```

## More infos/usages

Seed.js is a package of 4 little Tools :
*    **Extendable**, (in SeedHq/Extendable), extend objects protoypes gracefully with +/- convention see [Extend with Seed.js](documentation/Extendable.md)
*    **Eventable**, (in SeedHq/Eventable), emit and subscribe event properly, see [Use events](documentation/Eventable.md)
*    **options**, (in SeedHq), elegant attributes set. see [Manage attributes with 'options'](documentation/options.md)
*    **sub**, (in SeedHq), elegant attributes set [What is sub ?](documentation/sub.md)



## Demo ##
See [cagosta.github.io/Seed](http://cagosta.github.io/Seed) 

## Install ##

SeedHq is coded as [AMD module](http://requirejs.org/docs/whyamd.html) but can be installed with npm, bower or old-fashioned src=".min.js".

#### With npm: ####

```
npm install seedhq
```

and use it with nodejs: 
```
var Seed = require('seedgq')
```

#### With bower: ####

``` 
bower install Seed
```

Point `Seed` to `[bower_components_path]/SeedHq/app/Seed.js` into your requirejs path config 
and load it with requirejs:  

```javascript
require(['Seed/Seed'], function( Seed ){

})
```


#### With src=" .min.js" ####


Inside the `dist` folder, [download latest standalone minified version](https://raw.github.com/cagosta/SeedHq/master/dist/SeedHq-latest-standalone-min.js) or [development version](https://raw.github.com/cagosta/SeedHq/master/dist/SeedHq-latest-standalone.js) and include it in your html page:

```html
<script src="[path_to_source]/SeedHq-latest-standalone-min.js%>"></script>
```

The module is available via the scope 

```javascript
window.SeedHq
```

## To do ##

*  rewrite old tests with mocha  
*  document plugins

## Documentation ##

See jsdoc-generated documentation in /documentation  

### Folder Structure ###

    app         ->  development files
    |- bower_components          ->  bower front-end packages
    |- main.js                   ->  main file for browser and node.js, handle AMD config
    |- seed_hq   -> main AMD module
    test        ->  unit tests
    |
    tasks       -> grunt tasks, see [generator-mangrove-module](https://github.com/cagosta/generator-mangrove-module)
    |
    dist        ->  distribution & build files
    |
    node_modules -> node packages
    |
    documentation  -> [jsdoc](http://usejsdoc.org/about-jsdoc3.html) generated documentation 


## Run unit tests ##

#### On the browser ####

Run `grunt test:browser` and open `test/` on your browser.

#### On a headless browser ####

`grunt test:headless` will run your tests in a headless browser, with [phantomjs](http://phantomjs.org/) and [mocha](http://visionmedia.github.io/mocha/)

### On node ####

`grunt test:node` will run your tests with node and mocha.  

Because of requirejs, the `mocha` command does not work.


## Build your own ##

This project uses [Node.js](http://nodejs.org/), [Grunt](http://gruntjs.com/) and [Require.js](http://requirejs.org/docs/optimization.html) for the build process. If for some reason you need to build a custom version install Node.js, `npm install` and run:

    grunt build

## Yeoman Mangrove module Generator ##

This module is based on a [Yeoman](https://github.com/yeoman/yeoman/wiki/Getting-Started) generator: [Generator-mangrove-module](https://github.com/cagosta/generator-mangrove-module)  
Check it for task-related references such as build, deploy etc ..



## Authors 
* [Cyril Agosta](https://github.com/cagosta)
* [Sam Ton That](https://github.com/KspR)
* [Pierre Cole](https://github.com/piercus)



## License ##

[MIT License](http://www.opensource.org/licenses/mit-license.php)

