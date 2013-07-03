module.exports = function () {
    'use strict';
    return function (req, res, done) {
        return done(null, {
            properties: [
                {
                    title: 'Property 1',
                    description: 'Description'
                }
            ]
        });
    };
};
