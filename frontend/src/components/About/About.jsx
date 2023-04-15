import React from 'react'
import './About.css'
import Img from '../../Assets/avatar.jpg'
import {FaReact, FaRegAddressCard} from 'react-icons/fa'
import { AiFillHtml5, AiFillPhone, AiOutlineMail } from 'react-icons/ai'
import { SiCss3, SiJavascript } from 'react-icons/si'

const About = () => {
  return (
    <div className="about">
        <div className="left">
            <img src={Img} alt="" />
        </div>
        <div className="right">
            <div className="details">
                <h3>My Story</h3>
                <h2 style={{color:'var(--textColor)'}}>About Me</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et saepe reprehenderit sit, consectetur perspiciatis ut vero, ratione labore quaerat eius nam unde necessitatibus nihil deleniti libero cumque error ad. Quibusdam!</p>
            </div>
            <div className="details-others">
                <div className="detail">
                    <FaRegAddressCard/>
                    <h5>Address</h5>
                    <h5>:</h5>
                    <a href='https://www.google.co.in/maps/place/New+Delhi,+Delhi/@28.5275817,77.068554,11z/data=!3m1!4b1!4m6!3m5!1s0x390cfd5b347eb62d:0x52c2b7494e204dce!8m2!3d28.6139391!4d77.2090212!16zL20vMGRsdjA' target='_blank'>New Delhi, India</a>
                </div>
                <div className="detail">
                    <AiFillPhone/>
                    <h5>Phone No</h5>
                    <h5>:</h5>
                    <a href='tel:987654321'>+91 987-654-321</a>
                </div>
                <div className="detail">
                    <AiOutlineMail/>
                    <h5>Email ID</h5>
                    <h5>:</h5>
                    <a href='mailto:jhaabhinav16@gmail.com'>jhaabhinav16@gmail.com</a>
                </div>
            </div>
            <div className="expertise">
                <h3>My Expertise</h3>
                <ul>
                    <li>
                        <AiFillHtml5/>
                        <h4>HTML</h4>
                    </li>
                    <li>
                        <SiCss3/>
                        <h4>CSS</h4>
                    </li>
                    <li>
                        <SiJavascript/>
                        <h4>JavaScript</h4>
                    </li>
                    <li>
                        <FaReact/>
                        <h4>React Js</h4>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default About