const debug = require('debug')('yeps:cors');
const vary = require('vary');

/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 * @returns {Function} cors middleware
 */
module.exports = (options = {}) => {
  debug('Options validation');
  debug(options);

  const defaults = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  options = Object.assign({}, defaults, options);

  if (Array.isArray(options.exposeHeaders)) {
    options.exposeHeaders = options.exposeHeaders.join(',');
  }

  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(',');
  }

  if (Array.isArray(options.allowHeaders)) {
    options.allowHeaders = options.allowHeaders.join(',');
  }

  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }

  options.credentials = !!options.credentials;

  return async (context) => {
    debug('Adding headers');
    debug(options);

    const requestOrigin = context.req.headers.origin;

    vary(context.res, 'Origin');

    if (!requestOrigin) {
      return Promise.resolve();
    }

    let origin;

    if (typeof options.origin === 'function') {
      origin = options.origin(context);

      if (!origin) {
        return Promise.resolve();
      }
    } else {
      origin = options.origin ? await options.origin : requestOrigin;
    }

    debug(`origin: ${origin}`);

    debug(context.req.method);

    if (context.req.method !== 'OPTIONS') {
      context.res.setHeader('Access-Control-Allow-Origin', origin);

      if (options.credentials === true) {
        context.res.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      if (options.exposeHeaders) {
        context.res.setHeader('Access-Control-Expose-Headers', options.exposeHeaders);
      }
    } else {
      if (!context.req.headers['access-control-request-method']) {
        return Promise.resolve();
      }

      context.res.setHeader('Access-Control-Allow-Origin', origin);

      if (options.credentials === true) {
        context.res.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      if (options.maxAge) {
        context.res.setHeader('Access-Control-Max-Age', options.maxAge);
      }

      if (options.allowMethods) {
        context.res.setHeader('Access-Control-Allow-Methods', options.allowMethods);
      }

      let { allowHeaders } = options;

      if (!allowHeaders) {
        allowHeaders = context.req.headers['access-control-request-headers'];
      }

      if (allowHeaders) {
        context.res.setHeader('Access-Control-Allow-Headers', allowHeaders);
      }

      context.res.statusCode = 204;
    }

    debug(context.res._headers);
    debug(context.res.statusCode);

    return Promise.resolve();
  };
};
