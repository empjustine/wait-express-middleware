/**
 * An Application-level and Router-level middleware test double
 * ensemble to test Express-compatible middleware functions.
 * 
 * @param {function} middleware Express middleware function to be 
 * tested. It will be passed appropriate Express-like `res` and
 * `next` test doubles, to follow it's lifecycle.
 * @param {object} req A test double object for the Express-like
 * HTTP request object.
 * @returns {Promise} A promise that resolves whenever the
 * `middleware` callback ends the response cycle or called the
 * next middleware function in the stack. It's resolved with the
 * object { req, res, next }
 */
function waitExpressMiddleware(middleware, req) {

    return new Promise((resolve) => {

        /** 
         * The future result of the awaited promise.
         * Each key represents the req, res and next elements 
         * after the middleware "is halted".
         * @type object
         */
        const endState = { 
            req, 
            res: { status: undefined },
            next: undefined
        };

        /** 
         * wait-express-middleware test double object for an 
         * Express-like HTTP `res` response object.
         * @type object
         */
        const res = {
            json(j) {
                endState.res.json = j;
                resolve(endState);
            },
            status(s) {
                endState.res.status = s;
                return res;
            }
        };

        /** 
         * wait-express-middleware test double object for an
         * Express-like  `next` callback function
         * @type function
         */
        const next = function (...err) {
            endState.next = err;
            resolve(endState);
        };

        middleware(req, res, next);
    })
}

module.exports = waitExpressMiddleware;
