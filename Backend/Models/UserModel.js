const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"User Name must be required."],
        maxLength:[30,"Name must be less than 30 characters."]
    },
    email:{
        type:String,
        required:[true,"User Email must be required."],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"User Password must be required."],
        minLength:[8,"Password must be more than 8 characters."],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        required:[true,"Role must be required."]
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
});

//Converting Password Hash
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await  bcrypt.hash(this.password,10)
})

//JWT Tokens
userSchema.methods.getJwtToken = function(){
    return jwtToken.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:'5d'
    })
}

//Compare Password
userSchema.methods.comparePassword = async function(pass){
    return bcrypt.compare(pass,this.password);
}

//Reset Password Token
userSchema.methods.getResetPasswordToken = async function(){
    const resetPasswordToken = crypto.randomBytes(10).toString("hex");

    // hashing 
    const encode = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

    this.resetPasswordToken = encode;
    this.resetPasswordExpire = new Date(Date.now() + 15*60*1000)

    return resetPasswordToken;
}

module.exports = mongoose.model('User',userSchema);