import React, { useState } from 'react'
import './Header.css'
import { AiOutlineClose } from 'react-icons/ai'


const SideNav = ({setContent,sideNavRev,sidenavArr,closeMenu}) => {

  return (
    <div ref={sideNavRev} className="sidenav">
      <div onClick={closeMenu} className="close">
        <AiOutlineClose/>
      </div>
      {
        sidenavArr.map((element,i)=>{
          return (
            <div key={i} className="menu">
              <h5>{element.header}</h5>
              {
                element.items.map((x,j)=>{
                  return (
                    <div key={j} onClick={(e)=>{setContent(x.name);closeMenu(e);}} className="content">
                      {x.icon()}
                      <h3>{x.name}</h3>
                    </div>
                  );
                })
              }
              
            </div>
          )
        })
      }
    </div>
  )
}

export default SideNav