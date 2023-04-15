import React, { useEffect, useRef, useState } from 'react'
import './Reviews.css'
import '../Users/Users.css'
import Loader from '../../../Extra/Loader/Loader';
import NoLoad from '../../../Extra/NoLoad/NoLoad';
import api from 'axios'
import {toast} from 'react-toastify'
import ReviewViewModal from './ReviewViewModal';
import { urlPrefix } from '../../../../Helper/Helper';

const Reviews = () => {
  //states
  const [data,setData] = useState('');
  const [reviewData,setReviewData] = useState('');
  const [err,setErr] = useState('');
  const [loader,setLoader] = useState(false);
  const [deleteModal,setDeleteModal] = useState(false);
  const [productId,setProductId] = useState('');
  const [reviewId,setReviewId] = useState(''); 
  const selecter = useRef();
  const [reviewViewModal,setReviewViewModal] = useState(false);
  const [review,setReview] = useState('');
  const [product,setProduct] = useState('');

    //Functions
    const getProducts = ()=>{
      setLoader(true);
      api.create({withCredentials:true}).get(`${urlPrefix}/products`).then((res)=>{
        setData(res.data);
        setLoader(false);
      }).catch((error)=>{
        setErr(error);
        setLoader(false);
      }).finally(()=>{
        setLoader(false);
      })
    }

    const getProductReview = (e)=>{
      setProductId(e.currentTarget.value);
      setProduct(e.currentTarget.value);
    }

    const getReviews = (id)=>{
      if(id !==''){
        setLoader(true);
        api.create({withCredentials:true}).get(`${urlPrefix}/admin/review/`+id).then((res)=>{
          setReviewData(res.data);
          setProduct(res.data.product);
          setLoader(false);
        }).catch((error)=>{
          toast.warn(error.message);
          setLoader(false);
        }).finally(()=>{
          setLoader(false);
        })
      }
    }

    const delClick = (reviewID)=>{
      setReviewId(reviewID);
      setProductId(selecter.current.value);
      setDeleteModal(true);
    }

    const deleteReview = (e)=>{
      e.preventDefault();
      setLoader(true);
      api.create({withCredentials:true}).delete(urlPrefix+`/admin/review?productId=${productId}&Id=${reviewId}`).then((res)=>{
        console.log(res);
        toast.success(res.data.message);
        setLoader(false);
        setDeleteModal(false);
      }).catch((error)=>{
        console.log(error.response.data.message);
      toast.warn(error.response.data.message);
      setLoader(false);
      }).finally(()=>{
      setLoader(false);
      })
    }

    useEffect(()=>{
      getProducts();
      if(productId!==''){
        getReviews(productId);
      }
    },[productId,deleteModal,reviewViewModal])

  return (
    <>
    {
      (loader)?<Loader/>:
      (data.success)?
      <div className="users" style={{display:(deleteModal || reviewViewModal)?'none':''}}>
        <div className="heading">
          <h3>Product Reviews</h3>
          <div className="search">
            <select ref={selecter} onChange={(e)=>getProductReview(e)}>
              <option selected={(productId==='')?true:false} value="">Select Product</option>
              {
                data.products.map((product,i)=>{
                  return (
                    <option selected={(productId===product._id)?true:false} value={product._id}>{product.name}</option>
                  )
                })
              }
            </select>
          </div>
        </div>
        {
          (productId==='')?<NoLoad data={{name:'Search a Product',text:'To view the product\'s review, Kindly select a product first.'}} color={true}/>
          :(reviewData.success)?
          <>
          <div className="info" >
            <h3>Total Rating : {reviewData.rating}</h3>
            <h3>Number of Reviews : {reviewData.reviews.length}</h3>
          </div>
          <table className="user-table">
            <thead>
              <td>Name</td>
              <td>Rating</td>
              <td>Actions</td>
            </thead>
            <tbody>
              {
                reviewData.reviews.map((e,i)=>{
                  return (
                    <tr key={i}>
                      <td data-label="Name">{e.name}</td>
                      <td data-label="Rating">{e.rating}</td>
                      <td data-label="Actions">
                        <div className="btns">
                        <button onClick={()=>{setReview(e);setReviewViewModal(true)}} >View</button>
                        <button onClick={()=>{delClick(e._id)}}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>  
          </>
          :''
        }
      </div>:<NoLoad data={{name:'404 Products Not Found!!',text:err.message}}/>
    }
    {
      (deleteModal)?
      <div className="viewModal">
        <div id='deleteModal' className="modal">
          <div className="heading">
            Are You sure to delete the Product Review?
          </div>
          <form onSubmit={(e)=>{deleteReview(e)}}>
            <div className="btns">
              <a onClick={()=>setDeleteModal(false)}>Cancel</a>
              <input type="submit" value={'Delete'} />
            </div>
          </form>
        </div>
      </div>
      :''
    }
    {
      (reviewViewModal)?<ReviewViewModal product = {product} setReviewViewModal = {setReviewViewModal}  review = {review} />:''
    }
    </>
  )
}

export default Reviews