# mangrove-utils  
[![Build Status](https://secure.travis-ci.org/cagosta/mangrove-utils.png?branch=master)](https://travis-ci.org/cagosta/mangrove-utils)


## Introduction ##

A collection of useful javascript helpers, again.

## Helpers ##

Helpers are atomised in AMD modules.  
You can find them all in an object at 'mangrove-utils/mangrove-utils'

*  clone
*  eachKey
*  enumerate
*  extend 
*  hardClone
*  is
*  isArray
*  merge
*  objectify
*  serialize
*  treeValue

And you can find dom helpers at 'mangrove-utils/mangrove-utils/dom/all'

*  addEventListener
*  removeEventListener 
*  keyCodes  
*  ready  




## Demo ##
See [cagosta.github.io/mangrove-utils](http://cagosta.github.io/mangrove-utils) 

## Install ##

mangrove-utils is coded as [amd module](http://requirejs.org/docs/whyamd.html) but can be installed with npm, bower or old-fashioned src=".min.js".

#### With npm: ####

```
npm install mangrove-utils
```

and use it with nodejs: 
```
var mangroveUtils = require('mangrove-utils')
```

#### With bower: ####

``` 
bower install mangrove-utils
```

and use it with requirejs 

```javascript
require(['mangrove-utils/mangrove-utils'], function( mangroveUtils ){

})
```


#### With src=" .min.js" ####


Inside the `dist` folder, [download latest standalone minified version](https://raw.github.com/cagosta/mangrove-utils/master/dist/mangrove-utils-latest-standalone-min.js) or [development version](https://raw.github.com/cagosta/mangrove-utils/master/dist/mangrove-utils-latest-standalone.js) and include it in your html page:

```html
<script src="[path_to_source]/mangrove-utils-latest-standalone-min.js%>"></script>
```

The module is available via the scope 

```javascript
window.mangroveUtils
```


## To do ## 

* documentation 


## Documentation ##

See jsdoc-generated documentation in /documentation  

### Folder Structure ###

    app         ->  development files
    |- bower_components          ->  [bower](https://github.com/bower/bower) front-end packages
    |- main.js                   ->  main file for browser and node.js, handle AMD config
    |- mangrove_utils   -> main AMD module
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

