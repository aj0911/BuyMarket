import React, { useEffect, useState } from 'react'
import '../Users/Users.css'
import '../Products/Products.css'
import './Orders.css'
import {FaGreaterThan, FaLess, FaLessThan, FaPlus,  FaSearch, FaTrash} from 'react-icons/fa'
import api from 'axios'
import Loader from '../../../Extra/Loader/Loader'
import NoLoad from '../../../Extra/NoLoad/NoLoad'
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import ViewOrderModal from './ViewOrderModal'
import { getFullDate, urlPrefix } from '../../../../Helper/Helper'

const Orders = () => {
  //States
  const [data,setData] = useState('');
  const [err,setErr] = useState('');
  const [search,setSearch] = useState('');
  const [loader,setLoader] = useState(false)
  const [page,setPage] = useState(1);
  const itemPerPage =(window.innerWidth>599)?10:5;
  const [maxPage,setMaxPage] = useState(0);
  const [id,setId] = useState('');
  const [viewOrderModal,setViewOrderModal] = useState(false);
  const [deleteModal,setDeleteModal] = useState(false);

  //Functions
  const getOrders = ()=>{
    setLoader(true);
    api.create({withCredentials:true}).get(`${urlPrefix}/admin/orders?keyword=${search}&page=${page}&itemPerPage=${itemPerPage}`).then((res)=>{
      setData(res.data);
      setMaxPage((res.data.totalOrders%itemPerPage===0)?(res.data.totalOrders/itemPerPage):(Math.floor(res.data.totalOrders/itemPerPage)+1));
      setLoader(false);
    }).catch((error)=>{
      setErr(error);
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
  }
  const clickView = (orderId)=>{
    setId(orderId);
    setViewOrderModal(true);
  }
  const deleteClick = (orderId)=>{
    setId(orderId);
    setDeleteModal(true);
  }

  const deleteOrder = (e)=>{
    e.preventDefault();
    setLoader(true);
    api.create({withCredentials:true}).delete(urlPrefix+'/admin/orders/'+id).then((res)=>{
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
    getOrders();
  },[page,search,viewOrderModal,deleteModal])
  return (
    <> 
    <div className="users" style={{display:(viewOrderModal || deleteModal)?'none':''}}>
      <div className="heading">
        <h3>Orders</h3>
        <div className="search">
          <select onChange={(e)=>{setSearch(e.currentTarget.value)}}>
            <option value="">Select Status</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>
      {
        (loader)?<Loader/>:
          (data.success)?

            <table className="user-table">
              <thead>
              <td>Products</td>
              <td>Customer</td>
              <td>Date</td>
              <td>Amount</td>
              <td>Status</td>
              <td>Actions</td>
              </thead>
              <tbody>
                {
                  data.orders.map((e,i)=>{
                    return (
                      <tr key={i}>
                        <td data-label ="Products">
                          <div className="table-item">
                            <img src={e.orderItems[0].image} alt="" />
                            <p>{e.orderItems[0].name}</p>
                          </div>
                        </td>
                        <td data-label ="Customer">{e.user.name}</td>
                        <td data-label ="Date">{getFullDate(e.paidAt)}</td>
                        <td data-label ="Amount">{e.totalPrice}</td>
                        <td data-label ="Status"><span style={{color:(e.orderStatus==='Processing')?'crimson':'green',background:'var(--navColor)',padding:'5px',borderRadius:'5px'}}>{e.orderStatus}</span></td>
                        <td data-label="Action">
                          <div className="btns">
                          <button onClick={()=>clickView(e._id)}>View</button>
                          <button onClick={()=>deleteClick(e._id)}>Delete</button>
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
      (viewOrderModal)?<ViewOrderModal urlPrefix={urlPrefix} setViewOrderModal= {setViewOrderModal} orderId = {id} />:''
    }
    {
      (deleteModal)?
      <div className="viewModal">
        <div id='deleteModal' className="modal">
          <div className="heading">
            Are You sure to delete the Order?
          </div>
          <form onSubmit={(e)=>{deleteOrder(e)}}>
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

export default Orders