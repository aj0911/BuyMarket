import React, { Fragment, useRef } from 'react'
import { BsCart } from 'react-icons/bs';
import './Header.css'

const Header = ({clickMenu}) => {
    const nav = useRef();
    document.addEventListener('scroll',()=>{
        if(window.scrollY>20){
            nav.current.classList.add('sticky')
        }
        if(window.scrollY<20){
            nav.current.classList.remove('sticky')
        }
    })
  return (
    <Fragment>
        <nav ref={nav} className='container'>
            <div className="nav">
                <div className="logo">
                    <h1>BUY MARKET</h1>
                </div>
                <div onClick={clickMenu} className="menu">
                    <div className="line"></div>
                </div>
            </div>
        </nav>
    
    </Fragment>
  )
}

export default Header