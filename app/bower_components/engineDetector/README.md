# engineDetector  
[![Build Status](https://secure.travis-ci.org/cagosta/engineDetector.png?branch=master)](https://travis-ci.org/cagosta/engineDetector)


## Introduction ##
An engine detector for javascript and related require-js plugins. Detect the engine (node, browser) used to run the current script.

## Usage ##

```js
var engine = require('enginedetector') ( or see installation below )
engine.isNode // boolean
engine.isBrowser // boolean

engine.ifNode(function( ){
    
    // called if node 

})

engine.ifNodeNode(function( ){
    
})

engine.ifBrowser(function( ){
    
})

engine.ifNotBrowser(function( ){
    

})

```


## Demo ##
See [cagosta.github.io/engineDetector](http://cagosta.github.io/engineDetector) 

## Install ##

engineDetector is coded as [AMD module](http://requirejs.org/docs/whyamd.html) but can be installed with npm, bower or old-fashioned src=".min.js".

#### With npm: ####

```
npm install enginedetector
```

and use it with nodejs: 
```
var engineDetector = require('enginedetector')
```

#### With bower: ####

``` 
bower install engineDetector
```

Point `engineDetector` to `[bower_components_path]/engineDetector/app/engineDetector.js` into your requirejs path config 
and load it with requirejs:  

```javascript
require(['engineDetector/engineDetector'], function( engineDetector ){

})
```


#### With src=" .min.js" ####


Inside the `dist` folder, [download latest standalone minified version](https://raw.github.com/cagosta/engineDetector/master/dist/engineDetector-latest-standalone-min.js) or [development version](https://raw.github.com/cagosta/engineDetector/master/dist/engineDetector-latest-standalone.js) and include it in your html page:

```html
<script src="[path_to_source]/engineDetector-latest-standalone-min.js%>"></script>
```

The module is available via the scope 

```javascript
window.engineDetector
```

## To do ##

* Use requirejs plugins and stabilize them
* Finish fakeWindowOnNode plugin


## Documentation ##

See jsdoc-generated documentation in /documentation  

### Folder Structure ###

    app         ->  development files
    |- bower_components          ->  [bower](https://github.com/bower/bower) front-end packages
    |- main.js                   ->  main file for browser and node.js, handle AMD config
    |- engine_detector   -> main AMD module
    test        ->  unit tests
    |
    tasks       -> [Grunt](http://gruntjs.com/) tasks, see [generator-mangrove-module](https://github.com/cagosta/generator-mangrove-module)
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


## Authors ##
* [Cyril Agosta](https://github.com/cagosta)


## License ##

[MIT License](http://www.opensource.org/licenses/mit-license.php)

