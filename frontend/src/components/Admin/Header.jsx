import React, { useState } from 'react'
import './Header.css'
import { AiFillHome, AiOutlineSearch } from 'react-icons/ai'
import { ImSphere } from 'react-icons/im'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Header = ({searching,openMenu}) => {
    //states
    const auth = useSelector(state=>state.auth);
    
  return (
    <div className="header">
        <div onClick={openMenu} className="left">
            <h3>{(window.innerWidth>999)?'Buy market Admin':'BM'}</h3>
        </div>
        <div className="right">
            <div className="search">
                <input onChange={(e)=>searching(e.currentTarget.value)} type="text" placeholder='Search..' name="search"/>
                <AiOutlineSearch/>
            </div>
            <div className="sidebox">
                <div className="lang">
                    <ImSphere/>
                    <h3>English</h3>
                </div>
                <Link to={'/me'} className="avatar">
                    {
                        (auth.isAuth && auth.user.role ==='admin')?
                        <img src={auth.user.avatar.url} alt="auth.user.name" />:''
                    }
                </Link>
                <Link to={'/'} className='home'>
                    <AiFillHome/>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Header