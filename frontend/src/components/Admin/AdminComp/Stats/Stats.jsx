import React, { useEffect, useState } from 'react'
import { PieChart, Pie, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Line, AreaChart, Area, RadialBarChart, RadialBar, BarChart, Bar, Cell} from 'recharts';
import './Stats.css'
import api from 'axios'
import Loader from '../../../Extra/Loader/Loader'
import NoLoad from '../../../Extra/NoLoad/NoLoad'
import { urlPrefix } from '../../../../Helper/Helper';

const Stats = () => {
  //States
  const [data,setData] = useState('');
  const [err,setErr] = useState('');
  const [loader,setLoader] = useState(false);

  //functions
  const getData = ()=>{
    setLoader(true);
    api.create({withCredentials:true}).get(urlPrefix+`/admin/stats`).then((res)=>{
      console.log(res);
      setData(res.data);
      setLoader(false);
    }).catch((error)=>{
      console.log(error)
      setErr(error)
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
    (data.success)?
    <div className="stats">
      <div className="users">
        <div className="heading">
          <h3>Statistics</h3>
        </div>
        <div className="charts">
          <div className="chart">
            <div className="header">
              <h3>All Products Stock</h3>
            </div>
            <div className="pieChart">
              <div className="colorBox">
                <div className="row">
                  <div className="box"></div>
                  <h3>Out Of Stock</h3>
                </div>
                <div className="row">
                  <div className="box"></div>
                  <h3>In Stock</h3>
                </div>
              </div>
              <ResponsiveContainer width="100%" aspect={(window.innerWidth>599?2:(2/3))}>
                <PieChart>
                  <Pie data={data.pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8"/>
                    <Pie data={data.pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="chart">
            <div className="header">
              <h3>Earning and Balance Plot</h3>
            </div>
            <ResponsiveContainer width="100%" aspect={(window.innerWidth<600)?(2/3):2}>
                <LineChart data={data.chartData}>
                    <CartesianGrid  />
                    <XAxis dataKey="month" 
                        interval={'preserveStartEnd'} />
                    <YAxis></YAxis>
                    <Legend />
                    <Tooltip />
                    <Line type='monotone' dataKey="earning"
                        stroke="var(--textColorDark)" activeDot={{ r: 8 }} />
                    <Line type='monotone' dataKey="balance"
                        stroke="var(--textColor)" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart">
            <div className="header">
              <h3>Plot of the main components</h3>
            </div>
            <ResponsiveContainer width="100%" aspect={(window.innerWidth<600)?(2/3):2}>
              <AreaChart data={data.chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorContact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--navColor)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--textColorDark)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="products" stroke="#8884d8" fillOpacity={1} fill="url(#colorProduct)" />
                <Area type="monotone" dataKey="contacts" stroke="#82ca9d" fillOpacity={1} fill="url(#colorContact)" />
                <Area type="monotone" dataKey="orders" stroke="#82c8df" fillOpacity={1} fill='url(#colorOrder)' />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div id='radialBar' className="chart">
            <div className="header">
              <h3>Change in the main components</h3>
            </div>
            <ResponsiveContainer width="100%" aspect={(window.innerWidth<600)?(2/3):2}>
              <RadialBarChart  
                innerRadius="10%" 
                outerRadius="100%" 
                data={data.radialData} 
                startAngle={180} 
                endAngle={0}
              >
                <RadialBar label={{ fill: 'white'}} background clockWise={true} dataKey='increase' />
                <Legend layout='vertical' />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart">
            <div className="header">
              <h3>Bar Graph of All Delivered Orders</h3> 
            </div>
            <ResponsiveContainer width="100%" aspect={(window.innerWidth<600)?(2/3):2}>
              <BarChart
                data={data.chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deliveredOrders" fill="var(--textColorDark)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>:<NoLoad data={{name:'404 Data Not Found!!',text:err.message}}/>
  )
}

export default Stats