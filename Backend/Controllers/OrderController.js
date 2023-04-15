const Order = require('../Models/OrderModel');
const catchAsyncErrors = require('../Middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const ProductModel = require('../Models/ProductModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const ApiFeatures = require('../utils/ApiFeatures');
//Add Order
exports.addOrder = catchAsyncErrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user.id
    });
    
    orderItems.forEach(async(item)=>{
        const product = await ProductModel.findById(item.product);
            product.stock -= item.quantity;
            await product.save({validateBeforeSave:false})
    })
    
    res.status(201).json({
        success:true,
        message:'Order Created Successfully',
        order
    })
})

//Get Logged In User Orders
exports.getOrders = catchAsyncErrors(async(req,res,next)=>{
    const apifeaturesAgain = new ApiFeatures(Order.find({user:req.user._id}),req.query).search("order");
    const apifeatures = new ApiFeatures( Order.find({user:req.user._id}).populate('user','name'),req.query).search("order").pagination(req.query.itemPerPage);
    const orders = await apifeatures.query;

    res.status(200).json({
        success:true,
        message:'All Orders of User:- '+req.user.name,
        count:orders.length,
        totalOrders:(await apifeaturesAgain.query).length,
        orders
    })
})

//Get Order for Admin
exports.getOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");
    if(!order){
        return next(new ErrorHandler('Order not Found',404));
    }

    res.status(200).json({
        success:true,
        message:'Order Recieved',
        order
    })
})

//Get Orders For Admin
exports.getOrdersForAdmin = catchAsyncErrors(async(req,res,next)=>{
    const apifeaturesAgain = new ApiFeatures(Order.find(),req.query).search("order");
    const apifeatures = new ApiFeatures( Order.find().populate('user','name'),req.query).search("order").pagination(req.query.itemPerPage);
    const orders = await apifeatures.query;
    let totalAmount = 0;
    orders.forEach(order=>{totalAmount+= order.totalPrice});

    res.status(200).json({
        success:true,
        message:'All Orders Recieved.',
        count:orders.length,
        totalOrders:(await apifeaturesAgain.query).length,
        totalAmount,
        orders
    })
})

//Update Order Status
exports.updateOrderStatus = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler('Order not Found',404));
    }
    if(!req.body.orderStatus){
        return next(new ErrorHandler('Order Status is Mandatory',400));
    }
    if(order.orderStatus==='Delivered'){
        return next(new ErrorHandler('Order Already Delivered.',400));
    }

    order.orderStatus = req.body.orderStatus;
    if(order.orderStatus === 'Delivered'){
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        message:`Order Status Updated to ${order.orderStatus}`,
        order
    })
    
})

//delete Order
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler('Order not Found',404));
    }
    await order.deleteOne();

    res.status(200).json({
        success:true,
        message:'Order Deleted Successfully',
        order
    })
})

//Razorpay payment open
exports.postRazorpay = catchAsyncErrors(async(req,res,next)=>{
    const instance = new Razorpay({
        key_id:process.env.KEY_ID,
        key_secret:process.env.KEY_SECRET
    });
    instance.orders.create({
        amount:req.body.amount*100,
        currency:'INR',
        receipt:crypto.randomBytes(10).toString('hex')
    },(err,order)=>{
        if(err){
            return next(new ErrorHandler('Error in Razorpay',500));
        }
        res.status(200).json({
            success:true,
            message:'Razorpay payment accepted.',
            order
        })
    })
})

//Razorpay payment verify
exports.verifyRazorpay = catchAsyncErrors(async(req,res,next)=>{

})