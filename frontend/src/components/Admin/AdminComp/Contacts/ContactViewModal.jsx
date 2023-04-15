import React, { useEffect, useRef, useState } from 'react'
import categories from '../../../../Helper/Helper';
import Loader from '../../../Extra/Loader/Loader';
import api from 'axios'
import {toast} from 'react-toastify'
import NoLoad from '../../../Extra/NoLoad/NoLoad';
import {BsFillReplyFill,BsDoorClosedFill} from 'react-icons/bs'

const ContactViewModal = ({setContactViewModal,contactId,urlPrefix}) => {
    //states
    const [loader ,setLoader] = useState(false);
    const [reply ,setReply] = useState(false);
    const [data,setData] = useState('');
    const [err,setErr] = useState('');
    const monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    const [email,setEmail] = useState('');
    const [subject,setSubject] = useState('');
    const [message,setMessage] = useState('');
    const [additional,setAdditional] = useState('');

    //functions
    const getContact = ()=>{
        setLoader(true);
        api.create({withCredentials:true}).get(`${urlPrefix}/admin/contacts/${contactId}`).then((res)=>{
          setData(res.data);
          setAdditional(`Hello ${res.data.contact.name},\n The message which is shown below is the replying to your response \n${res.data.contact.message}n\n:= \n`);
          setEmail(res.data.contact.email);
          setSubject('Reply from BuyMarket to your response');
          setLoader(false);
        }).catch((error)=>{
          setErr(error);
          setLoader(false);
        }).finally(()=>{
          setLoader(false);
        })
    }
    
    const sendEmail = (e)=>{
        e.preventDefault();
        setLoader(true);
        api.create({withCredentials:true}).post(`${urlPrefix}/admin/contacts/mail`,{
            email,
            subject,
            message,
            additional
        }).then((res)=>{
            toast.success(res.data.message);
            setLoader(false);
            setContactViewModal(false);
        }).catch((error)=>{
          toast.warn(error.response.data.message);
          setLoader(false);
        }).finally(()=>{
          setLoader(false);
        })
    }

    useEffect(()=>{
        getContact();
    },[reply])


  return (
    <div className="viewModal">
    <div className="modal">
        <div className="heading">{(reply)?'Send Message':'View Contact Message'}</div>
        {
            (loader)?<Loader/>:
            (data.success)?
            (reply)?
            <form  onSubmit={(e)=>sendEmail(e)}>
                <div className="form-item">
                    <textarea  onChange={e=>setMessage(e.currentTarget.value)} required placeholder='Message'></textarea>
                </div>
                <div className="btns">
                    <a onClick={()=>setContactViewModal(false)}>Cancel</a>
                    <input type="submit" value={'Send'} />
                </div>
            </form>:
            <div className="email">
                <div className="top">
                    <div className="left">
                        <img src={data.contact.user.avatar.url} alt="" />
                        <div className="left-text">
                            <h3>{data.contact.name}({data.contact.email})</h3>
                            <h5>to me</h5>
                        </div>
                    </div>
                    <div className="right">
                        <p>{`${(new Date(data.contact.sentAt)).getDate()} ${monthNames[(new Date(data.contact.sentAt)).getMonth()]} ${(new Date(data.contact.sentAt)).getFullYear()} ${(new Date(data.contact.sentAt)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`}</p>
                    </div>
                </div>
                <div className="middle">
                    <h5>Hello Abhinav,</h5>
                    <p>{data.contact.message}</p>
                </div>
                <div className="btns">
                    <button onClick={()=>setContactViewModal(false)}><BsDoorClosedFill/>Close</button>
                    <button onClick={()=>setReply(true)}><BsFillReplyFill/>Reply</button>
                </div>
            </div>
            :<NoLoad data={{name:err.status,text:err.message}}/>
        }
    </div>
</div>
  )
}

export default ContactViewModal
