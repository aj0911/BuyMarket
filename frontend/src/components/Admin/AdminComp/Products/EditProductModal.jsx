import React, { useEffect, useRef, useState } from 'react'
import categories from '../../../../Helper/Helper';
import Loader from '../../../Extra/Loader/Loader';
import api from 'axios'
import {toast} from 'react-toastify'
import NoLoad from '../../../Extra/NoLoad/NoLoad';

const EditProductModal = ({setEditProductModal,productId,urlPrefix}) => {
    //states
    const [images,setImages ]= useState([]);
    const [loader ,setLoader] = useState(false);
    const imageParent = useRef();
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [price,setPrice] = useState('');
    const [category,setCategory] = useState('');
    const [stock,setStock] = useState('');
    const [data,setData] = useState('');
    const [err,setErr] = useState('')

    //functions
    const getProduct = ()=>{
        setLoader(true);
        api.create({withCredentials:true}).get(`${urlPrefix}/admin/products/${productId}`).then((res)=>{
          setData(res.data);
          setName(res.data.product.name);
          setDescription(res.data.product.description);
          setPrice(res.data.product.price);
          setCategory(res.data.product.category);
          setStock(res.data.product.stock);
          setLoader(false);
        }).catch((error)=>{
          setErr(error);
          setLoader(false);
        }).finally(()=>{
          setLoader(false);
        })
    }

    const fileUpload=(e)=>{
        setLoader(true);
        const arr =[];
        imageParent.current.innerHTML = ''
        if (e.target.name === "images") {
            for(let i=0;i<e.target.files.length;i++){
                if(e.target.files[i]){
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (reader.readyState === 2) {
                        imageParent.current.innerHTML += `<img src =${reader.result} />`
                        arr.push(reader.result);
                      }
                    };
                    reader.readAsDataURL(e.target.files[i]);
                }
            }
            setImages(arr);
        }
        setLoader(false);
        
    }

    const editProduct = (e)=>{
        e.preventDefault();
        if(category ===''){
            toast.warn('Category is mandatory!!')
        }
        else{
            setLoader(true);
            api.create({withCredentials:true}).put(`${urlPrefix}/admin/products/${productId}`,{
                name,
                description,
                price,
                category,
                stock,
                images
            }).then((res)=>{
              toast.success(res.data.message);
              setLoader(false);
              setEditProductModal(false);
            }).catch((error)=>{
                toast.warn(error.response.data.message);
              setLoader(false);
            }).finally(()=>{
              setLoader(false);
            })
        }
    }
    

    useEffect(()=>{
        getProduct();
    },[])


  return (
    <div className="viewModal">
    <div className="modal">
        <div className="heading">Edit Product</div>
        {
            (loader)?<Loader/>:
            (data.success)?
            <form onSubmit={(e)=>{editProduct(e)}}>
                <div className="form-item">
                    <label htmlFor="name">Name</label>
                    <input value={name} onChange={(e)=>setName(e.currentTarget.value)} required type="text" name='name' />
                </div>
                <div className="form-item">
                    <label htmlFor="des">Description</label>
                    <textarea value={description} onChange={(e)=>setDescription(e.currentTarget.value)} required name="des"></textarea>
                </div>
                <div className="form-item">
                    <label htmlFor="price">Price</label>
                    <input value={price} onChange={(e)=>setPrice(e.currentTarget.value)} required type="number" name='price' />
                </div>
                <div className="form-item">
                    <label htmlFor="category">Category</label>
                    <select onChange={(e)=>setCategory(e.currentTarget.value)} name="category">
                        <option  value=''>Select Category</option>
                        {
                            categories.map((e,i)=>{
                                return (
                                    <option selected={(category===e)?true:false} key={i} value={e}>{e}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="form-item">
                    <label htmlFor="stock">Stock</label>
                    <input value={stock} onChange={(e)=>setStock(e.currentTarget.value)} required type="number" name='stock' />
                </div>
                <div className="form-item">
                    <label htmlFor="images">Images</label>
                    <input onChange={(e)=>fileUpload(e)}  type="file" multiple accept="image/*" name='images' />
                    <div ref={imageParent} className="images">
                        {
                            data.product.images.map((e,i)=>{
                                return (
                                    <img key={i} src={e.url} alt="" />
                                )
                            })
                        }
                    </div>
                </div>

                <div className="btns">
                    <a onClick={()=>setEditProductModal(false)}>Cancel</a>
                    <input type="submit" value="Edit" />
                </div>
            </form>:<NoLoad data={{name:err.status,text:err.message}}/>
        }
    </div>
</div>
  )
}

export default EditProductModal