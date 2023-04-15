import React, { Fragment } from 'react'
import {BsFacebook, BsInstagram, BsWhatsapp} from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import './Footer.css'

const Footer = (props) => {
  const navlinkStyle = ({isActive})=>{
    return {
      color:(isActive)?'var(--textColor)':'black'
    }
  }
  return (
    <Fragment>
      <footer className='container'>
        <div className="logo">
          <h1>buy market</h1>
        </div>
        <div className="links">
        <ul>
            <li><NavLink style={navlinkStyle} to={'/'}><a>Home</a></NavLink></li>
            <li><NavLink style={navlinkStyle} to={'/shop'}><a>Shop</a></NavLink></li>
            <li><NavLink style={navlinkStyle} to={'/cart'}><a>Cart</a></NavLink></li>
            <li><NavLink style={navlinkStyle} to={'/about'}><a>About</a></NavLink></li>
            <li><NavLink style={navlinkStyle} to={'/contact'}><a>Contact</a></NavLink></li>
        </ul>
        </div>
        <div className="share">
          <div className="box">
            <a href="#"><BsFacebook/></a>
          </div>
          <div className="box">
            <a href="#"><BsWhatsapp/></a>
          </div>
          <div className="box">
            <a href="#"><BsInstagram/></a>
          </div>
        </div>
        <div className="copyright">
          <p>&copy;BUY MARKET.All Rights Reserved-{new Date(Date.now()).getFullYear()}</p>
        </div>
      </footer>
    </Fragment>
  )
}

export default Footer