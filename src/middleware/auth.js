const dotenv = require('dotenv')
dotenv.config()


module.exports = { 
    auth: async (req, res, next) => {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (req.isAuthenticated()) {
            const user = req.user.role_id;
            if(user==='6465fbc1c6a7fccffde390c7'){
                res.json('Bạn không phải Admin nên không thể vào trang này')
            }
            if(user==='6465fbd6ae61ad6fcc304f4b'){
                next();
            }
            // Người dùng đã đăng nhập, tiếp tục xử lý
        } else {
            // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
            req.session.url = req.session.detail
            
            res.redirect('/account/login');
        }
    }
 }