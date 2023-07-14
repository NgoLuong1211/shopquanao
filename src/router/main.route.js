const account = require('./account.route');
const client = require('./client.router')
const server = require('./server.route')

function router(app) {
    app.use('/account', account);
    app.use('/server', server);
    app.use('/', client);
}

module.exports = router;