import React, { useEffect, useState } from 'react'
import Hero from './Hero'
import Product from './Product'
import Loader from '../Extra/Loader/Loader.jsx'
import NoLoad from '../Extra/NoLoad/NoLoad'
import api from 'axios'
import { useDispatch } from 'react-redux'
import { urlPrefix } from '../../Helper/Helper'

const Home = () => {

  //url
  const url = urlPrefix+'/products';

  //states
  const [data,setData] = useState('');
  const [err,setErr] = useState('');
  const [loader,setLoader] = useState(false);
  const dispatch = useDispatch();

  //get Products
  const getProducts = ()=>{
    setLoader(true)
        api.get(url).then((res)=>{
          if(res){
            setData(res.data)
            setLoader(false)
          }
        }).catch((exception)=>{
          setErr(exception)
          setLoader(false)
        }).finally(()=>{
          setLoader(false)
      })
  }

  const loadAuth = ()=>{
    setLoader(true)
    api.create({withCredentials:true}).get(urlPrefix+'/me').then((res)=>{
      if(res.data.success){
        dispatch({type:'login',
          payload:res.data.user
      });
        setLoader(false)
      }
    }).catch((err)=>{
      console.log(err)
      if(!err.response.data.success){
        dispatch({type:'logout'});
        setLoader(false)
      }
    }).finally(()=>{
      setLoader(false)
    })
  }

  //Use Effect to fetch products
  useEffect(()=>{
    loadAuth();
    getProducts();
  },[])

  return (
    (!loader)?
    <div className="home">
        <Hero/>
        {
          (data.success === 'true')?
          (data.product.length>0)?
          <div id='featuredProduct' className="products container">
            <div className="title">
              <h2>Featured <span style={{color:'var(--textColor)'}}>Products</span> </h2>
            </div>
            <div className="box">
              {
                  data.product.map((element,index)=>{
                    return (
                      <Product key={index} product={element}/>
                    )
                  })
              }
            </div>
          </div>:''
          :
          <NoLoad data = {{name:'No Product!!',text:err.message}}/>
        }
    </div>
    :
    <Loader/>
  )
}

export default Home