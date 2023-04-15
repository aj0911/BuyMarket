import React, { useEffect, useRef, useState } from 'react'
import './ProductDetails.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import ReactStars from 'react-rating-stars-component';
import Review from './Review';
import { useNavigate, useParams } from 'react-router-dom';
import {BsFileMinusFill, BsFilePlusFill} from 'react-icons/bs'
import api from 'axios'
import ReviewModal from './ReviewModal';
import Loader from '../Extra/Loader/Loader';
import NoLoad from '../Extra/NoLoad/NoLoad';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { urlPrefix } from '../../Helper/Helper';


const ProductDetails = () => {
    //States
    const [loader,setLoader] = useState(false);
    const [xcart,setXCart] = useState(false);
    const [data,setData] = useState('');
    const [error,setError] = useState('');
    const [quantity,setQuantity] = useState(0);
    const [reviewModal,setReviewModal] = useState(false)
    const auth = useSelector(state=>state.auth);
    const cart = useSelector(state=>state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    //Geting Id
    const Id = useParams().id;
    const url = `${urlPrefix}/admin/products/${Id}`;

    //functions
    const getProduct = ()=>{
        setLoader(true)
        api.create({withCredentials:true}).get(url).then((res)=>{
            setData(res.data);
            setLoader(false)
        }).catch((err)=>{
            setError(err);
            toast.warn(err.response.data.message);
            setLoader(false)
        }).finally(()=>{
            setLoader(false)
        })
    }
    const scrollDown = ()=>{
        document.querySelector('.product-details .product .main-box').scrollIntoView();
    }

    const addToCart = ()=>{
        setQuantity(quantity+1);
        dispatch({
            type:'addToCart',
            payload:{
                user:auth.user,
                cart:{
                        product:{
                            id:Id,
                            name:data.product.name,
                            img:data.product.images[0].url,
                            category:data.product.category,
                            stock:data.product.stock,
                            price:data.product.price
                        },
                        quantity:quantity+1
                    }
            }
        });
        toast.success('Added To Cart Successfully.')
        if(xcart){
            setXCart(false);
        }
        else{
            setXCart(true);
        }
    }

    const reduceToCart = ()=>{
        setQuantity(quantity-1);
        dispatch({
            type:'removeFromCart',
            payload:{
                user:auth.user,
                product:{
                    id:Id,
                    name:data.product.name,
                    img:data.product.images[0].url,
                    category:data.product.category,
                    stock:data.product.stock,
                    price:data.product.price
                }
            }
        });
        toast.success('Removed From Cart Successfully.')
        if(xcart){
            setXCart(false);
        }
        else{
            setXCart(true);
        }
    }
    //Hooks for Get Product
    useEffect(()=>{
        setLoader(true)
        if(!auth.isAuth){
            toast.warn('login to Access this resource')
           return navigate('/login');
        }
        setLoader(false)
        getProduct();
        //body css
        if(reviewModal){
            document.body.style.setProperty('height','100vh');
            document.body.style.setProperty('overflow','hidden'); 
        }
        else{
            document.body.style.setProperty('height','');
            document.body.style.setProperty('overflow','');
        }
        cart.forEach((element)=>{
            if(element.user._id === auth.user._id){
                element.cart.forEach((item)=>{
                    if(item.product.id === Id){
                        setQuantity(item.quantity);
                        return
                    }
                })
            }
        })
    },[url,reviewModal,xcart])

    //options for star Ratings
    const options={
        edit:false,
        color:'rgba(20,20,20,.1)',
        activeColor:'var(--textColorDark)',
        size:Window.innerWidth<600?20:25,
        value:(data.product)?data.product.rating: 5,
        isHalf:true
    }

  return (
    (!loader)?
    <div className="product-details  container">
        <div className="product" style={{
            filter:(reviewModal)?'blur(5px)':''
        }}>
            <div className="logo">
                <div className="title">
                    <h3>Product <span style={{color:'var(--textColor)'}}>Details</span> </h3>
                </div>
            </div>
            {
                (data.success)?
                    <>
                        <div className="main-box">
                        <div className="left">
                            <Swiper pagination={true} modules={[Pagination]}>
                                {
                                    data.product.images.map((element ,key)=>{
                                        return (
                                        <SwiperSlide key={key}><img src={element.url} alt="" /></SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>
                        </div>
                        <div className="right">
                            <div className="top">
                                <h3>{data.product.name}</h3>
                                <p>Product # {data.product._id}</p>
                            </div>
                            <div className="rating">
                                <ReactStars {...options}/>
                                ({data.product.numberOfReviews} Reviews)
                            </div>
                            <div className="middle">
                                <div className="price">
                                    <h3>₹{data.product.price}</h3>
                                </div>
                                {
                                    (data.product.stock>0)?
                                        <div className="box">
                                        <div className="quantity">
                                            {
                                                (quantity>0)?
                                                <BsFileMinusFill onClick={reduceToCart} className='icon'/>:''
                                            }
                                            <p>{quantity}</p>
                                            {
                                                (quantity < data.product.stock)?
                                                <BsFilePlusFill onClick={addToCart} className='icon'/>:''
                                            }
                                        </div>
                                        {
                                            (quantity < data.product.stock)?
                                            <div className="cart">
                                                <a href='#' onClick={addToCart}>Add to Cart</a>
                                            </div>
                                            :''
                                        }
                                        
                                        </div>
                                    :''
                                }
                                
                            </div>
                            <div className="stock">
                                <h5>Status: <span>{(data.product.stock>0)?`InStock-${data.product.stock}`:'Out of Stock'}</span></h5>
                            </div>
                            <div className="description">
                                <h4>Description:</h4>
                                <p>{data.product.description}</p>
                            </div>
                            <div className="submit">
                                <a onClick={()=>{setReviewModal(true);scrollDown()}}>Submit Review</a>
                            </div>
                        </div>
                        </div>
                        <div className="reviews">
                            <div className="title">
                                <h3>Product <span style={{color:'var(--textColor)'}}>Reviews</span></h3>
                            </div>
                            <div className="review-box">
                                {
                                    (data.product)?
                                    ((data.product.reviews.length>0)?
                                    data.product.reviews.map((element,key)=>{
                                        return (
                                            <Review  key={key} review = {element}/> 
                                        )
                                    })
                                    :<NoLoad data = {{name:'No Product Reviews!!',text:'No User added the review yet. Kindly give a review to the product.'}}/>)
                                    :''
                                }
                            </div>
                        </div>
                        
                    </>
                :<NoLoad data = {{name:'No Product Details!!',text:error.message}}/>
            }
            
        </div>
        {(reviewModal)?<ReviewModal setLoader = {setLoader} productId={Id} closeReviewModal = {setReviewModal}/>:''}
    </div>
    :<Loader/>
  )
}

export default ProductDetails