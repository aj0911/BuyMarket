import React, { useEffect, useRef, useState } from 'react'
import categories from '../../../../Helper/Helper'
import Loader from '../../../Extra/Loader/Loader';
import {toast} from 'react-toastify'
import api from 'axios'

const AddProductModal = ({setAddProductModal,urlPrefix}) => {
    //states
    const [images,setImages ]= useState([]);
    const [loader ,setLoader] = useState(false);
    const imageParent = useRef();
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [price,setPrice] = useState('');
    const [category,setCategory] = useState('');
    const [stock,setStock] = useState('');


    //functions
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

    const addProduct = (e)=>{
        e.preventDefault();
        if(category ===''){
            toast.warn('Category is mandatory!!')
        }
        else{
            setLoader(true);
            api.create({withCredentials:true}).post(`${urlPrefix}/admin/products/new`,{
                name,
                description,
                price,
                category,
                stock,
                images
            }).then((res)=>{
              toast.success(res.data.message);
              setLoader(false);
              setAddProductModal(false);
            }).catch((error)=>{
                toast.warn(error.response.data.message);
              setLoader(false);
            }).finally(()=>{
              setLoader(false);
            })
        }
    }


  return (
    <div className="viewModal">
        <div className="modal">
            <div className="heading">Add Product</div>
            {
                
                (loader)?<Loader/>:
                <form onSubmit={e=>addProduct(e)}>
                    <div className="form-item">
                        <label htmlFor="name">Name</label>
                        <input onChange={(e)=>setName(e.currentTarget.value)} required type="text" name='name' />
                    </div>
                    <div className="form-item">
                        <label htmlFor="des">Description</label>
                        <textarea onChange={(e)=>setDescription(e.currentTarget.value)} required name="des"></textarea>
                    </div>
                    <div className="form-item">
                        <label htmlFor="price">Price</label>
                        <input onChange={(e)=>setPrice(e.currentTarget.value)} required type="number" name='price' />
                    </div>
                    <div className="form-item">
                        <label htmlFor="category">Category</label>
                        <select onChange={(e)=>setCategory(e.currentTarget.value)} name="category">
                            <option  value=''>Select Category</option>
                            {
                                categories.map((e,i)=>{
                                    return (
                                        <option key={i} value={e}>{e}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="form-item">
                        <label htmlFor="stock">Stock</label>
                        <input onChange={(e)=>setStock(e.currentTarget.value)} required type="number" name='stock' />
                    </div>
                    <div className="form-item">
                        <label htmlFor="images">Images</label>
                        <input required onChange={(e)=>fileUpload(e)} type="file" multiple accept="image/*" name='images' />
                        <div ref={imageParent} className="images"></div>
                    </div>

                    <div className="btns">
                        <a onClick={()=>setAddProductModal(false)}>Cancel</a>
                        <input type="submit" value="Add" />
                    </div>
                </form>
            }
        </div>
    </div>
  )
}

export default AddProductModal