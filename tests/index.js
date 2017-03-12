const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const cors = require('..');
const expect = chai.expect;

chai.use(chaiHttp);
let app;

describe('YEPS cors test', async () => {

    beforeEach(() => {
        app = new App();
        app.all([
            error(),
            cors(),
        ]);
    });

    describe('default options', async () => {

        it('should not set `Access-Control-Allow-Origin` when request Origin header missing', async () => {
            let isTestFinished1 = false;
            let isTestFinished2 = false;

            app.then(async ctx => {
                isTestFinished1 = true;

                ctx.res.writeHead(200);
                ctx.res.end('test');
            });

            await chai.request(http.createServer(app.resolve()))
                .get('/')
                .send()
                .then(res => {
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

            app.then(async ctx => {
                isTestFinished1 = true;

                ctx.res.writeHead(200);
                ctx.res.end('test');
            });

            await chai.request(http.createServer(app.resolve()))
                .get('/')
                .set('Origin', 'http://makedev.org')
                .send()
                .then(res => {
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

            app.then(async ctx => {
                isTestFinished1 = true;
                ctx.res.end();
            });

            await chai.request(http.createServer(app.resolve()))
                .options('/')
                .set('Origin', 'http://makedev.org')
                .set('Access-Control-Request-Method', 'PUT')
                .send()
                .then(res => {
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

            app.then(async ctx => {
                isTestFinished1 = true;
                ctx.res.end();
            });

            await chai.request(http.createServer(app.resolve()))
                .options('/')
                .set('Origin', 'http://makedev.org')
                .send()
                .then(res => {
                    expect(res).to.have.status(200);
                    isTestFinished2 = true;
                });

            expect(isTestFinished1).is.true;
            expect(isTestFinished2).is.true;
        });

        it('should always set `Vary` to Origin', async () => {
            let isTestFinished1 = false;
            let isTestFinished2 = false;

            app.then(async ctx => {
                isTestFinished1 = true;
                ctx.res.end();
            });

            await chai.request(http.createServer(app.resolve()))
                .options('/')
                .set('Origin', 'http://makedev.org')
                .send()
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.headers.vary).to.be.equal('Origin');
                    isTestFinished2 = true;
                });

            expect(isTestFinished1).is.true;
            expect(isTestFinished2).is.true;
        });

    });

    describe('options.origin=*', async () => {});
    describe('options.origin=function', async () => {});
    describe('options.exposeHeaders', async () => {});
    describe('options.maxAge', async () => {});
    describe('options.credentials', async () => {});
    describe('options.allowHeaders', async () => {});
    describe('options.allowMethods', async () => {});
    describe('other middleware has been set `Vary` header to Accept-Encoding', () => {});

});
