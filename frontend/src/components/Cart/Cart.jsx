import React, { useEffect, useRef, useState } from 'react'
import './Cart.css'
import {BsArrowLeft} from 'react-icons/bs'
import ItemsTable from './ItemsTable'
import { Link, useNavigate }from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import Loader from '../Extra/Loader/Loader'
import NoLoad from '../Extra/NoLoad/NoLoad'
import PaymentModal from './PaymentModal'

const Cart = () => {
    //States
    const auth = useSelector(state=>state.auth);
    const cart = useSelector(state=>state.cart);
    const navigate = useNavigate();
    const [items,setItems] = useState([]);
    const [price,setPrice] = useState(0);
    const [shippingPrice,setShippingPrice] = useState(0);
    const [tax,setTax] = useState(0);
    const [loader,setLoader] = useState(false);
    const [paymentModal,setPaymentModal] = useState(false);
    const [quantity,setQuantity] = useState(0);
    const dispatch = useDispatch();
    const [itemCount,setItemCount] = useState(0);
    const [page,setPage] = useState(1);
    const [maxPage,setMaxPage] = useState(0);
    const cartRef = useRef();
    const [orderItems,setOrderItems] = useState([]);

    //Functions
    const getItems = ()=>{
        setLoader(true);
        cart.forEach(obj =>{
            if(obj.user._id===auth.user._id){
                const allItems = obj.cart;
                setItemCount(allItems.length)
                const limit = 3;
                setMaxPage((allItems.length%limit===0)?(allItems.length/limit):Math.floor(allItems.length/limit)+1);
                const end = (limit*page)
                const start = end-limit;
                const xItems = allItems.slice(start,end); 
                if(xItems.length===0){
                  setPage(page-1);
                }
                setItems(xItems);
                let sum = 0;
                const items = [];
                obj.cart.forEach(item=>{
                    sum += item.product.price*item.quantity;
                    items.push({
                        product:item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        image:item.product.img,
                        quantity:item.quantity
                    })
                })
                setOrderItems(items);
                setPrice(sum);
                setTax(Math.round(0.18*sum));
                return;
            }
        })
        setLoader(false);
    }

    const handleShippingSelect = (e)=>{
        const selected =e.currentTarget.selectedOptions[0].value;
        switch(selected){
            case '0':
                setShippingPrice(0);return;
            case '1':
                setShippingPrice(25);return;
            case '2':
                setShippingPrice(50);return;
            case '3':
                setShippingPrice(100);return;
        }
    }

    const addToCart = (data,quan)=>{
        setQuantity(quantity+1);
        dispatch({
            type:'addToCart',
            payload:{
                user:auth.user,
                cart:{
                        product:{
                            id:data.id,
                            name:data.name,
                            img:data.img,
                            category:data.category,
                            stock:data.stock,
                            price:data.price
                        },
                        quantity:quan+1
                    }
            }
        });
        toast.success('Added To Cart Successfully.')
    }

    const reduceToCart = (data)=>{
        dispatch({
            type:'removeFromCart',
            payload:{
                user:auth.user,
                product:{
                    id:data.id,
                    name:data.name,
                    img:data.img,
                    category:data.category,
                    stock:data.stock,
                    price:data.price
                }
            }
        });
        setQuantity(quantity-1);
        toast.success('Removed From Cart Successfully.')
    }

    const reduceItemToCart = (data)=>{
        dispatch({
            type:'removeWholeItem',
            payload:{
                user:auth.user,
                product:{
                    id:data.id,
                    name:data.name,
                    img:data.img,
                    category:data.category,
                    stock:data.stock,
                    price:data.price
                }
            }
        });
        setQuantity(quantity-1);
        toast.success('Removed From Cart Successfully.')
    }

    const valueSelect = ()=>{
        switch(shippingPrice){
            case 0:
                return '0';
            case 5:
                return '1';
            case 10:
                return '2';
            case 20:
                return '3';
        }
    }

    const checkOut = ()=>{
        if(shippingPrice!==0){
            setPaymentModal(true);
            cartRef.current.classList.add('spActive');
        }
        else{
            cartRef.current.classList.remove('spActive');
            setPaymentModal(false);
            toast.warn('Select Shipping Method!!')
        }
    }

    useEffect(()=>{
        if(!auth.isAuth){
            toast.warn('Login to Access This Resource.')
            return navigate('/login')
        }
        getItems();
    },[quantity,page])
  return (
    (items.length>0)?
    <div id='cart' ref={cartRef} className="cart">
        {
            (!loader)?
            (
            <div className="inner">
                {
                    (paymentModal)?
                    <PaymentModal orderItems={orderItems} itemsPrice={price} shippingPrice={shippingPrice} taxPrice={tax} amount={shippingPrice+price+tax} cartRef={cartRef} closeModal={setPaymentModal}/>:
                    <>                
                        <div className="left">
                            <div className="cart-heading">
                                <h3>Shopping <span style={{color:'var(--textColor)'}}>Cart</span> </h3>
                                <h3><span style={{color:'var(--textColor)'}}>{itemCount}</span> items</h3>
                            </div>
                            <ItemsTable reduceItemToCart={reduceItemToCart} page={page} setPage = {setPage} maxPage = {maxPage} reduceToCart={reduceToCart} addToCart={addToCart} items = {items}/>
                            <div className="lower">
                                <Link to={'/shop'}><a><BsArrowLeft/> Continue Shopping</a></Link>
                            </div>
                        </div>
                        <div className="right">
                            <div className="cart-heading">
                                <h3>Order Summary</h3>
                            </div>
                            <div className="shipping">
                                <div className="bill">
                                    <h4>ITEMS {itemCount}</h4>
                                    <h4>₹{price}</h4>
                                </div>
                                <div className="bill">
                                    <h4>Tax (18%)</h4>
                                    <h4>₹{tax}</h4>
                                </div>
                                <div className="charges">
                                    <h4>SHIPPING</h4>
                                    <select  onChange={e =>handleShippingSelect(e)} name="shipping" >
                                        <option value="0" selected={(shippingPrice===0)?true:false} >Select Delivery</option>
                                        <option value="1" selected={(shippingPrice===25)?true:false}>Standard Delivery - ₹25.00</option>
                                        <option value="2" selected={(shippingPrice===50)?true:false}>Fast Delivery - ₹50.00</option>
                                        <option value="3" selected={(shippingPrice===100)?true:false}>Super Fast Delivery - ₹100.00</option>
                                    </select>
                                </div>
                            </div>
                            <div className="checkout">
                                <div className="total">
                                    <h3>Total Cost</h3>
                                    <h3 style ={{color:'var(--textColorWarn)'}}>₹{(shippingPrice)?(shippingPrice+price+tax):''}</h3>
                                </div>
                                <button onClick={checkOut}>Checkout</button>
                            </div>
                        </div>
                    </>
                }
            </div>
            
            ):<Loader/>
        }
    </div>
    :
    <NoLoad className={'cartNoLoad'} data={{name:'Cart is Empty',text:'The Cart must required atleast one product to Checkout.'}}/>
  )
}

export default Cart