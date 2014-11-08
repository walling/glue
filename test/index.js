// Load modules

var Path = require('path');
var Code = require('code');
var Glue = require('..');
var Hapi = require('hapi');
var Lab = require('lab');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('compose()', function () {

    var compose = Glue.compose(Hapi);

    it('composes server', function (done) {

        var manifest = {
            server: {
                cache: '../node_modules/catbox-memory',
                app: {
                    my: 'special-value'
                }
            },
            connections: [
                {
                    labels: ['api', 'nasty', 'test']
                },
                {
                    host: 'localhost',
                    labels: ['api', 'nice']
                }
            ],
            plugins: {
                '../test/plugins/--test1': null
            }
        };

        compose(manifest, function (err, server) {

            expect(err).to.not.exist();
            server.start(function (err) {

                expect(err).to.not.exist();
                server.stop(function () {

                    server.connections[0].inject('/test1', function (res) {

                        expect(res.result).to.equal('testing123special-value');
                        done();
                    });
                });
            });
        });
    });

    it('composes server (cache.engine)', function (done) {

        var manifest = {
            server: {
                cache: {
                    engine: '../node_modules/catbox-memory'
                },
                app: {
                    my: 'special-value'
                }
            },
            connections: [
                {
                    port: 0,
                    labels: ['api', 'nasty', 'test']
                },
                {
                    host: 'localhost',
                    port: 0,
                    labels: ['api', 'nice']
                }
            ],
            plugins: {
                '../test/plugins/--test1': null
            }
        };

        compose(manifest, function (err, server) {

            expect(err).to.not.exist();
            server.start(function (err) {

                expect(err).to.not.exist();
                server.stop(function () {

                    server.connections[0].inject('/test1', function (res) {

                        expect(res.result).to.equal('testing123special-value');
                        done();
                    });
                });
            });
        });
    });

    it('composes server (cache array)', function (done) {

        var manifest = {
            server: {
                cache: [{
                    engine: '../node_modules/catbox-memory'
                }],
                app: {
                    my: 'special-value'
                }
            },
            connections: [
                {
                    port: 0,
                    labels: ['api', 'nasty', 'test']
                },
                {
                    host: 'localhost',
                    port: 0,
                    labels: ['api', 'nice']
                }
            ],
            plugins: {
                '../test/plugins/--test1': null
            }
        };

        compose(manifest, function (err, server) {

            expect(err).to.not.exist();
            server.start(function (err) {

                expect(err).to.not.exist();
                server.stop(function () {

                    server.connections[0].inject('/test1', function (res) {

                        expect(res.result).to.equal('testing123special-value');
                        done();
                    });
                });
            });
        });
    });

    it('composes server (engine function)', function (done) {

        var manifest = {
            server: {
                cache: {
                    engine: require('catbox-memory')
                },
                app: {
                    my: 'special-value'
                }
            },
            connections: [
                {
                    port: 0,
                    labels: ['api', 'nasty', 'test']
                },
                {
                    host: 'localhost',
                    port: 0,
                    labels: ['api', 'nice']
                }
            ],
            plugins: {
                '../test/plugins/--test1': null
            }
        };

        compose(manifest, function (err, server) {

            expect(err).to.not.exist();
            server.start(function (err) {

                expect(err).to.not.exist();
                server.stop(function () {

                    server.connections[0].inject('/test1', function (res) {

                        expect(res.result).to.equal('testing123special-value');
                        done();
                    });
                });
            });
        });
    });

    it('composes server (string port)', function (done) {

        var manifest = {
            connections: [
                {
                    port: '0',
                    labels: ['api', 'nasty', 'test']
                },
                {
                    host: 'localhost',
                    port: 0,
                    labels: ['api', 'nice']
                }
            ],
            plugins: {
                '../test/plugins/--test1': {}
            }
        };

        compose(manifest, function (err, server) {

            expect(err).to.not.exist();
            server.start(function (err) {

                expect(err).to.not.exist();
                server.stop();

                server.connections[0].inject('/test1', function (res) {

                    expect(res.result).to.equal('testing123');
                    done();
                });
            });
        });
    });

    it('composes server (relative and absolute paths)', function (done) {

        var manifest = {
            server: {
                cache: {
                    engine: '../../node_modules/catbox-memory'
                },
                app: {
                    my: 'special-value'
                }
            },
            connections: [
                {
                    port: 0,
                    labels: ['api', 'nasty', 'test']
                },
                {
                    host: 'localhost',
                    port: 0,
                    labels: ['api', 'nice']
                }
            ],
            plugins: {
                './--test2': null
            }
        };

        manifest.plugins[__dirname + '/plugins/--test1'] = null;

        compose(manifest, { relativeTo: __dirname + '/plugins' }, function (err, server) {

            expect(err).to.not.exist();
            server.start(function (err) {

                expect(err).to.not.exist();
                server.stop(function () {

                    server.connections[0].inject('/test1', function (res) {

                        expect(res.result).to.equal('testing123special-value');
                        done();
                    });
                });
            });
        });
    });

    it('composes server with ports', function (done) {

        var manifest = {
            connections: [
                {
                    port: 8000
                },
                {
                    port: '8001'
                }
            ],
            plugins: {}
        };

        compose(manifest, function (err, server) {

            expect(err).to.not.exist();
            done();
        });
    });

    it('validates server config after defaults applied', function (done) {

        var manifest = {
            connections: [
                {
                    timeout: {

                    }
                }
            ],
            plugins: {}
        };

        compose(manifest, function (err, server) {

            expect(err).to.not.exist();
            done();
        });
    });

    it('composes server with plugin registration options', function (done) {

        var manifest = {
            server: {
                app: {
                    my: 'special-value'
                }
            },
            connections: [
                {
                    port: 0,
                    labels: ['a', 'b']
                },
                {
                    port: 0,
                    labels: ['b', 'c']
                }
            ],
            plugins: {
                '../test/plugins/--custom': [
                    {
                        options: {
                            path: '/'
                        }
                    },
                    {
                        select: 'a',
                        options: {
                            path: '/a'
                        }
                    },
                    {
                        select: 'b',
                        options: {
                            path: '/b'
                        }
                    },
                    {
                        route: {
                            prefix: '/steve'
                        },
                        options: {
                            path: '/a'
                        }
                    }
                ]
            }
        };

        compose(manifest, function (err, server) {

            expect(err).to.not.exist();

            var server1 = server.connections[0];
            var server2 = server.connections[1];

            server1.inject('/', function (res) {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal('/');

                server2.inject('/', function (res) {

                    expect(res.statusCode).to.equal(200);
                    expect(res.result).to.equal('/');

                    server1.inject('/a', function (res) {

                        expect(res.statusCode).to.equal(200);
                        expect(res.result).to.equal('/a');

                        server2.inject('/a', function (res) {

                            expect(res.statusCode).to.equal(404);

                            server1.inject('/b', function (res) {

                                expect(res.statusCode).to.equal(200);
                                expect(res.result).to.equal('/b');

                                server2.inject('/b', function (res) {

                                    expect(res.statusCode).to.equal(200);
                                    expect(res.result).to.equal('/b');

                                    server1.inject('/steve/a', function (res) {

                                        expect(res.statusCode).to.equal(200);
                                        expect(res.result).to.equal('/a');

                                        server2.inject('/steve/a', function (res) {

                                            expect(res.statusCode).to.equal(200);
                                            expect(res.result).to.equal('/a');
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('composes server with inner deps', function (done) {

        var manifest = {
            connections: [{}],
            plugins: {
                '../test/plugins/--deps1': null,
                '../test/plugins/--deps2': null
            }
        };

        compose(manifest, function (err, server) {

            expect(err).to.not.exist();
            done();
        });
    });

    it('errors on invalid plugin', function (done) {

        var manifest = {
            connections: [{}],
            plugins: {
                '../test/plugins/--fail': null
            }
        };

        compose(manifest, function (err, server) {

            expect(err).to.exist();
            done();
        });
    });

    it('throws on server with missing inner deps', function (done) {

        var manifest = {
            connections: [{ host: 'localhost' }],
            plugins: {
                '../test/plugins/--deps1': null
            }
        };

        compose(manifest, function (err, server) {

            expect(function () {
                server.start();
            }).to.throw('Plugin --deps1 missing dependency --deps2 in connection: http://localhost:0');

            done();
        });
    });

    it('throws on invalid manifest options', function (done) {

        var manifest = {
            server: {
                app: {
                    my: 'special-value'
                }
            },
            connections: [
            ],
            plugins: {
                './--loaded': {}
            }
        };

        expect(function () {

            compose(manifest, function () { });
        }).to.throw(/Invalid manifest options/);
        done();
    });
});