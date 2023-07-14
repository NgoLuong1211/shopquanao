const dotenv = require('dotenv')
dotenv.config()


const buynow = async function () {
    return (req, res, next) => {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (req.isAuthenticated()) {
            // Người dùng đã đăng nhập, tiếp tục xử lý
            next();
        } else {
            // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
            req.session.returnTo = req.originalUrl; // Lưu lại URL hiện tại
            res.redirect('/account/login');
        }
    }

}

module.exports = { 
    buynow
 }