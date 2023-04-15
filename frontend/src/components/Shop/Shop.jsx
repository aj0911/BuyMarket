import React, { useEffect, useState } from 'react'
import Loader from '../Extra/Loader/Loader';
import Filters from './Filters'
import './Shop.css'
import api from 'axios'
import { toast } from 'react-toastify';
import Product from '../Home/Product';
import Pagination from './Pagination';
import categories, { urlPrefix } from '../../Helper/Helper';
import NoLoad from '../Extra/NoLoad/NoLoad';

const Shop = () => {
    //States
    const [data,setData] = useState('');
    const [loader,setLoader] = useState(false);
    let maxPrice=750000;
    const [ lte, setLte ] = useState(maxPrice); 
    const [ gte, setGte ] = useState(0);
    const [rating,setRating] = useState(0);
    const [search , setSearch] = useState('');
    const [category ,setCategory] = useState('');
    const [page,setPage] = useState(1);
    let url = '';
    if(category !==''){
    url = `${urlPrefix}/products?price[lte]=${lte}&price[gte]=${gte}&keyword=${search}&category=${category}&page=${page}&rating[gte]=${rating}`;
    }
    else{
      url = `${urlPrefix}/products?price[lte]=${lte}&price[gte]=${gte}&keyword=${search}&page=${page}&rating[gte]=${rating}`
    }

    //getProducts
    const getProducts = ()=>{
        setLoader(true)
        api.create({withCredentials:true}).get(url).then((res)=>{
          if(res){
            setData(res.data)
            setLoader(false)
          }
        }).catch((exception)=>{
          console.log(exception)
          toast.warn(exception.response.data.message);
          setLoader(false)
        }).finally(()=>{
          setLoader(false)
      })
    }
    const priceSelector = (event, newValue) => {
      setLte(newValue[1]);
      setGte(newValue[0])
    };
    const ratingSelector = (event, newValue) => {
        setRating(newValue);
    };
    const categorySelector = (e) => {
        setCategory(e.currentTarget.innerText.toString());
        const childArr = e.currentTarget.parentNode.children;
        for(let i=0;i<e.currentTarget.parentNode.children.length;i++){
            childArr[i].classList.remove('active');
        }
        e.currentTarget.classList.add('active');
    };
    const resetFilters = (e)=>{
      setSearch('');
      setLte(maxPrice);
      setGte(0);
      setCategory('');
      setRating(0);
      setPage(1);
      const childArr = e.target.parentNode.parentNode.childNodes[2].childNodes;
      for(let i=0;i<childArr.length;i++){
        childArr[i].classList.remove('active');
      }
    }
    const handleSearch = val =>{setSearch(val);}

    //Rendering..
    useEffect(()=>{
      getProducts();
  },[lte,category,gte,rating,search,page])

  return (
    (data.success)?
    
    <div className="shop">
        <div className="title">
            <h3>My <span style={{color:'var(--textColor)'}}> SHOP</span></h3>
        </div>
        <div className="box">
            <Filters search={search} priceSelector={priceSelector} handleSearch={handleSearch} ratingSelector={ratingSelector} setLte={setLte} categorySelector = {categorySelector} rating={rating}  lte={lte} resetFilters = {resetFilters}  gte = {gte} categories = {categories} maxPrice = {maxPrice}/>
            {
              (!loader && data.success)?
              (data.product.length>0)?
              <div className="products">
              {
                  data.product.map((element,index)=>{
                      return (
                        <Product key={index} product={element}/>
                      )
                    })
              }
              </div>:<NoLoad data={{name:'No Product !!',text:'No product added By the Admin, Kindly contact to the Admin'}}/>
    
              :<Loader/>
            }

        </div>
        <Pagination page={page} setPage={setPage} totalProduct={data.totalProduct} count={data.count}/>
    </div>:<Loader/>
  )
}

export default Shop