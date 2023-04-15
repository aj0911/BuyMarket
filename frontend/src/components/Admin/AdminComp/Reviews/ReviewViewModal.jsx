import React from 'react'
import {BsDoorClosedFill} from 'react-icons/bs'

const ReviewViewModal = ({setReviewViewModal,review,product}) => {
  return (
    <div className="viewModal">
        <div className="modal">
            <div className="heading">View Review</div>
            <div className="email">
                <div className="top">
                    <div className="left">
                        <img src={product.images[0].url} alt="" />
                        <div className="left-text">
                            <h3>{product.name}</h3>
                            <h5>by {review.name}</h5>
                        </div>
                    </div>
                </div>
                <div className="middle">
                    <h4>Rating : {review.rating}</h4>
                    <p>{review.comment}</p>
                </div>
                <div className="btns">
                    <button onClick={()=>setReviewViewModal(false)}><BsDoorClosedFill/>Close</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ReviewViewModal