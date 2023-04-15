import React, { useEffect, useState } from 'react'
import api from 'axios'
import { toast } from 'react-toastify';
import Loader from '../Extra/Loader/Loader';
import { urlPrefix } from '../../Helper/Helper';

const ForgetPassword = ({closeModal,setLoader}) => {
    //States
    const [email,setEmail] = useState('');
    const [otp,setOtp] = useState('');
    const [pass,setPass] = useState('');
    const [confirmPass,setConfirmPass] = useState('');
    const [resetToken,setResetToken] = useState(true);
    const [otpModal,setOtpModal] = useState(false);
    const [forgetModal,setForgetModal] = useState(false);
    const [token,setToken] = useState('');

    //functions
    const resetPasswordToken = (e)=>{
        e.preventDefault();
        api.post(urlPrefix+'/password/reset',{
            email
        }).then((res)=>{
            toast.success('Otp sent to Email Successfully');
            setToken(res.data.otp);
            setOtpModal(true);
            setResetToken(false);
        }).catch((err)=>{
            toast.warn(err.response.data.message);
        })
    }

    const validOtp = (e)=>{
        e.preventDefault();
        console.log(token);
        if(otp === token){
            setLoader(true);
            setOtpModal(false);
            setForgetModal(true);
            setLoader(false);
        }
        else{
            toast.warn('OTP is not correct');
        }
    }

    const forgetPasswordFunc = (e)=>{
        e.preventDefault();
        api.create({withCredentials:true}).put(urlPrefix+`/password/reset/${token}`,{
            password:pass,
            confirmPassword:confirmPass
        }).then((res)=>{
            toast.success(res.data.message);
            setForgetModal(false);
            closeModal(false);
        }).catch((err)=>{
            toast.warn(err.response.data.message);
        })
    }

  return (
    <div className="review-modal container">
    <div className="modal">
        <div className="title">
            <h3>Forget Password</h3>
        </div>
        {
            (resetToken)?
            <form onSubmit={e=>resetPasswordToken(e)}>
                <div className="text">
                    <input type="email" onChange={e=>setEmail(e.target.value)} name="email" required placeholder='Email' />
                </div>
                <div className='btns'>
                    <a onClick={()=>closeModal(false)}>Cancel</a>
                    <button type='submit'>Send OTP</button>
                </div>
            </form>   
            :''
        }
        {
            (otpModal)?
            <form onSubmit={e=>validOtp(e)}>
                <div className="text">
                    <input type="text" onChange={e=>setOtp(e.target.value)} name="otp" required placeholder='OTP' />
                </div>
                <div className='btns'>
                    <button type='submit'>Next</button>
                </div>
            </form>   
            :''
        }
        {
            (forgetModal)?
            <form onSubmit={e=>forgetPasswordFunc(e)}>
                <div className="text">
                <input type="password" onChange={(e)=>{setPass(e.target.value)}} name="pass" required placeholder='Password' />
                <input type="password" onChange={(e)=>{setConfirmPass(e.target.value)}} name="confirmPass" required placeholder='Confirm  Password' />
                </div>
                <div className='btns'>
                    <a onClick={()=>closeModal(false)}>Cancel</a>
                    <button type='submit'>Submit</button>
                </div>
            </form>   
            :''
        }
        
    </div>
</div>
  )
}

export default ForgetPassword