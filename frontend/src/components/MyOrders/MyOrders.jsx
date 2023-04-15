import React, { useEffect, useState } from 'react'
import api from 'axios'
import { FaGreaterThan, FaLessThan } from 'react-icons/fa';
import Loader from '../Extra/Loader/Loader';
import NoLoad from '../Extra/NoLoad/NoLoad';
import { getFullDate, urlPrefix } from '../../Helper/Helper';
import './MyOrders.css'
import ViewOrderModal from '../Admin/AdminComp/Orders/ViewOrderModal';

const MyOrders = () => {
    //states 
    const [search,setSearch] = useState('');
    const [data,setData] = useState('');
    const [err,setErr] = useState('');
    const [loader,setLoader] = useState(false);
    const [viewModal,setViewModal] = useState(false);
    const [page,setPage] = useState(1);
    const [maxPage,setMaxPage] = useState('');
    const [id,setId] = useState('');
    const itemPerPage = (window.innerWidth<600)?5:10;

    //functions
    const getMyOrders = ()=>{
        setLoader(true);
        api.create({withCredentials:true}).get(`${urlPrefix}/order/me?keyword=${search}&page=${page}&itemPerPage=${itemPerPage}`).then((res)=>{
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
        setViewModal(true);
    }

    useEffect(()=>{
        getMyOrders();
    },[search,page,viewModal])

  return (
    (loader)?<Loader/>:
    (data.success)?
    <>
        <div className="myOrders">
            <div className="heading">
                <h3>My Orders</h3>
                <div className="search">
                    <select onChange={(e)=>setSearch(e.currentTarget.value)}>
                        <option selected={(search==='')?true:false} value="">Select Order Status</option>
                        <option selected={(search==='Processing')?true:false} value="Processing">Processing</option>
                        <option selected={(search==='Delivered')?true:false} value="Delivered">Delivered</option>
                    </select>
                </div>
            </div>
            <table>
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
                            <button onClick={()=>clickView(e._id)}>View</button>
                        </td>
                        </tr>
                    )
                    })
                }
                </tbody>
            </table>
            <div className="pagination">
                {
                    (page<=1)?'':
                    <button onClick={()=>setPage(page-1)}><FaLessThan/></button>
                }
                <button>{page}</button>
                {
                    (page >= maxPage)?'':
                    <button onClick={()=>setPage(page+1)}><FaGreaterThan/></button>
                }
            </div>
        </div>
        {      
        (viewModal)?<ViewOrderModal urlPrefix={urlPrefix} setViewOrderModal={setViewModal} isAdmin={true} orderId={id}/>:''
        }
    </>
    :<NoLoad data={{name:'404 Data Not Found!!',text:err.message}}/>
  )
}

export default MyOrders