const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const srv = require('yeps-server');
const cors = require('..');

const { expect } = chai;

chai.use(chaiHttp);
let app;
let server;

describe('YEPS cors test', async () => {
  describe('default options', async () => {
    beforeEach(() => {
      app = new App();
      app.all([
        error(),
        cors(),
      ]);
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should not set `Access-Control-Allow-Origin` when request Origin header missing', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;

        ctx.res.statusCode = 200;
        ctx.res.end('test');
      });

      await chai.request(server)
        .get('/')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.be.equal('test');
          expect(res.headers['access-control-allow-origin']).is.undefined;
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should set `Access-Control-Allow-Origin` to request origin header', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;

        ctx.res.statusCode = 200;
        ctx.res.end('test');
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.be.equal('test');
          expect(res.headers['access-control-allow-origin']).to.be.equal('http://makedev.org');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should 204 on Preflight Request', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.headers['access-control-allow-origin']).to.be.equal('http://makedev.org');
          expect(res.headers['access-control-allow-methods']).to.be.equal('GET,HEAD,PUT,POST,DELETE,PATCH');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should not Preflight Request if request missing Access-Control-Request-Method', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should always set `Vary` to Origin', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.headers.vary).to.be.equal('Origin');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });
  });

  describe('options.origin=*', async () => {
    beforeEach(() => {
      app = new App();
      app.all([
        error(),
        cors({ origin: '*' }),
      ]);
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should always set `Access-Control-Allow-Origin` to *', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.headers['access-control-allow-origin']).to.be.equal('*');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });
  });

  describe('options.origin=function', async () => {
    beforeEach(() => {
      app = new App();
      app.all([
        error(),
        cors({
          origin(ctx) {
            return ctx.req.url !== '/forbin' ? '*' : false;
          },
        }),
      ]);
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should disable cors', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .get('/forbin')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.headers['access-control-allow-origin']).is.undefined;
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should set access-control-allow-origin to *', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.headers['access-control-allow-origin']).to.be.equal('*');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });
  });

  describe('options.exposeHeaders', async () => {
    beforeEach(() => {
      app = new App();
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should Access-Control-Expose-Headers: `content-length`', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          exposeHeaders: 'content-length',
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.headers['access-control-expose-headers']).to.be.equal('content-length');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should work with array', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          exposeHeaders: ['content-length', 'x-header'],
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.headers['access-control-expose-headers']).to.be.equal('content-length,x-header');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });
  });

  describe('options.maxAge', async () => {
    beforeEach(() => {
      app = new App();
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should set maxAge with number', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          maxAge: 3600,
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.headers['access-control-max-age']).to.be.equal('3600');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should set maxAge with string', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          maxAge: '3600',
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.headers['access-control-max-age']).to.be.equal('3600');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should not set maxAge on simple request', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          maxAge: '3600',
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.headers['access-control-max-age']).to.be.undefined;
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });
  });

  describe('options.credentials', async () => {
    beforeEach(async () => {
      app = new App();
      app.all([
        error(),
        cors({
          credentials: true,
        }),
      ]);
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should enable Access-Control-Allow-Credentials on Simple request', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.headers['access-control-allow-credentials']).to.be.equal('true');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should enable Access-Control-Allow-Credentials on Preflight request', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'DELETE')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.headers['access-control-allow-credentials']).to.be.equal('true');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });
  });

  describe('options.allowHeaders', async () => {
    beforeEach(() => {
      app = new App();
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should work with allowHeaders is string', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          allowHeaders: 'X-PINGOTHER',
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.headers['access-control-allow-headers']).to.be.equal('X-PINGOTHER');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should work with allowHeaders is array', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          allowHeaders: ['X-PINGOTHER'],
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.headers['access-control-allow-headers']).to.be.equal('X-PINGOTHER');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should set Access-Control-Allow-Headers to request access-control-request-headers header', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors(),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .set('access-control-request-headers', 'X-PINGOTHER')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.headers['access-control-allow-headers']).to.be.equal('X-PINGOTHER');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });
  });

  describe('options.allowMethods', async () => {
    beforeEach(() => {
      app = new App();
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should work with allowMethods is string', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          allowMethods: 'POST',
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.headers['access-control-allow-methods']).to.be.equal('POST');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should work with allowMethods is array', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          allowMethods: ['GET', 'POST'],
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.headers['access-control-allow-methods']).to.be.equal('GET,POST');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should skip allowMethods', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors({
          allowMethods: null,
        }),
      ]);

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.end();
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .then((res) => {
          expect(res).to.have.status(204);
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });
  });

  describe('options.headersKeptOnError', () => {
    beforeEach(() => {
      app = new App();
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should keep CORS headers after an error', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors(),
      ]);

      app.then(async () => {
        isTestFinished1 = true;
        throw new Error('Whoops!');
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .catch((err) => {
          expect(err).to.have.status(500);
          expect(err.response.headers['access-control-allow-origin']).to.be.equal('http://makedev.org');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });

    it('should not affect OPTIONS requests', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;

      app.all([
        error(),
        cors(),
      ]);

      app.then(async () => {
        isTestFinished1 = true;
        throw new Error('Whoops!');
      });

      await chai.request(server)
        .options('/')
        .set('Origin', 'http://makedev.org')
        .set('Access-Control-Request-Method', 'PUT')
        .send()
        .catch((err) => {
          expect(err).to.have.status(500);
          expect(err.response.headers['access-control-allow-origin']).to.be.equal('http://makedev.org');
          isTestFinished2 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
    });
  });

  describe('other middleware has been set `Vary` header to Accept-Encoding', () => {
    beforeEach(() => {
      app = new App();
      server = srv.createHttpServer(app);
    });

    afterEach(() => {
      server.close();
    });

    it('should append `Vary` header to Origin', async () => {
      let isTestFinished1 = false;
      let isTestFinished2 = false;
      let isTestFinished3 = false;

      app.then(async (ctx) => {
        isTestFinished1 = true;
        ctx.res.setHeader('Vary', 'Accept-Encoding');
      });
      app.all([
        error(),
        cors(),
      ]);

      app.then(async (ctx) => {
        isTestFinished2 = true;
        ctx.res.end('');
      });

      await chai.request(server)
        .get('/')
        .set('Origin', 'http://makedev.org')
        .send()
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.headers.vary).to.be.equal('Accept-Encoding, Origin');
          isTestFinished3 = true;
        });

      expect(isTestFinished1).is.true;
      expect(isTestFinished2).is.true;
      expect(isTestFinished3).is.true;
    });
  });
});
