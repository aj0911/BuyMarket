import React, { useEffect,useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import avatar from '../../Assets/avatar3.jpg'
import './Me.css'
import { FaEdit, FaExchangeAlt, FaFirstOrder, FaSignOutAlt } from 'react-icons/fa'
import api from 'axios'
import Loader from '../Extra/Loader/Loader'
import { toast } from 'react-toastify'
import ChangePasswordModal from './ChangePasswordModal'
import UpdateProfile from './UpdateProfile'
import { urlPrefix } from '../../Helper/Helper'

const Me = () => {
    //States
    const auth = useSelector(state=>state.auth)
    const navigate = useNavigate();
    const [data,setData] = useState('');
    const [error,setError] = useState('');
    const [loader,setLoader] = useState(false);
    const dispatch = useDispatch();
    const [changePasswordModal,setChangePasswordModal] = useState(false);
    const [updateModal,setUpdateModal] = useState(false);

    //Functions
    const getUser = ()=>{
      setLoader(true);
      api.create({withCredentials:true}).get(urlPrefix+'/me').then((res)=>{
        setData(res.data);
        setLoader(false);
      }).catch((err)=>{
        toast.warn(err.response.data.message);
        setLoader(false);
      }).finally(()=>{
        setLoader(false);
      })
    }
    const logout = ()=>{
      api.create({withCredentials:true}).get(urlPrefix+'/logout').then((res)=>{
        toast.success(res.data.message);
        navigate('/')
      }).catch((err)=>{
        toast.warn(err.response.data.message);
      })
    }

    //Rendering..
    useEffect(()=>{
        if(!auth.isAuth){
          navigate('/login');
        }
        getUser();
    },[auth.isAuth,changePasswordModal,updateModal])


  return (
    (!loader && data.success)?
    <div className="me container" >
        <div className="profile" style={{
      filter:(changePasswordModal || updateModal)?'blur(5px)':''
    }}>
          <div className="left">
            <h3>My <span style={{color:'var(--textColor)'}}>Profile</span></h3>
            <div className="pic">
              <img src={data.user.avatar.url} alt="" />
            </div>
            <button onClick={()=>setUpdateModal(true)}>Edit Profile<FaEdit/></button>
          </div>
          <div className="right">
            <div className="info">
              <div className="topic">
                <h4>Full Name</h4>
                <h5>{data.user.name}</h5>
              </div>
              <div className="topic">
                <h4>Email</h4>
                <h5>{data.user.email}</h5>
              </div>
              <div className="topic">
                <h4>Role</h4>
                <h5>{data.user.role}</h5>
              </div>
            </div>
            <div className="btns">
              <Link to={'myOrders'}><button>My Orders<FaFirstOrder/> </button></Link>
              <button onClick={()=>setChangePasswordModal(true)}>Change Password<FaExchangeAlt/></button>
            </div>
              <button onClick={logout}>Logout?<FaSignOutAlt/></button>
          </div>
        </div>
        {
          (changePasswordModal)?<ChangePasswordModal setLoader={setLoader} closeModal={setChangePasswordModal}/>:''
        }
        {
          (updateModal)?<UpdateProfile user={data.user} setLoader={setLoader} closeModal={setUpdateModal}/>:''
        }
    </div>
    :
    <Loader/>
  )
}

export default Me