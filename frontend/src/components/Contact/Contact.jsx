import React, { useEffect, useState } from 'react'
import './Contact.css'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaRegAddressCard, FaTwitter} from 'react-icons/fa'
import {  AiFillPhone, AiOutlineMail } from 'react-icons/ai'
import api from 'axios'
import {toast} from 'react-toastify'
import Loader from '../Extra/Loader/Loader'
import { urlPrefix } from '../../Helper/Helper'

const Contact = () => {
    //States
    const [fname,setFName] = useState('');
    const [lname,setLName] = useState('');
    const [email,setEmail] = useState('');
    const [phone,setPhone] = useState('');
    const [message,setMessage] = useState('');
    const auth = useSelector(state=>state.auth);
    const navigate = useNavigate();
    const [loader,setLoader]  = useState(false);

    const submitForm = (e)=>{
        e.preventDefault();
        setLoader(true);
        api.create({withCredentials:true}).post(urlPrefix+'/contact/new',{
            name:`${fname} ${lname}`,
            email,
            phoneNo:phone,
            message,
            user:auth.user._id
        }).then((res)=>{
            toast.success(res.data.message)
            setLoader(false);
        }).catch((err)=>{
            toast.warn(err.response.data.message);
            setLoader(false);
        }).finally(()=>{
            setLoader(false);
        })
    }
    const setFields = ()=>{
        const arr = auth.user.name.split(' ');
        setFName(arr[0]);
        setLName(arr[1]);
        setEmail(auth.user.email);
    }
    useEffect(()=>{
        if(!auth.isAuth){
            return navigate('/login');
        }
        setFields();
    },[loader])

  return (
    (!loader)?
    <div className="contact">
        <div className="left-inner">
        </div>
        <div className="right-inner">
        </div>
        <div className="left-outer">
            <h3>Contact Info</h3>
            <div className="detail-box">          
                <div className="detail">
                    <FaRegAddressCard/>
                    <a href='https://www.google.co.in/maps/place/New+Delhi,+Delhi/@28.5275817,77.068554,11z/data=!3m1!4b1!4m6!3m5!1s0x390cfd5b347eb62d:0x52c2b7494e204dce!8m2!3d28.6139391!4d77.2090212!16zL20vMGRsdjA' target='_blank'>New Delhi, India</a>
                </div>
                <div className="detail">
                    <AiFillPhone/>
                    <a href='tel:987654321'>+91 987-654-321</a>
                </div>
                <div className="detail">
                    <AiOutlineMail/>
                    <a href='mailto:jhaabhinav16@gmail.com'>jhaabhinav16@gmail.com</a>
                </div>
            </div>
            <div className="links">
                <a href="#"><FaFacebook/></a>
                <a href="#"><FaTwitter/></a>
                <a href="#"><FaInstagram/></a>
                <a href="#"><FaPinterest/></a>
                <a href="#"><FaLinkedin/></a>
            </div>
        </div>
        <div className="right-outer">
            <div className="left">
            </div>
            <div className="right">
                <h3>Send a Message</h3>
                <form onSubmit={e=>submitForm(e)}>
                    <input value={fname} required onChange={(e)=>setFName(e.currentTarget.value)} type="text" placeholder='First Name' />
                    <input value={lname} required onChange={(e)=>setLName(e.currentTarget.value)} type="text" placeholder='Last Name' />
                    <input value={email} required onChange={(e)=>setEmail(e.currentTarget.value)} type="email" placeholder='Email' />
                    <input required onChange={(e)=>setPhone(e.currentTarget.value)} type="number" placeholder='Phone No' />
                    <textarea required onChange={(e)=>setMessage(e.currentTarget.value)} placeholder='Write Your Message Here..'></textarea>
                    <input type="submit" value='Send' />
                </form>
            </div>
        </div>
    </div>
    :<Loader/>
  )
}

export default Contact