import React, { useState } from 'react'
import ReactStars from 'react-rating-stars-component';
import api from 'axios';
import {toast} from 'react-toastify'
import { urlPrefix } from '../../Helper/Helper';

const ReviewModal = ({closeReviewModal,productId,setLoader}) => {
    //states
    const [rating,setRating] = useState(0);
    const [comment,setComment] = useState('');

    //options for star Ratings
    const options={
        color:'rgba(20,20,20,.1)',
        activeColor:'var(--textColorDark)',
        size:Window.innerWidth<600?20:25,
        isHalf:true
    }

    //functions
    const ratingChanged = (newRating) => {
        setRating(newRating)
      };

    const postReview = ()=>{
        if(rating >0 && comment !== '' && productId){
            setLoader(true)
            api.create({withCredentials:true}).put(urlPrefix+'/review',{
                productId,
                rating,
                comment
            }).then((res)=>{
                toast.success(res.data.message);
                closeReviewModal(false);
            }).catch((err)=>{
                toast.warn(err.response.data.message);
                closeReviewModal(false);
            }).finally(()=>{
                setLoader(false);
            })
            
        }
        else{
            toast.warn('All Field is mandatory')
        }
    }
  return (
    <div className="review-modal container">
        <div className="modal">
            <div className="title">
                <h3>Submit Review</h3>
            </div>
            <ReactStars onChange={ratingChanged} {...options}/>
            <textarea placeholder='Add Review' onChange={(e)=>setComment(e.target.value)} required></textarea>
            <div className="btns">
                <button onClick={()=>closeReviewModal(false)}>Cancel</button>
                <button onClick={postReview}>Submit</button>
            </div>
        </div>
    </div>
  )
}

export default ReviewModal