const dotenv = require('dotenv')
dotenv.config()


const buynow = async function () {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.session.returnTo = req.originalUrl;
            res.redirect('/account/login');
        }
    }

}

module.exports = { 
    buynow
 }