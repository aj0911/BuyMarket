const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name."]
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description."]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price."]
    },
    rating:{
        type:Number,
        default:0,
        maxLength:[8,"Stock Cannot exceed 8 characters"]
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product Stock."],
        maxLength:[5,"Stock Cannot exceed 5 characters"],
        default:1
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                required:true,
                ref:'User'
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Product',productSchema);