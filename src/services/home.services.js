const _User = require('../models/users.model');
const _Product = require('../models/product.model');
const _Category = require('../models/category.model');
const _Supplier = require('../models/supplier.model');
const _Size = require('../models/Size.model');
const _Color = require('../models/Color.model')
const _Oder = require('../models/oder.model');
const _OderDetail = require('../models/oder_detail.model');
const _Feedback = require('../models/feedback.model')

const {
    productDisplay
} = require('../services/product.services');

var that = module.exports = {
    home: async ({
    }) => {
        const oder_detail = await _OderDetail.aggregate([
            {
              $group: {
                _id: "$productID",
                totalQuantity: { $sum: "$quantity" },
              },
            },
            {
              $sort: {
                totalQuantity: -1,
              },
            },
            {
              $limit: 10,
            },
          ])
        var arr = [];
        for(var i=0; i<oder_detail.length; i++){
            arr.push(oder_detail[i]._id)
        }
        const products = await _Product.find({productID: {$in: arr}})
        const uniqueObjects = await productDisplay({products});

        if (!uniqueObjects) {
            return {
                code: 404,
                message: 'not found'
            }
        } else {
            return {
                code: 200,
                element: uniqueObjects
            }
        }
    },
    productNew: async ({
        category
    }) => {
        const Category = await _Category.findOne({ name: category })
        const products = await _Product.find({ category_id: Category.id }).sort({ createdAt: -1 }).limit(10);
        const uniqueObjects = await productDisplay({ products });
        if (!products) {
            return {
                code: 404,
                message: 'not found'
            }
        } else {
            return {
                code: 200,
                element: uniqueObjects
            }
        }
    },
    product: async ({
        search,
        page
    }) => {
        const itemsPerPage = 2;
        const Page = parseInt(page);


        var products = await _Product.aggregate([
            {
                $group: {
                    _id: "$productID",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { 
                    newRoot: "$data"
                }
            }
            ,
            {
                $sort: {
                    productID: 1 // 1: Sắp xếp từ trên xuống dưới, -1: Sắp xếp từ dưới lên trên
                }
            }
            ,
            {
                $skip: 0 * itemsPerPage
            },
            {
                $limit: itemsPerPage
            }
        ])

        let data = await _Product.aggregate([
            {
                $group: {
                    _id: "$productID",
                }
            }])
        // có search không có page
        if (search && !Page) {
            data = await _Product.aggregate([
                {
                    $match: {
                        $or: [
                            {title: { $regex: search, $options: 'i' }},
                            {productID: { $regex: search, $options: 'i' }}
                        ]
                    }
                },
                {
                    
                    $group: {
                        _id: "$productID",
                    }
                }])
            products = await _Product.aggregate([
                {
                    $match: {
                        $or: [
                            {title: { $regex: search, $options: 'i' }},
                            {productID: { $regex: search, $options: 'i' }}
                        ]
                    }
                },
                {
                    $group: {
                        _id: "$productID",
                        data: { $first: "$$ROOT" }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$data"
                    }
                }
                ,
                {
                    $sort: {
                        productID: 1 // 1: Sắp xếp từ trên xuống dưới, -1: Sắp xếp từ dưới lên trên
                    }
                }
                ,
                {
                    $skip: 0 * itemsPerPage
                },
                {
                    $limit: itemsPerPage
                }
            ])
        }

        // có page không có search
        if (!search && Page) {
            products = await _Product.aggregate([
                {
                    $group: {
                        _id: "$productID",
                        data: { $first: "$$ROOT" }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$data"
                    }
                }
                ,
                {
                    $sort: {
                        productID: 1 // 1: Sắp xếp từ trên xuống dưới, -1: Sắp xếp từ dưới lên trên
                    }
                }
                ,
                {
                    $skip: (Page - 1) * itemsPerPage
                },
                {
                    $limit: itemsPerPage
                }
            ])
        }

        // có page có search
        if (search && Page) {
            data = await _Product.aggregate([
                {
                    $match: {
                        $or: [
                            {title: { $regex: search, $options: 'i' }},
                            {productID: { $regex: search, $options: 'i' }}
                        ]
                    }
                },
                {
                    
                    $group: {
                        _id: "$productID",
                    }
                }])
            products = await _Product.aggregate([
                {
                    $match: {
                        $or: [
                            {title: { $regex: search, $options: 'i' }},
                            {productID: { $regex: search, $options: 'i' }}
                        ]
                    }
                },
                {
                    $group: {
                        _id: "$productID",
                        data: { $first: "$$ROOT" }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$data"
                    }
                }
                ,
                {
                    $sort: {
                        productID: 1 // 1: Sắp xếp từ trên xuống dưới, -1: Sắp xếp từ dưới lên trên
                    }
                }
                ,
                {
                    $skip: (Page - 1) * itemsPerPage
                },
                {
                    $limit: itemsPerPage
                }
            ])
        }
        const arrlengh = data.length;
        var totalPage = Math.ceil(arrlengh / itemsPerPage);

        // console.log(uniqueObjects)
        if (!products) {
            return {
                code: 404,
                message: 'not found'
            }
        } else {
            return {
                code: 200,
                totalPage: totalPage,
                element: products
            }
        }
    },
    detailProduct: async ({
        id
    }) => {
        var size = [];
        var color = [];
        const product = await _Product.findOne({ _id: id });
        const products = await _Product.find({productID: product.productID})
        products.forEach(item => {
            size.push(item.size);
            color.push(item.couleur);
        });
        if (!product) {
            return {
                code: 404,
                message: 'not found'
            }
        } else {
            return {
                code: 200,
                element: product,
                size: size,
                color: color
            }
        }
    },
    feedBacks: async ({
        fullname,
        email,
        phone_number,
        subject_name,
        note
    }) => {
        const oder = await _Feedback.create({
            fullname: fullname,
            email: email,
            phone_number: phone_number,
            subject_name: subject_name,
            note: note,
        })
    }
}