import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../../Assets/default.jpg'

const Login = ({forgetPass,setForgetPass,setPassword,setEmail,setRegister,name,email,password,register,setName,login,signUpFunc,avatar,setAvatar}) => {
    //states
    const signUp = useRef();
    const avatarPreview = useRef();

    //signIn
    const slide = ()=>{
        signUp.current.classList.add('register');
        setRegister(true);
        setName('')
        setEmail('')
        setPassword('');
    }
    //SignUp
    const slideAgain = ()=>{
        signUp.current.classList.remove('register')
        setRegister(false);
        setName('')
        setEmail('')
        setPassword('');
    }
    const fileUpload=(e)=>{
        if (e.target.name === "avatar") {
            if(e.target.files[0]){
                const reader = new FileReader();
      
                reader.onload = () => {
                  if (reader.readyState === 2) {
                    avatarPreview.current.src = reader.result;
                    setAvatar(reader.result);
                  }
                };
          
                reader.readAsDataURL(e.target.files[0]);
                
            }
            else{
                avatarPreview.current.src = Avatar;
                setAvatar('');
            }
        }
    }
  return (
    <div className="login" style={{
        filter:(forgetPass)?'blur(5px)':''
    }} ref={signUp}>
        <div className="left">
            {
            (!register)?
                <>
                <div className="heading">
                    <h2>Sign In</h2>
                </div>
                <form onSubmit={(e)=>login(e)}>
                    <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder='Email' value={email} name="email" required/>
                    <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder='Password' value={password} name="password" required/>
                    <a onClick={()=>setForgetPass(true)}>forget password?</a>
                    <input type="submit" value="Sign In" />
                </form>
                </>
            :<>
                 <div className="heading">
                        <h2>Create Account</h2>
                </div>
                <form onSubmit={(e)=>signUpFunc(e)}>
                        <input type="text" onChange={(e)=>setName(e.target.value)} placeholder='Name' value={name} name="name"   required/>
                        <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder='Email' value={email} name="email" required/>
                        <div className="pic">
                            <input onChange={fileUpload} type="file" accept="image/*"  placeholder='Insert Profile Pic' name="avatar" required/>
                            <img ref={avatarPreview} src={Avatar} alt="" />
                        </div>
                        
                        <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder='Password' value={password} name="passowrd" required/>
                        <input type="submit" value="Sign Up" />
                </form>
            </>
            }
        </div>
        <div className="right">
            {
            (!register)?
                <>
                <div className="heading">
                    <h2>Hello, Friend!</h2>
                </div>
                <p>Enter your details and start journey with us.</p>
                <button onClick={slide}>Sign Up</button>
                </>
            :<>
                <div className="heading">
                    <h2>Welcome Back!!</h2>
                </div>
                <p>To keep connected with us, please login with your personal info.</p>
                <button onClick={slideAgain}>Sign In</button>
            </>
        }
        </div> 
    </div>
  )
}

export default Login