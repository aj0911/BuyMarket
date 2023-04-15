import React, { useEffect, useState } from 'react'
import imgUrl from '../../Assets/avatar3.jpg'
import {FaHome, FaShoppingBag, FaShoppingCart} from 'react-icons/fa'
import {RiContactsFill, RiDashboard2Fill} from 'react-icons/ri'
import { IoMdContact} from 'react-icons/io'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from 'axios';
import { toast } from 'react-toastify'
import { urlPrefix } from '../../Helper/Helper'

const Links = (props) => {
  const navlinkStyle = ({isActive})=>{
    return {
      color:(isActive)?'var(--textColorWarn)':'black'
    }
  }

  const auth = useSelector(state=>state.auth);
  const [data,setData] = useState('');
  const [error,setError] = useState('');
  const navigate = useNavigate();
  

  //functions
  const getUser = ()=>{
    api.create({withCredentials:true}).get(urlPrefix+'/me').then((res)=>{
      setData(res.data);
    }).catch((err)=>{
      setError(err);
    })
  }



  //Render
  useEffect(()=>{
    if(auth.isAuth){
      getUser();
    }
})
  return (
    <div className="links">
    {      
        (auth.isAuth && data.success)?
          <Link className="profile" onClick={props.activeClick} to={'/me'}>
              <div className="pic">
              <img src={data.user.avatar.url} alt="" />
              </div>
              <h3>{data.user.name}</h3>
          </Link>
          :
        <Link onClick={props.activeClick} to={'/login'}>
          <button id='login-btn'>Login</button>
        </Link>
    }

        <ul>
            <li><NavLink onClick={props.activeClick} to={'/'} style={navlinkStyle}>Home <FaHome/></NavLink></li>
            {
            (auth.isAuth)?(auth.user && auth.user.role==='admin')?
            <li><NavLink onClick={props.activeClick} to={'/admin'} style={navlinkStyle}>Dashboard <RiDashboard2Fill/></NavLink></li>
            :'':''
           }
            <li><NavLink onClick={props.activeClick} to={'/shop'} style={navlinkStyle}>Shop <FaShoppingBag/></NavLink></li>
            <li><NavLink onClick={props.activeClick} to={'/cart'} style={navlinkStyle}>Cart <FaShoppingCart/></NavLink></li>
            <li><NavLink onClick={props.activeClick} to={'/about'} style={navlinkStyle}>About <IoMdContact/> </NavLink></li>
            <li><NavLink onClick={props.activeClick} to={'/contact'} style={navlinkStyle}>Contact <RiContactsFill/></NavLink></li>
        </ul>
    </div>
  )
}

export default Links