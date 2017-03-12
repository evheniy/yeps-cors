# YEPS CORS

YEPS Cross-Origin Resource Sharing (CORS)

[![NPM](https://nodei.co/npm/yeps-cors.png)](https://npmjs.org/package/yeps-cors)

[![npm version](https://badge.fury.io/js/yeps-cors.svg)](https://badge.fury.io/js/yeps-cors)
[![Build Status](https://travis-ci.org/evheniy/yeps-cors.svg?branch=master)](https://travis-ci.org/evheniy/yeps-cors)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-cors/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-cors?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-cors/master.svg?label=linux)](https://travis-ci.org/evheniy/)
[![Windows Build](https://img.shields.io/appveyor/ci/evheniy/yeps-cors/master.svg?label=windows)](https://ci.appveyor.com/project/evheniy/yeps-cors)

[![Dependency Status](https://david-dm.org/evheniy/yeps-cors.svg)](https://david-dm.org/evheniy/yeps-cors)
[![devDependency Status](https://david-dm.org/evheniy/yeps-cors/dev-status.svg)](https://david-dm.org/evheniy/yeps-cors#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-cors)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-cors/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-cors.svg)](https://github.com/evheniy/yeps-cors/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-cors.svg)](https://github.com/evheniy/yeps-cors/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-cors.svg)](https://github.com/evheniy/yeps-cors/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-cors.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


## How to install

  npm i -S yeps-cors
  
## How to use

app.js

    const http = require('http');
    const App = require('yeps');
    const Router = require('yeps-router');
    const logger = require('yeps-logger');
    const error = require('yeps-error');
    
    const cors = require('yeps-cors');
    
    const app = new App();
    const router = new Router();
    
    app.all([
        logger(),
        error(),
        cors()
    ]);
    
    router.get('/url').then(async ctx => {
        ctx.res.writeHead(200);
        ctx.res.end(data); 
    });
    
    app.then(router.resolve());
    
    http
        .createServer(app.resolve())
        .listen(parseInt(process.env.PORT || '3000', 10));
        
Run app (node.js > 7.6.0):

    node app.js


## Links

* [yeps](https://github.com/evheniy/yeps) - YEPS
* [yeps-promisify](https://github.com/evheniy/yeps-promisify) - YEPS kernel
* [yeps-benchmark](https://github.com/evheniy/yeps-benchmark) - performance comparison koa2, express and node http
* [yeps-router](https://github.com/evheniy/yeps-router) - YEPS promise based router
* [yeps-error](https://github.com/evheniy/yeps-error) - YEPS 404/500 error handler
* [yeps-redis](https://github.com/evheniy/yeps-redis) - YEPS promise based redis client
* [yeps-mysql](https://github.com/evheniy/yeps-mysql) - YEPS promise based mysql client
* [yeps-boilerplate](https://github.com/evheniy/yeps-boilerplate) - YEPS app boilerplate
* [yeps-express-wrapper](https://github.com/evheniy/yeps-express-wrapper) - YEPS express wrapper
* [CORS](https://developer.mozilla.org/en/docs/Web/HTTP/Access_control_CORS) - MDN documentation
     
     
