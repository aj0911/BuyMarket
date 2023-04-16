import React, { useEffect, useState } from 'react'
import './Delivery.css'
import api from 'axios'
import {FcSimCardChip} from 'react-icons/fc'
import {RiVisaLine} from 'react-icons/ri'
import {AiFillCreditCard} from 'react-icons/ai'
import {BsFillCalendarFill} from 'react-icons/bs'
import {FaRegDotCircle} from 'react-icons/fa'
import Loader from '../../../Extra/Loader/Loader'
import NoLoad from '../../../Extra/NoLoad/NoLoad'
import { getFullDate, urlPrefix } from '../../../../Helper/Helper'
import { intToString } from '../../../../Helper/Helper'
import ViewOrderModal from '../Orders/ViewOrderModal'

const Delivery = ({setContent,selectMenu}) => {
  const date = new Date(Date.now());
  const [data,setData] = useState('');
  const [err,setErr] = useState('');
  const [loader,setLoader] = useState(false);
  const [invoiceView,setInvoiceView] = useState(false);
  const [id,setId] = useState('')

  //functions
  const loadData = ()=>{
    setLoader(true);
    api.create({withCredentials:true}).get(`${urlPrefix}/admin/delivery`).then((res)=>{
      setData(res.data);
      setLoader(false);
    }).catch((error)=>{
      setErr(error);
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
  }


  useEffect(()=>{
    loadData();
  },[invoiceView])
  return (
    (loader)?<Loader/>:
    (data.success)?
    
    <>
      <div className="delivery" style={{display:(invoiceView)?'none':''}}>
        <div className="upper">
          <div className="creditCard">
            <div className="topCard">
              <FcSimCardChip/>
              <RiVisaLine/>
            </div>
            <div className="middleCard">
              <h3><span>XXXX</span> <span>XXXX</span> <span>XXXX</span> <span>6420</span> </h3>
            </div>
            <div className="lowerCard">
              <div className="holder">
                <h5>Card Holder</h5>
                <h3>Abhinav Jha</h3>
              </div>
              <div className="valid">
                <h5>Valid Till</h5>
                <h3>{date.getDate()}/{date.getFullYear()+2}</h3>
              </div>
            </div>
          </div>
          <div className="balance">
            <div className="current">
              <div className="balance">
                <h5>Credit Balance</h5>
                <h3>₹{data.balance}</h3>
              </div>
              <div className="earning">
                <h5>Credit Earning</h5>
                <h3>₹{data.earning}</h3>
              </div>
            </div>
            {
              (data.orders.length>0)?
              <div className="new">
                <h5>Newest</h5>
                <div className="box">
                  <div className="left">
                    <AiFillCreditCard/>
                    <div className="text">
                      <h3>{data.orders[data.orders.length-1].user.name}</h3>
                      <h5>{getFullDate(data.orders[data.orders.length-1].paidAt)}</h5>
                    </div>
                  </div>
                  <div className="right">
                    <h5>+₹{intToString(data.orders[data.orders.length-1].totalPrice)}</h5>
                  </div>
                </div>
              </div>:''
            }
          </div>
          <div className="invoices">
            <table className="invoice-table">
              <thead>
                <td>Invoices</td>
                <td><button onClick={()=>{setContent('Orders');selectMenu('Orders');}}>View All</button></td>
              </thead>
              <tbody>
                {
                  data.invoicesOrders.reverse().slice(0,3).map((order,i)=>{
                    return (
                      <tr key={i}>
                        <td>
                          <div className="boxLeft">
                            <h3>{getFullDate(order.deliveredAt,'')}</h3>
                            <h5>#INV-{order._id.slice(order._id.length-5)}</h5>
                          </div>
                        </td>
                        <td>
                          <div className="boxRight">
                            <h5>₹{intToString(order.totalPrice)}</h5>
                            <button onClick={()=>{setInvoiceView(true);setId(order._id)}}>View</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="lower">
          <div className="billingInfo">
            <h3>Billing Info</h3>
            {
              data.orders.reverse().slice(0,5).map((order,i)=>{
                return (
                <div className="content">
                  <div className="left">
                    <h3>{order.user.name}</h3>
                    <h5><span>Payment Id:</span>#{order.paymentInfo.id}</h5>
                  </div>
                  <div className="right">
                    <h5><span>Order Items:</span>{order.orderItems.length} </h5>
                    <h5><span>Items Price</span>₹{intToString(order.itemsPrice)} </h5>
                    <h5><span>Total Amount:</span>₹{intToString(order.totalPrice)} </h5>
                  </div>
                </div>
                )
              })
            }
          </div>
          <div className="transactions">
            <div className="heading">
              <h3>Your Transaction's</h3>
              <h3>
                <BsFillCalendarFill/>
                {date.getDate()-7}-{getFullDate(Date.now(),'*')}
              </h3>
            </div>
            <div className="box">
              <h3>Newest</h3>
              {
                data.orders.slice(0,3).map((order,i)=>{
                  return (
                    <div key={i} className="row">
                      <div className="left">
                        <FaRegDotCircle/>
                        <div className="inner-div">
                          <h3>{order.user.name}</h3>
                          <h5>{getFullDate(order.paidAt,'*')} at {getFullDate(order.paidAt,'gt')}</h5>
                        </div>
                      </div>
                      <div className="right">
                        <h3>+₹{intToString(order.totalPrice)}</h3>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="box">
              <h3>Older</h3>
              {
                data.orders.slice(data.invoicesOrders.length-2).map((order,i)=>{
                  return (
                    <div key={i} className="row">
                      <div className="left">
                        <FaRegDotCircle/>
                        <div className="inner-div">
                          <h3>{order.user.name}</h3>
                          <h5>{getFullDate(order.paidAt,'*')} at {getFullDate(order.paidAt,'gt')}</h5>
                        </div>
                      </div>
                      <div className="right">
                        <h3>+₹{intToString(order.totalPrice)}</h3>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      {
        (invoiceView)?<ViewOrderModal urlPrefix={urlPrefix} setViewOrderModal={setInvoiceView} orderId={id}/>:''
      }
    </>
    
    :<NoLoad data = {{name:'404 Data not found',text:err.message}}/>
  )
}

export default Delivery