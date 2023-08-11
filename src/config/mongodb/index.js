const mongoose = require('mongoose')

async function connect() {
    try{
        await mongoose.connect('mongodb://127.0.0.1/shopquanao'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
        console.log('được')
    }
    catch (error){
        console.log('lỗi')
    }
}

module.exports = { connect }