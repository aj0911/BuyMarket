import React from 'react'
import { BsFillMouseFill } from 'react-icons/bs'
import './Home.css'

const Hero = () => {
  return (
    <div className="hero container">
        <div className="text">
            <h3>Welcome to <span style={{color:'var(--textColor)'}}>BUY MARKET</span></h3>
            <h1>Find Amazing <span style={{color:'var(--textColor)'}}>Products</span>  Below</h1>
        </div>
        <a href='#featuredProduct'>Scroll Down <BsFillMouseFill/></a>
    </div>
  )
}

export default Hero