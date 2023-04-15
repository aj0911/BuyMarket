const Contact = require('../Models/ContactModel');
const catchAsyncErrors = require('../Middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler');
const { sendEmail } = require("../utils/Helper");
const ApiFeatures = require('../utils/ApiFeatures');


//Add Contacts
exports.addContact = catchAsyncErrors(async(req,res,next)=>{
    const contact = await Contact.create(req.body);
    const message = 'Respected Sir/Ma\'am\nYour message has been delivered to our Technical team, we will try to response you back shortly.\n\nBest Regards'
    try{
        sendEmail(req.body.email,'Thank you for your response',message);
    }
    catch(err){
        return next(new ErrorHandler(err,500));
    }
    res.status(200).json({
        success:true,
        message:'Message Sent Successfully',
        contact
    })
})

//Get All Contacts
exports.getAllContacts = catchAsyncErrors(async(req,res,next)=>{
    const apifeaturesAgain= new ApiFeatures(Contact.find(),req.query).search();
    const apifeatures = new ApiFeatures(Contact.find().populate('user','avatar'),req.query).search().pagination(req.query.itemPerPage);
    const contacts = await apifeatures.query;

    res.status(200).json({
        success:true,
        message:'All Contacts Recieved',
        totalContacts : (await apifeaturesAgain.query).length,
        contacts
    })
})

//Delete Contact
exports.deleteContact = catchAsyncErrors(async(req,res,next)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        return next(new ErrorHandler('Contact not Found',404));
    }
    await contact.deleteOne();

    res.status(200).json({
        success:true,
        message:'Contact Deleted Successfully',
        contact
    })
})

//Get Contact for Admin
exports.getContact = catchAsyncErrors(async(req,res,next)=>{
    const contact = await Contact.findById(req.params.id).populate("user","avatar");
    if(!contact){
        return next(new ErrorHandler('Contact not Found',404));
    }

    res.status(200).json({
        success:true,
        message:'Contact Recieved',
        contact
    })
})

exports.replyMessage = catchAsyncErrors(async(req,res,next)=>{
    const {email , subject,additional ,message} = req.body;
    try{
        sendEmail(email,subject,`${additional} ${message}`);
    }
    catch(exception){
        return next(new ErrorHandler('Email Not Sent!!',400))
    }
    res.status(200).json({
        success:true,
        message:'Email Sent Successfully',
    })
})
