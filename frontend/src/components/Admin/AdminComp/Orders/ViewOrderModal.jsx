import React, { useEffect, useRef, useState } from 'react'
import Loader from '../../../Extra/Loader/Loader';
import api from 'axios'
import {toast} from 'react-toastify'
import NoLoad from '../../../Extra/NoLoad/NoLoad';
import './Orders.css'

const ViewOrderModal = ({setViewOrderModal,orderId,urlPrefix,isAdmin}) => {
    //states
    const [loader ,setLoader] = useState(false);
    const [editStatus ,setEditStatus] = useState(false);
    const [data,setData] = useState('');
    const [orderStatus,setOrderStatus] = useState('');
    const [err,setErr] = useState('');
    const monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

    //functions
    const getOrder = ()=>{
        setLoader(true);
        api.create({withCredentials:true}).get(`${urlPrefix}/admin/orders/${orderId}`).then((res)=>{
          console.log(res.data)
          setData(res.data);
          setOrderStatus(res.data.order.orderStatus);
          setLoader(false);
        }).catch((error)=>{
          console.log(error)
          setErr(error);
          setLoader(false);
        }).finally(()=>{
          setLoader(false);
        })
    }

    const updateStatus = (e)=>{
      e.preventDefault();
      if(orderStatus===''){
        toast.warn('Order Status is Mandatory!!');
      }
      else{
        setLoader(true);
        api.create({withCredentials:true}).put(`${urlPrefix}/admin/orders/${orderId}`,{
          orderStatus
        }).then((res)=>{
          toast.success(res.data.message);
          setLoader(false);
          setViewOrderModal(false);
        }).catch((error)=>{
          toast.warn(error.response.data.message);
          setLoader(false);
        }).finally(()=>{
          setLoader(false);
        })
      }
    }

    useEffect(()=>{
        getOrder();
    },[editStatus])


  return (
    <div className="viewModal">
    <div className="modal">
        <div className="heading">{(editStatus)?'Change Order Status':''}</div>
        {
            (loader)?<Loader/>:
            (data.success)?
            <>
              <div style={{display:(editStatus)?'none':''}} className="modal-inner">
                <div id="divToPrint" >
                  <div className="header">
                    <h2>Invoice #inv-{data.order._id.toString().slice(data.order._id.toString().length-5)}</h2>
                    <h4>Date:{`${monthNames[(new Date(data.order.createdAt)).getMonth()]} ${(new Date(data.order.createdAt)).getDate()},${(new Date(data.order.createdAt)).getFullYear()}`}</h4>
                  </div>
                  <div className="details">
                    <div className="left">
                      <h3>Invoice to:</h3>
                      <h4>{data.order.user.name}</h4>
                      <ul>
                        <li>{data.order.shippingInfo.address}</li>
                        <li>{data.order.shippingInfo.city}</li>
                        <li>{data.order.shippingInfo.state},{data.order.shippingInfo.pinCode}</li>
                        <li>{data.order.shippingInfo.country}</li>
                        <li>{data.order.shippingInfo.phoneNo}</li>
                        <li><a href={"mailto:"+data.order.user.email}>{data.order.user.email}</a></li>
                      </ul>
                    </div>
                    <div className="right">
                      <h3>Order Details:</h3>
                      <ul>
                        <li>
                          <div className="box">
                            <h4>Payment Date:</h4>
                            <h5>{`${monthNames[(new Date(data.order.paidAt)).getMonth()]} ${(new Date(data.order.paidAt)).getDate()},${(new Date(data.order.paidAt)).getFullYear()}`}</h5>
                          </div>
                        </li>
                        <li>
                          <div className="box">
                            <h4>Total Payment:</h4>
                            <h5>₹{data.order.totalPrice}</h5>
                          </div>
                        </li>
                        <li>
                          <div className="box">
                            <h4>Payment Status:</h4>
                            <h5>{data.order.paymentInfo.status}</h5>
                          </div>
                        </li>
                        <li>
                          <div className="box">
                            <h4>Order Status:</h4>
                            <h5>{data.order.orderStatus}</h5>
                          </div>
                        </li>
                        <li>
                          {
                            (data.order.orderStatus==='Processing')?
                            (!isAdmin)?
                            <button onClick={()=>{setEditStatus(true)}}>Change Order Status</button>:''
                            :<div className="box">
                              <h4>Delivered At:</h4>
                              <h5>{`${monthNames[(new Date(data.order.deliveredAt)).getMonth()]} ${(new Date(data.order.deliveredAt)).getDate()},${(new Date(data.order.deliveredAt)).getFullYear()}`}</h5>
                            </div>
                          }
                        </li>
                      </ul>
                    </div>
                  </div>
                  <table className="table">
                    <thead>
                      <td>Avatar</td>
                      <td>Name</td>
                      <td>Unit Cost</td>
                      <td>Quantity</td>
                      <td>Total</td>
                    </thead>
                    <tbody>
                      {
                        data.order.orderItems.map((item,i)=>{
                          return (
                            <tr key={i}>
                              <td data-label="Avatar"><img src={item.image} alt="" /></td>
                              <td data-label="Name">{item.name}</td>
                              <td data-label="Unit Cost">{item.price}</td>
                              <td data-label="Quantity">{item.quantity}</td>
                              <td data-label="Total">{item.price*item.quantity}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                  <div className="lower">
                    <ul>
                      <li>
                        <h3>Sub Total:</h3>
                        <h4>₹{data.order.itemsPrice}</h4>
                      </li>
                      <li>
                        <h3>Tax (18%):</h3>
                        <h4>₹{data.order.taxPrice}</h4>
                      </li>
                      <li>
                        <h3>Shipping Price:</h3>
                        <h4>₹{data.order.shippingPrice}</h4>
                      </li>
                      <li>
                        <h3>Total Price:</h3>
                        <h4>₹{data.order.totalPrice}</h4>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="btns">
                  <button onClick={()=>{setViewOrderModal(false)}}>Close</button>
                </div>
              </div>
              <form onSubmit={(e)=>updateStatus(e)} style={{display:(!editStatus)?'none':''}}>
                <div className="form-item">
                  <label htmlFor="orderStatus">Order Status</label>
                    <select onChange={(e)=>setOrderStatus(e.currentTarget.value)} name="orderStatus">
                      <option value="">Select Order Status</option>
                      <option selected={(data.order.orderStatus==='Processing')?true:false} value="Processing">Processing</option>
                      <option selected={(data.order.orderStatus==='Delivered')?true:false}  value="Delivered">Delivered</option>
                    </select>
                  
                </div>
                <div className="btns">
                  <a onClick={()=>setViewOrderModal(false)}>Cancel</a>
                  <input type="submit" value="Update" />
                </div>
              </form>
            </>
            :<NoLoad data={{name:err.status,text:err.message}}/>
        }
    </div>
</div>
  )
}

export default ViewOrderModal