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

    const App = require('yeps');
    const Router = require('yeps-router');
    
    const error = require('yeps-error');
    const logger = require('yeps-logger');
    const server = require('yeps-server');
    
    const cors = require('yeps-cors');
    
    const app = new App();
    const router = new Router();
    
    app.all([
        error(),
        logger(),
        cors(),
    ]);
    
    router.get('/url').then(async (ctx) => {
        ctx.res.statusCode = 200;
        ctx.res.end(data); 
    });
    
    app.then(router.resolve());
    
    server.createHttpServer(app);


## Config

### {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header

    cors({ origin: '*' });
    
    cors({
        origin(ctx) {
            return ctx.req.url !== '/forbin' ? '*' : false;
        },
    });
    
### {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'

    cors({
        allowMethods: 'GET',
    });

    cors({
        allowMethods: ['GET', 'POST'],
    });
                
    cors({
        allowMethods: null,
    });

### {String|Array} exposeHeaders `Access-Control-Expose-Headers`
    
    cors({
        exposeHeaders: 'content-length',
    });
    
    cors({
        exposeHeaders: ['content-length', 'x-header'],
    });
    
### {String|Array} allowHeaders `Access-Control-Allow-Headers`
    
    cors({
        allowHeaders: 'X-PINGOTHER',
    });
                
    cors({
        allowHeaders: ['X-PINGOTHER'],
    });

### {String|Number} maxAge `Access-Control-Max-Age` in seconds

    cors({
        maxAge: 3600,
    });
                    
    cors({
        maxAge: '3600',
    });

### {Boolean} credentials `Access-Control-Allow-Credentials`

    cors({
        credentials: true,
    });
                

#### [YEPS documentation](http://yeps.info/)   
