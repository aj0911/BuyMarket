import React, { useRef, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import api from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { urlPrefix } from '../../Helper/Helper';

const UpdateProfile = ({closeModal,user,setLoader}) => {
    //States
    const [name,setName] = useState(user.name);
    const [email,setEmail] = useState(user.email);
    const [avatar,setAvatar] = useState(user.avatar.url);
    const avatarPreview = useRef();
    const dispatch = useDispatch();

    //funcitons
    const fileChange = (e)=>{
        if (e.target.name === "avatar") {
            if(e.target.files[0]){
                const reader = new FileReader();
      
                reader.onload = () => {
                  if (reader.readyState === 2) {
                    avatarPreview.current.src = reader.result;
                    setAvatar(reader.result);
                  }
                };
          
                reader.readAsDataURL(e.target.files[0]);
                
            }
            else{
                avatarPreview.current.src = avatar;
                setAvatar(user.avatar.url);
            }
        }
    }

    const update = (e)=>{
        e.preventDefault();
        setLoader(true);
        api.create({withCredentials:true}).put(urlPrefix+'/me',{
            name,
            email,
            avatar
        }).then((res)=>{
            dispatch({type:'logout'});
            dispatch({type:'login',payload:res.data.user});
            toast.success(res.data.message);
            setLoader(false);
            closeModal(false);
        }).catch((err)=>{
            toast.warn(err.response.data.message);
            setLoader(false);
            closeModal(false);
        }).finally(()=>{
            setLoader(false);
            closeModal(false);
        })
    }

  return (
    <div className="review-modal container">
    <div className="modal">
        <div className="title">
            <h3>Update Profile</h3>
        </div>
        <form onSubmit={(e)=>update(e)}>
            <div className="text">
                <input type="name" onChange={(e)=>setName(e.target.value)} value={name}  name="Name"  placeholder='Name' required/>
                <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} name="Email"  placeholder='Email' required />
                <div className="file">
                    <input type="file" accept="image/*" onChange={e=>fileChange(e)} name="avatar" />
                    <img ref={avatarPreview} src={avatar} alt="" />
                </div>
                
            </div>
            <div className='btns'>
                <a onClick={()=>closeModal(false)}>Cancel</a>
                <button type='submit'>Edit<FaEdit/></button>
            </div>
        </form>

    </div>
</div>
  )
}

export default UpdateProfile