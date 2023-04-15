import React, { useEffect, useRef } from 'react'
import ReactStars from 'react-rating-stars-component'
import { Link } from 'react-router-dom';

const Product = ({product}) => {
    const img = useRef();
    const options={
        edit:false,
        color:'rgba(20,20,20,.1)',
        activeColor:'var(--textColorDark)',
        size:Window.innerWidth<600?20:25,
        value:product.rating,
        isHalf:true
    }
  return (
        <Link to={`/product/${product._id}`} style={{color:'black'}} className="product">
            <div className="top">
                <img ref={img} src={product.images[0].url} alt="" />
            </div>
            <div className="middle">
                <h3>{product.name}</h3>
                <div className="review">
                    <ReactStars {...options}/>
                    <h4>({product.numberOfReviews} Reviews)</h4>
                </div>
            </div>
            <div className="lower">
                <h3>₹{product.price}</h3>
            </div>
        </Link>

  )
}

export default Product