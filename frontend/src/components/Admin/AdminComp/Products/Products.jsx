import React, { useEffect, useState } from 'react'
import '../Users/Users.css'
import './Products.css'
import {FaGreaterThan, FaLess, FaLessThan, FaPlus,  FaSearch, FaTrash} from 'react-icons/fa'
import api from 'axios'
import Loader from '../../../Extra/Loader/Loader'
import NoLoad from '../../../Extra/NoLoad/NoLoad'
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import AddProductModal from './AddProductModal'
import EditProductModal from './EditProductModal'
import { getFullDate, urlPrefix } from '../../../../Helper/Helper'

const Products = () => {
  //States
  const [data,setData] = useState('');
  const [err,setErr] = useState('');
  const [search,setSearch] = useState('');
  const [loader,setLoader] = useState(false)
  const [page,setPage] = useState(1);
  const itemPerPage = 8;
  const [maxPage,setMaxPage] = useState(0);
  const [id,setId] = useState('');
  const [addProductModal,setAddProductModal] = useState(false);
  const [editProductModal,setEditProductModal] = useState(false);
  const [deleteModal,setDeleteModal] = useState(false);

  //Functions
  const getProducts = ()=>{
    setLoader(true);
    api.create({withCredentials:true}).get(`${urlPrefix}/products?keyword=${search}&page=${page}`).then((res)=>{
      setData(res.data);
      setMaxPage((res.data.totalProducts%itemPerPage===0)?(res.data.totalProduct/itemPerPage):(Math.floor(res.data.totalProduct/itemPerPage)+1));
      setLoader(false);
    }).catch((error)=>{
      setErr(error);
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
  }
  const editClick = (productId)=>{
    setId(productId);
    setEditProductModal(true);
  }
  const deleteClick = (productId)=>{
    setId(productId);
    setDeleteModal(true);
  }
  const deleteProduct = (e)=>{
    e.preventDefault();
    setLoader(true);
    api.create({withCredentials:true}).delete(urlPrefix+'/admin/products/'+id).then((res)=>{
      toast.success(res.data.message);
      setLoader(false);
      setDeleteModal(false);
    }).catch((error)=>{
      toast.warn(error.message);
    setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
  }

  useEffect(()=>{
    getProducts();
  },[page,search,addProductModal,editProductModal,deleteModal])
  return (
    <>
    <div className="users" style={{display:(addProductModal || editProductModal ||deleteModal)?'none':''}}>
      <div className="heading">
        <h3>Products</h3>
        <div className="search">
          <input onChange={(e)=>setSearch(e.currentTarget.value)} type="text" placeholder='Search..'/>
          <FaSearch/>
        </div>
      </div>
      <div className="addProduct">
        <button onClick={()=>setAddProductModal(true)}>Add Product <FaPlus/></button>
      </div>
      {
        (loader)?<Loader/>:
          (data.success)?
            <table className="user-table">
              <thead>
                <td>Avatar</td>
                <td>Name</td>
                <td>Price</td>
                <td>Stock</td>
                <td>Created At</td>
                <td>Actions</td>
              </thead>
              <tbody>
                {
                  data.product.map((product,i)=>{
                    return (
                      <tr key={i}>
                        <td data-label="Avatar"><img src={product.images[0].url} alt="" /></td>
                        <td data-label="Name">{product.name}</td>
                        <td data-label="Price">{product.price}</td>
                        <td data-label="Stock"><span style={{color:(product.stock>0)?'green':'crimson',padding:'5px',borderRadius:'5px',background:'var(--navColor)'}}>{product.stock}</span></td>
                        <td data-label="Created At">{getFullDate(product.createdAt)}</td>
                        <td data-label="Action">
                          <div className="btns">
                          <button onClick={()=>{editClick(product._id)}}>Edit</button>
                          <button onClick={()=>{deleteClick(product._id)}}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            :<NoLoad data={{name:'404 Users Not Found',text:'Unable to Fetch User Data from the Api, Kindly contact the website Admin or Developer.'}}/>
      }
      {
        (data.success)?
      <div className="pagination">
        {
          (page>1)?          
          <button onClick={()=>setPage(page-1)}><FaLessThan/></button>
          :''
        }
        <button>{page}</button>
        {
          (page<maxPage)?
          <button onClick={()=>setPage(page+1)}><FaGreaterThan/></button>:''
        }
      </div>:''
      }
    </div>
    { 
      (addProductModal)?<AddProductModal urlPrefix={urlPrefix} setAddProductModal = {setAddProductModal} />:''
    }
    {
      (editProductModal)?<EditProductModal productId={id} urlPrefix={urlPrefix} setEditProductModal= {setEditProductModal} />:''
    }
    {
      (deleteModal)?
      <div className="viewModal">
        <div id='deleteModal' className="modal">
          <div className="heading">
            Are You sure to delete the Product?
          </div>
          <form onSubmit={(e)=>{deleteProduct(e)}}>
            <div className="btns">
              <a onClick={()=>setDeleteModal(false)}>Cancel</a>
              <input type="submit" value={'Delete'} />
            </div>
          </form>
        </div>
      </div>
      :''
    }
    </>
  )
}

export default Products