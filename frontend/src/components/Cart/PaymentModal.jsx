import React, { useState } from 'react'
import './PaymentModal.css'
import api from 'axios'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {urlPrefix} from '../../Helper/Helper'

const PaymentModal = ({closeModal,cartRef,amount,itemsPrice,shippingPrice,taxPrice,orderItems}) => {
    //states
    console.log(orderItems);
    const [address,setAddress] = useState('');
    const [city,setCity] = useState('');
    const [state,setState] = useState('');
    const [country,setCountry] = useState('');
    const [pinCode,setPinCode] = useState('');
    const [phone,setPhone] = useState('');
    const user = useSelector(state=>state.auth).user
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //functions
    const initPayment = ({order:data})=>{
        const rzp = new window.Razorpay({
            key:'rzp_test_Ar7l2M9JTmvRyU',
            amount:data.amount,
            currency:data.currency,
            name:user.name,
            description:'Test Transaction',
            order_id:data.id,
            handler:(response)=>{
                try{
                    console.log(response);
                    api.create({withCredentials:true}).post(urlPrefix+'/order/new',{
                        itemsPrice,
                        taxPrice,
                        shippingPrice,
                        totalPrice:amount,
                        orderItems,
                        shippingInfo:{
                            address,
                            city,
                            state,
                            country,
                            pinCode,
                            phoneNo:phone
                        },
                        paymentInfo:{
                            id:response.razorpay_payment_id,
                            status:"succeeded"
                        }
                    }).then((res)=>{
                        if(res.data.success){
                            toast.success(res.data.message);
                            dispatch({
                                type:'emptyCart',
                                payload:{
                                    user,
                                    orderItems
                                }
                            })
                            navigate('/');
                        }
                    }).catch((err)=>{
                        toast.warn(err.response.data.message);
                    })
                }
                catch(err){
                    toast.warn(err.message);
                }
            },
            theme:{
                color:'steelblue'
            }
        })
        rzp.open();
    }
    const payment = (e)=>{
        e.preventDefault();
        api.create({withCredentials:true}).post(urlPrefix+'/payment',{
            amount:parseInt(amount),
        }).then((res)=>{
            initPayment(res.data);
        }).catch((err)=>{
            toast.warn(err.message);
        })


    }
  return (
    <div className="payment">
        <div className="box">
            <div className="title">
                <h3>Shipping <span style={{color:'var(--textColor)'}}>Info</span> </h3>
            </div>
            <form onSubmit={e=>payment(e)}>
                <div className="data">
                    <input type="text" onChange={(e)=>setAddress(e.currentTarget.value)} placeholder='Address' required/>
                    <input type="text" onChange={(e)=>setCity(e.currentTarget.value)} placeholder='City' required/>
                    <input type="text" onChange={(e)=>setState(e.currentTarget.value)} placeholder='State' required/>
                    <input type="text" onChange={(e)=>setCountry(e.currentTarget.value)} placeholder='Country' required/>
                    <input type="number" onChange={(e)=>setPinCode(e.currentTarget.value)} placeholder='Pin Code' required/>
                    <input type="number" onChange={(e)=>setPhone(e.currentTarget.value)} placeholder='Phone Number' required/>
                </div>
                <div className='btns'>
                    <a onClick={()=>{closeModal(false);cartRef.current.classList.remove('spActive')}}>Cancel</a>
                    <input type="submit"  value={'Next'} />
                </div>
            </form>
        </div>
    </div>
  )
}

export default PaymentModal