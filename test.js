const test = require('tape');
const WaitExpressMiddleware = require('./index');


test('A identity middleware', (t) => {
    function identityMiddleware(req, res, next) {
        next()
    }
    const reqMock = {};

    t.plan(1);

    WaitExpressMiddleware(identityMiddleware, reqMock)
        .then(({ req, res, next }) => {
            t.deepEqual(next, [], '`next` callback was called, interrupting the middleware.')
            t.end()
        })
})


test('A middleware that passes a error to the next middleware', (t) => {
    function middlewareWithError(req, res, next) {
        next('ERROR!')
    }
    const reqMock = {};

    t.plan(2);

    WaitExpressMiddleware(middlewareWithError, reqMock)
        .then(({ req, res, next }) => {
            t.equal(next.length, 1, '`next` callback was called, interrupting the middleware.')
            t.deepEqual(next, [ 'ERROR!' ], 'we captured the error handled to the next callback')
            t.end()
        })
})


test('A middleware that throws a error', (t) => {
    function neverEndingMiddleware(req, res, next) {
        throw new Error('Such error')
    }
    const reqMock = {};

    t.plan(2);

    WaitExpressMiddleware(neverEndingMiddleware, reqMock)
        .catch((err) => {
            t.assert(err, 'captured the exception thrown')
            t.equal(err.message, 'Such error', 'was the error we created')
            t.end()
        })
})


test('A middleware "sends a json"', (t) => {
    function neverEndingMiddleware(req, res, next) {
        res.json({ doge: "amaze" })
    }
    const reqMock = {};

    t.plan(2);

    WaitExpressMiddleware(neverEndingMiddleware, reqMock)
        .then(({ req, res, next }) => {
            t.assert(res.json, 'captured a json response')
            t.deepEqual(res.json, { doge: "amaze" }, 'captured the correct json response')
            t.end()
        })
})

test('A middleware that sets a HTTP status', (t) => {
    function neverEndingMiddleware(req, res, next) {
        res.status(418).json({ teapot: "excite" })
    }
    const reqMock = {};

    t.plan(2);

    WaitExpressMiddleware(neverEndingMiddleware, reqMock)
        .then(({ req, res, next }) => {
            t.assert(res.status, 'captured a status')
            t.equal(res.status, 418, 'captured the correct HTTP status supplied')
            t.end()
        })
})