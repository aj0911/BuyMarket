const catchAsyncErrors = require('../Middlewares/catchAsyncErrors.js');
const Product = require('../Models/ProductModel.js');
const ErrorHandler = require('../utils/ErrorHandler.js');
const ApiFeatures = require('../utils/ApiFeatures.js');
const cloudinary = require('cloudinary');

//Create Product

exports.createProduct =catchAsyncErrors(async(req,res,next)=>{
    const prodImage = []
    for(let i =0;i<req.body.images.length;i++){
        const myCloud = await cloudinary.v2.uploader.upload(req.body.images[i],{
            folder:'Avtars',
            width:500,
            crop:'scale'
        })
        prodImage.push({
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        });
    }
    if(prodImage.length===0){
        return next(new ErrorHandler('Images can\'t be added to the server',500));
    }
    const {name ,description,stock,price,category} = req.body;
    const product = await Product.create({
        name,
        description,
        stock,
        price,
        category,
        images:prodImage,
        user:req.user.id
    });
    res.status(200).json({
        success:'true',
        message:'Product Created',
        product
    })
});

//Get all Products
exports.getAllProducts =catchAsyncErrors(async(req,res)=>{
    const productPerPage =8;
    const apifeaturesagain = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    const totalProduct = (await apifeaturesagain.query).length;
    const apifeatures = new ApiFeatures(Product.find(),req.query)
        .search()
        .filter()
        .pagination(productPerPage);
    const product = await apifeatures.query;
    const products = (await Product.find({}));
    res.status(200).json({
        success:'true',
        message:'All Products Sent',
        totalProduct,
        count:product.length,
        product,
        products
    });
})

//Update Product
exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404))
    }
    const {name,description,price,category,stock,images} = req.body;
    if(images.length > 0){
        const prodImage = []
        for(let i =0;i<images.length;i++){
            const myCloud = await cloudinary.v2.uploader.upload(images[i],{
                folder:'Avtars',
                width:500,
                crop:'scale'
            })
            prodImage.push({
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            });
        }
        if(prodImage.length===0){
            return next(new ErrorHandler('Images can\'t be added to the server',500));
        }
        await Product.findByIdAndUpdate(req.params.id,{
            name,
            description,
            price,
            category,
            stock,
            images:prodImage
        },{new:true,runValidators:true});
    }
    else{
        await Product.findByIdAndUpdate(req.params.id,{
            name,
            description,
            price,
            category,
            stock
        },{new:true,runValidators:true});
    }

    res.status(200).json({
        success:true,
        message:'Product Updated Successfully',
        product
    })
})

//Delete Product
exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product =await Product.findByIdAndRemove(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404))
    }
    res.status(200).json({
        success:true,
        message:'Product Deleted.',
        product
    })
})

//GetSingleProduct
exports.getProduct = catchAsyncErrors(async(req,res,next)=>{
    const product =await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404))
    }
    res.status(200).json({
        success:true,
        message:'Product Found.',
        product
    })
})

//Reviews Section


//Adding and updating review
exports.saveReview = catchAsyncErrors(async(req,res,next)=>{
    const {productId,rating,comment} = req.body;

    const product =await Product.findById(productId);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404))
    }
    const isReviewed = product.reviews.find(rev=>rev.user.toString() === req.user.id);

    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString() === req.user.id){
                rev.rating = Number(rating);
                rev.comment= comment;
            }
        })
    }
    else{
        product.reviews.push({
            user:req.user,
            name:req.user.name,
            rating:Number(rating),
            comment
        })
    }

    product.numberOfReviews = product.reviews.length;
    let sum =0;
    product.reviews.forEach(e=>{sum+=e.rating;});
    let avg = sum/product.reviews.length;
    product.rating = avg;

    await product.save({validateBeforeSave:false});

    res.status(202).json({
        success:true,
        message:`Review ${(isReviewed?'Updated':'Added')} successfully`,
        product
    })
})

//Get all reviews 
exports.getAllReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.productId)
    if(!product){
        return next(new ErrorHandler('Product Not Found',404));
    }

    res.status(200).json({
        success:true,
        message:'All Reviews of Product:- '+product.name,
        count:product.reviews.length,
        rating:product.rating,
        reviews:product.reviews,
        product
    })
})

//Delete reviews
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const {productId,Id} = req.query;
    const product = await Product.findById(productId);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404));
    }

    let reviews = product.reviews;
    const review = reviews.filter(rev=>rev.id.toString() === Id.toString());
    if(review.length<=0){
        return next(new ErrorHandler('Review Not Found',404));
    }
    reviews = reviews.filter(rev=>rev.id.toString() !== Id.toString());

    const numberOfReviews = reviews.length;
    let sum =0;let avg=0;
    reviews.forEach(e=>{sum+=e.rating;});
    if(numberOfReviews!==0){
        avg = sum/reviews.length;
    }
    else{
        avg=0;
    }
    const rating = avg;
    await Product.findByIdAndUpdate(productId,{
        reviews,
        rating,
        numberOfReviews
    },
    {
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        message:'Review Deleted Successfully',
        review
    })
})