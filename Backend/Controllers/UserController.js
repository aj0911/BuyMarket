const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const User = require("../Models/UserModel");
const jwtToken = require("../utils/jwtTokens");
const ErrorHandler = require('../utils/ErrorHandler');
const crypto = require('crypto');
const { sendEmail } = require("../utils/Helper");
const cloudinary = require('cloudinary');
const ApiFeatures = require('../utils/ApiFeatures');
const OrderModel = require("../Models/OrderModel");
const ContactModel = require('../Models/ContactModel');

//Register User
exports.register = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find({});
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:'Avtars',
        width:150,
        crop:'scale'
    })
    const {name,email,password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        },
        role:(users.length===0)?'admin':'user'
    })
    jwtToken(user,202,'Register Successfully',res);
})

//Login User
exports.login = catchAsyncErrors(async(req,res,next)=>{
    const {email , password} = req.body;

    if(!email || !password){
        return next( new ErrorHandler('Login Details is Mandatory',400));
    }
    //Finding user by email along with its password.
    const user = await User.findOne({email}).select("+password");

    if(!user || !(await user.comparePassword(password))){
        return next( new ErrorHandler('Invalid Email or Password',401)); 
    }
    jwtToken(user,202,'Login Successfully',res);
    
})

//Logout User
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    const user = req.user;
    res.cookie("token",null,{
        expire:new Date(Date.now()),
        httpOnly:true
    })
    res.status(201).json({
        success:'true',
        message:'Log Out Successfully',
        user
    })
})

//Reset Password 
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({
        email:req.body.email
    });
    if(!user){
        return next(new ErrorHandler('User not found',404));
    }
    const resetToken = await user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const url = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Reset Password token generated,\n\n${resetToken}\n\nIf you haven't requested this email , just ignore it.`
    try{
        sendEmail(user.email,'Reset Password Token',message);
        res.status(200).json({
            success:true,
            otp:resetToken,
            message
        });
    }
    catch(err){
        user.resetPasswordExpire = user.resetPasswordToken=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(err.message,500))
    }
})

//Forget Password
exports.forgetPassword = catchAsyncErrors(async(req,res,next)=>{
    const token = req.params.token;
    const {password,confirmPassword} = req.body;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });
    if(!user){
        return next(new ErrorHandler('Invalid Password Token or Token expires',404));
    }
    if(!password || !confirmPassword){
        return next(new ErrorHandler('Confirm Password and Password is mandatory.',400));
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler('Password and Confirm Password must be same.',401));
    }
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({
        validateBeforeSave:true
    });

    res.status(200).json({
        status:true,
        message:'Password Changed Successfully.',
        user
    })
})

// GetUser 
exports.getUser = catchAsyncErrors(async(req,res,next)=>{
    if(req.user){
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success:true,
            message:'User Recieved.',
            user
        })
    }
    else{
        return next(new ErrorHandler('User Not Found',404));
    }
})

// Change Password
exports.changePassword = catchAsyncErrors(async(req,res,next)=>{
    const {oldPassword ,newPassword,confirmNewPassword} = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if(!(await user.comparePassword(oldPassword))){
        return next(new ErrorHandler('Wrong Old Password Entered.',400));
    }
    if(newPassword !== confirmNewPassword){
        return next(new ErrorHandler('Password and Confirm Password must be same.',401));
    }

    user.password = newPassword;
    await user.save({
        validateBeforeSave:true
    })

    res.status(202).json({
        success:true,
        message:'Password Changed Successfully',
        user
    })
})

//Update Profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    if(!req.body.name || !req.body.email || !req.body.avatar){
        return next(new ErrorHandler('Name and Email must be required',400));
    }
    let avatar = {};
    if(req.body.avatar !== req.user.avatar.url){
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:'Avtars',
            width:150,
            crop:'scale'
        })
        avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    }
    else{
        avatar = {
            public_id:req.user.avatar.public_id,
            url:req.user.avatar.url
        }
    }
    await User.findByIdAndUpdate(req.user.id,{
        name:req.body.name,
        email:req.body.email,
        avatar
    });
    
    res.status(202).json({
        success:true,
        message:'Profile Updated Successfully',
        user:(await User.findById(req.user.id))
    })
})

//Admin Routes API


//Get all the users
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const apifeaturesagain = new ApiFeatures(User.find(),req.query)
    .search()
    const totalUsers = (await apifeaturesagain.query).length
    const apifeatures = new ApiFeatures(User.find(),req.query)
        .search()
        .pagination(req.query.itemPerPage);
    const users = await apifeatures.query;
    
    res.status(200).json({
        success:true,
        message:'All Users Received',
        Count : users.length,
        totalUsers,
        users
    })
})

//Update User roles
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const {role} =  req.body;
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('User not Found'),404);
    }
    if(!role){
        return next(new ErrorHandler('Role is Mandatory'),404);
    }
    user.role = role;
    await user.save();

    res.status(202).json({
        success:true,
        message:`Role Updated to ${user.role} for the user:- ${user.name}`,
        user
    })
})

//Get User
exports.getUserAdmin = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('User not Found'),404);
    }
    res.status(202).json({
        success:true,
        message:'User Recieved.',
        user
    })
})

//Delete User
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    await OrderModel.deleteMany({user:req.params.id});
    await ContactModel.deleteMany({user:req.params.id});
    if(!user){
        return next(new ErrorHandler('User not Found'),404);
    }
    await user.deleteOne();
    res.status(202).json({
        success:true,
        message:'User Deleted Successfully.',
        user
    })
})
