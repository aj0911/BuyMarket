import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { ImUser } from 'react-icons/im'
import {Box, CircularProgress} from '@mui/material'
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {AiFillContacts, AiFillEye, AiFillMoneyCollect, AiFillShopping, AiOutlineShoppingCart, AiTwotoneMoneyCollect} from 'react-icons/ai'
import api from 'axios'
import Loader from '../../../Extra/Loader/Loader'
import NoLoad from '../../../Extra/NoLoad/NoLoad'
import { urlPrefix } from '../../../../Helper/Helper';

const Dashboard = ({setContent,selectMenu}) => {
  const [data,setData] = useState('');
  const [err,setErr] = useState('');
  const [loader,setLoader] = useState(false);

  //functions
  const getData = ()=>{
    setLoader(true);
    api.create({withCredentials:true}).get(urlPrefix+'/admin').then((res)=>{
      setData(res.data);
      setLoader(false);
    }).catch((err)=>{
      setErr(err);
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
  }

  useEffect(()=>{
    getData();
  },[])

  return (
    (loader)?<Loader/>:
    (data && data.success)?
    <div className="dashboard">
      <div className="cards">
        {
          data.cards.map((e,i)=>{
            return (
              <div key={i} className="card">
                <h4>{e.title}</h4>
                <h3>{e.count}</h3>
                <div className="lower">
                  <h4 onClick={()=>{setContent(e.content);selectMenu(e.content);}}>{e.text}</h4>
                  {
                    (()=>{
                      switch(e.title){
                        case 'users':return <ImUser className='icon'/>
                        case 'products':return <AiFillShopping className='icon'/>
                        case 'orders':return <AiOutlineShoppingCart className='icon'/>
                        case 'contacts':return <AiFillContacts className='icon'/>
                        case 'earning':return <AiFillMoneyCollect className='icon'/>
                        case 'my balance':return <AiTwotoneMoneyCollect className='icon'/>
                      }
                    })()
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="middle">
        <div className="revenue">
          <div className="top">
            <h3>Total Revenue</h3>
            <AiFillEye className='icon'/>
          </div>
          <div className="middle">
            <Box position="relative" display="inline-flex">
            <CircularProgress color={(data.revData.revVal>0)?'secondary':'error'} size={70} variant="determinate" value={data.revData.revVal} />
            <Box
              bottom={0}
              right={0}
              top={0}
              justifyContent="center"
              left={0}
              display="flex"
              alignItems="center"
              position="absolute"
            >
              {`${data.revData.revVal}%`}
            </Box>
            </Box>
            <div className="sales">
              <h4>Total Sales Made this Month</h4>
              <h3>₹{data.revData.currMonthRev}</h3>
            </div>
          </div>
          <div className="lower">
            <p>{data.revData.statusText}</p>
          </div>
        </div>
        <div className="chart">
          <h3>Last 6 months (Revenue)</h3>
          <ResponsiveContainer width="100%" aspect={(window.innerWidth>599)?2/1:1/2}>
            <AreaChart width={300} className='area' data={data.chartData}>
              <Area type={'monotone'} dataKey="income" fill="#A5A4E0" stroke="#CCB3CF" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="month" />
              <YAxis/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lower">
        <h3>Latest Transaction</h3>
        <table>
          <thead>
              <th>Tracking ID</th>
              <th>Products</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
          </thead>
          <tbody>
            {
              data.transactions.map((e,i)=>{
                return (
                  <tr key={i}>
                    <td data-label ="Tracking ID">#{e.trackingId.toString().slice(0,8)}</td>
                    <td data-label ="Products">
                      <div className="table-item">
                        <img src={e.products.image} alt="" />
                        <p>{e.products.name}</p>
                      </div>
                    </td>
                    <td data-label ="Customer">{e.cusomer}</td>
                    <td data-label ="Date">{e.date}</td>
                    <td data-label ="Amount">{e.amount}</td>
                    <td data-label ="Status"><span style={{color:(e.status==='Processing')?'crimson':'green',background:'var(--navColor)',padding:'5px',borderRadius:'5px'}}>{e.status}</span></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>:<NoLoad data={{name:'404 Data Not Found',text:err.message}}/>
  )
}

export default Dashboard