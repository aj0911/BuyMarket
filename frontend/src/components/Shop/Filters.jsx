import React, { useRef, useState } from 'react';
import Slider from '@mui/material/Slider';

const Filters = ({search,priceSelector,ratingSelector,categorySelector,handleSearch,categories,maxPrice,rating,lte,gte,resetFilters}) => {
    const active = useRef();

  return (
    <div className="filters">
        <div className="search">
            <input value={search} onChange={(e)=>handleSearch(e.currentTarget.value)} type="text" placeholder='Search'/>
        </div>
        <div className="price-range">
        <h3>Price Range</h3>
        <Slider
            style={{color:'var(--textColorDark)'}}
            size="small"
            value={[gte,lte]}
            onChange={priceSelector}
            valueLabelDisplay="auto"
            min={0}
            max={maxPrice}
        />
        </div>
        <div className="categories">
            <h3>Categories</h3>
            {
                categories.map((Element,index)=>{
                    return <h4 key={index} ref={active} onClick={(e)=>categorySelector(e)}>{Element}</h4>
                })
            }
        </div>
        <div className="ratings">
            <h3>Ratings Above</h3>
            <Slider
            style={{color:'var(--textColorDark)'}}
                size="small"
                value={rating}
                onChange = {ratingSelector}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                />
        </div>
        <div className="reset">
            <button onClick={(e)=>resetFilters(e)}>Reset Filters</button>
        </div>
    </div>
  )
}

export default Filters