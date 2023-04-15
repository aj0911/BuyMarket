import React, { useEffect, useState } from 'react'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import avatar from '../../Assets/avatar3.jpg' 
import { Link } from 'react-router-dom'

const ItemsTable = ({items,addToCart,reduceToCart,page,setPage,maxPage,reduceItemToCart}) => {

  return (
    <div className="items-table">
        <div className="head">
            <h4>Product Details</h4>
            <h4>Quantity</h4>
            <h4>Price</h4>
            <h4>Total</h4>
        </div>
        <div className="rows">
            {
                items.map((item,i)=>{
                    return(
                        (item.quantity>0)?
                    <div key={i} className="items">
                        <div className="product">
                            <Link to={`/product/${item.product.id}`} className="left">
                                
                                    <img src={item.product.img} alt="" />
                                
                            </Link>
                            <div className="right">
                                <h4>{item.product.name}</h4>
                                <h4>{item.product.category}</h4>
                                <a onClick={()=>reduceItemToCart(item.product)}>remove</a>
                            </div>  
                        </div>
                        <div className="quantity">
                            {
                                (item.quantity>0)?
                                <BiMinus onClick={()=>reduceToCart(item.product)}  />:''
                            }
                            <h4>{item.quantity}</h4>
                            {
                                (item.quantity < item.product.stock)?
                                <BiPlus onClick={()=>addToCart(item.product,item.quantity)}/>:''
                            }
                        </div>
                        <h4>₹{item.product.price}</h4>
                        <h4>₹{item.product.price*item.quantity}</h4>
                    </div>:''
                    )
                })
            }
        </div>
        <div className="pagination">
            {
                (page>1)?
                <button onClick={()=>setPage(page-1)}>Prev</button>:''
            }
            <button>{page}</button>
            {
                (page <maxPage)?
                <button onClick={()=>setPage(page+1)}>Next</button>:''
            }
        </div>
    </div>
  )
}

export default ItemsTable