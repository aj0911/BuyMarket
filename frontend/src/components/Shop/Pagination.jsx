import React, { useState } from 'react'
import {AiOutlineLeft, AiOutlineRight} from 'react-icons/ai'

const Pagination = ({totalProduct,count,page,setPage}) => {
    //states
    let maxPage =0;
    if(count!==0 && page ===1){
      if(totalProduct%count===0){
        maxPage = totalProduct/count;
      }
      else{
        maxPage  = Math.floor(totalProduct/count)+1;
      }
      
    }
    

  return (
    <div className="pagination">
        {
            (page>1)?
            <button onClick={()=>setPage(page-1)}><AiOutlineLeft/></button>:''
        }
        
        <button>{page}</button>
        {
            (page < maxPage && count !==0)?
            <button onClick={()=>setPage(page+1)}><AiOutlineRight/></button>:''
        }
        
    </div>
  )
}

export default Pagination