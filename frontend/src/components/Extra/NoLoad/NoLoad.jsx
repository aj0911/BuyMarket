import React, { useEffect } from 'react'

const NoLoad = ({data,color}) => {
  return (
    <div className="text" style={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
        padding:'50px 10px',
        width:'100%'
    }}>
        <h2 style={{
            fontSize:(window.innerWidth>600)?'3rem':((Window.innerWidth>300)?'2rem':'1rem'),
            color:(color === true)?'var(--textColor)':'var(--textColorWarn)',
            textTransform:'uppercase'
        }}>{data.name}</h2>
        <p style={{
            textAlign:'center',
            fontSize:(window.innerWidth>600)?'1.5rem':'.8rem'
        }}>{data.text}</p>
    </div>
  )
}

export default NoLoad