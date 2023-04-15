import React, { useState } from 'react'
import { FaExchangeAlt } from 'react-icons/fa'
import { toast } from 'react-toastify';
import api from 'axios'
import { urlPrefix } from '../../Helper/Helper';

const ChangePasswordModal = ({closeModal,setLoader}) => {
    //states
    const [oldPass,setOldPass] = useState('');
    const [newPass,setNewPass] = useState('');
    const [confirmNewPass,setConfirmNewPass] = useState('');

    //ChangePassword 
    const changePass = ()=>{
        if(oldPass === '' || newPass === '' || confirmNewPass===''){
            toast.warn('All Fields must be required');
        }
        else{
            if(newPass === confirmNewPass){
                setLoader(true);
                api.create({withCredentials:true}).put(urlPrefix+'/me/changePassword',{
                    oldPassword:oldPass,
                    newPassword:newPass,
                    confirmNewPassword:confirmNewPass
                }).then((data)=>{
                    toast.success(data.data.message);
                    closeModal(false);
                    setLoader(false);
                }).catch((err)=>{
                    toast.warn(err.response.data.message);
                    setLoader(false);
                }).finally(()=>{
                    setLoader(false);
                })
            }
            else{
                toast.warn('Password and Confirm Password must be same.');
            }
        }
    }

  return (
    <div className="review-modal container">
        <div className="modal">
            <div className="title">
                <h3>Change Password</h3>
            </div>
            <div className="text">
                <input type="password" onChange={(e)=>{setOldPass(e.target.value)}} name="oldPass" required placeholder='Old Password' />
                <input type="password" onChange={(e)=>{setNewPass(e.target.value)}} name="newPass" required placeholder='New Password' />
                <input type="password" onChange={(e)=>{setConfirmNewPass(e.target.value)}} name="confirmNewPass" required placeholder='Confirm New Password' />
            </div>
            <div className='btns'>
                <a onClick={()=>closeModal(false)}>Cancel</a>
                <button onClick={changePass}>Change<FaExchangeAlt/></button>
            </div>
        </div>
    </div>
  )
}

export default ChangePasswordModal