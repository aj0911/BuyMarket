import React, { useEffect, useRef, useState } from 'react'
import './ViewModalUser.css'
import {toast} from 'react-toastify'
import api from 'axios'
import Loader from '../../../Extra/Loader/Loader';
import {useSelector} from 'react-redux'



const ViewModal = ({user_id,setViewModal,loader,setLoader,urlPrefix}) => {
    //states 
    const [user,setUser] = useState('');
    const [editModal,setEditModal] = useState(false);
    const select = useRef();
    const auth = useSelector(state=>state.auth);

    const getUser = (id)=>{
        setLoader(true);
        api.create({withCredentials:true}).get(urlPrefix+'/admin/users/'+id).then((res)=>{
          if(res.data.success){
            setUser(res.data.user);
          }
          setLoader(false);
        }).catch((error)=>{
          toast.warn(error.message);
          setLoader(false);
        }).finally(()=>{
          setLoader(false);
        })
    }
    const formSub = (e)=>{
        e.preventDefault();
        if(editModal){
            if(auth.user._id===user_id){
                toast.warn('You can\'t change your own role.')
                setViewModal(false);
            }
            else{
                if(select.current.value==='null'){
                    toast.warn('Role is mandatory for a user.')
                }
                else{
                    setLoader(true);
                    api.create({withCredentials:true}).put(urlPrefix+'/admin/users/'+user_id,{
                        role:select.current.value
                    }).then((res)=>{
                    if(res.data.success){
                        toast.success('Role updated successfully.');
                        setViewModal(false);
                        setLoader(false);
                    }
                    setLoader(false);
                    }).catch((error)=>{
                    toast.warn(error.message);
                    setLoader(false);
                    }).finally(()=>{
                    setLoader(false);
                    })
                }
            }
        }
        else{
            setViewModal(false);
        }
    }

    useEffect(()=>{
        getUser(user_id);
    },[editModal])
  return (
    <div className="viewModal">
        {
            (!loader)?
            <div className="modal">
                <div className="heading">
                    <h3>{(editModal)?'Edit Role':'View User'}</h3>
                </div>
                {
                    (user)?
                    <form onSubmit={(e)=>formSub(e)}>
                        {
                            (editModal)?'':
                                <div className="form-item">
                                    <label htmlFor="name">Name</label>
                                    <input readOnly type="text" value={user.name} name="name" placeholder='Name' />
                                </div>
                        }
                        {
                            (editModal)?'':
                                <div className="form-item">
                                    <label htmlFor="email">Email</label>
                                    <input readOnly type="text" value={user.email} name="email" placeholder='Email' />
                                </div>

                        }
                        <div className="form-item">
                            <label htmlFor='role'>Role</label>
                            {
                            (editModal)?
                            <select ref={select} name="role" >
                                <option selected = {(user)?false:true} value="null">Select Role</option>
                                <option selected = {(user.role ==='admin')?true:false} value="admin">Admin</option>
                                <option selected = {(user.role ==='user')?true:false}  value="user">User</option>
                            </select>
                            :
                            <input readOnly id='role' value={user.role[0].toUpperCase()+user.role.slice(1)} type="text" name="role" placeholder='Role' />
                            }
                            {
                                (editModal || auth.user._id===user_id)?''
                                :
                                    <button onClick={()=>setEditModal(true)} id="editRole">Edit Role</button>   
                            }
                        </div>
                        {
                            (editModal)?'':
                                <div className="form-item imgAvatar">
                                    <label>Avatar</label>
                                    <div className="avatar">
                                        <img src={user.avatar.url} alt="" />
                                    </div>
                                </div>
                        }
                            <div className="btns">
                                <button onClick={()=>setViewModal(false)} style={{display:(editModal)?'':'none'}}>Close</button>
                                <input type="submit" value={(editModal)?'Update Role':'Close'} />
                            </div>
                    </form>:''
                }
            </div>:''
        }
    </div>
  )
}

export default ViewModal