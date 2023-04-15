import React, { useEffect, useState } from 'react'
import Login from './Login'
import './LoginSignUp.css'
import api from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Extra/Loader/Loader'
import {useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import ForgetPassword from './ForgetPassword';
import { urlPrefix } from '../../Helper/Helper';

const LoginSignUp = () => {

  //states
  const Auth = useSelector(state=>state.auth);
  const dispatch = useDispatch();
  const [register,setRegister] = useState(false);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [avatar,setAvatar] = useState('');
  const [data,setData] = useState('');
  const [loader,setLoader] = useState(false);
  const navigate = useNavigate();
  const [forgetPass,setForgetPass] = useState(false);


  //Rendering..
  useEffect(()=>{
    if(Auth.isAuth){
      navigate('/');
      toast.success('You have Already Login');
    }
  },[])

  //function
  const login = (e)=>{
    setLoader(true);
    e.preventDefault();
    api.create({withCredentials:true}).post(urlPrefix+'/login',{email,password},).then((res)=>{
      if(res.data.success){
        toast.success(res.data.message);
        dispatch({
          type:'login',
          payload:res.data.user
      });
        navigate('/');
      }
      setLoader(false);
    }).catch((error)=>{
      toast.warn(error.response.data.message)
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
  }

  //function
  const signUpFunc = (e)=>{
    setLoader(true);
    e.preventDefault();
    api.create({withCredentials:true}).post(urlPrefix+'/register',{name,email,avatar,password}).then((res)=>{
      setData(res.data);
      if(res.data.success){
        toast.success(res.data.message);
        dispatch({type:'register',
        payload:res.data.user
      });
        navigate('/');
      }
      setLoader(false);
    }).catch((error)=>{
      toast.warn(error.response.data.message)
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
    
  }

  return (
    <div className="login-signup">
        <div className="wrapper">
          {(!loader)?
          <>
            <Login forgetPass={forgetPass} setForgetPass = {setForgetPass} setRegister = {setRegister} setEmail = {setEmail} setPassword = {setPassword}
             setAvatar={setAvatar} register = {register} name={name} email = {email} password = {password} login = {login} signUpFunc = {signUpFunc} setName = {setName}
            />
              {        
                (forgetPass)?
                  <ForgetPassword setLoader={setLoader} closeModal={setForgetPass}/>
                :''
              }
              </>
            :<Loader/>
          }
        </div>
    </div>
  )
}

export default LoginSignUp