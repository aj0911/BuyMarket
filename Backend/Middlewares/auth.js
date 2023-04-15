const catchAsyncErrors = require('./catchAsyncErrors')
const jwtToken = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
const User = require('../Models/UserModel');


exports.isAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const token = (req.cookies.token==='j:null')?null:req.cookies.token;
    if(!token){
        return next( new ErrorHandler('Login to access this resource',401));
    }

    const decode = jwtToken.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decode.id);
    next();
})

exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} can't access to this resource`,401))
        }
        next();
    }
}