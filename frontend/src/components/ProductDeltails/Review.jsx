import React, { useState } from 'react'
// import imgUrl from '../../Assets/avatar3.jpg'
import ReactStars from 'react-rating-stars-component'
import api from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { urlPrefix } from '../../Helper/Helper'

const Review = ({review}) => {
    const options={
        edit:false,
        color:'rgba(20,20,20,.1)',
        activeColor:'var(--textColorDark)',
        size:Window.innerWidth<600?15:20,
        value:(review)?review.rating:5,
        isHalf:true
    }
    const [imgUrl,setImgUrl] = useState('');
    const getUser =()=>{
        api.create({withCredentials:true}).get(urlPrefix+`/admin/users/${review.user}`).then((res)=>{
            setImgUrl(res.data.user.avatar.url);
        }).catch((err)=>{
            toast.warn(err.response.data.message);
        })
    }

    useEffect(()=>{
        getUser();
    },[])
  return (
    (review)?
        
        <div className="review">
                <div className="img">
                    <img src={imgUrl} alt="" />
                </div>
                <div className="text">
                    <h3>{review.name}</h3>
                    <ReactStars {...options}/>
                    <p>{review.comment}</p>
                </div>
        </div>
    :''

  )
}

export default Review