import React, { useEffect, useRef, useState } from 'react'
import './Admin.css'
import Header from './Header'
import SideNav from './SideNav'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../Extra/Loader/Loader'
import Dashboard from './AdminComp/Dashboard/Dashboard'
import Users from './AdminComp/Users/Users'
import Products from './AdminComp/Products/Products'
import Orders from './AdminComp/Orders/Orders'
import Delivery from './AdminComp/Delivery/Delivery'
import Stats from './AdminComp/Stats/Stats'
import Reviews from './AdminComp/Reviews/Reviews'
import Contacts from './AdminComp/Contacts/Contacts'
import {MdContactPhone, MdDashboard, MdDeliveryDining, MdQueryStats, MdReviews} from 'react-icons/md'
import {FiBox, FiShoppingBag, FiUsers} from 'react-icons/fi'


const Admin = () => {
  //state
  const auth = useSelector(state=>state.auth);
  const navigate = useNavigate()
  const [loader,setLoader] = useState(false);
  const [content,setContent] = useState('Dashboard');
  const [search,setSearch] = useState('');
  const orgArr = [
    {
      header:'Main',
      items:[
        {
          name:'Dashboard',
          icon:()=><MdDashboard/>
        }
      ]
    },
    {
      header:'List',
      items:[
        {
          name:'Users',
          icon:()=><FiUsers/>
        },
        {
          name:'Products',
          icon:()=><FiShoppingBag/>
        },
        {
          name:'Orders',
          icon:()=><FiBox/>
        },
        {
          name:'Delivery',
          icon:()=><MdDeliveryDining/>
        },
        {
          name:'Contacts',
          icon:()=><MdContactPhone/>
        },
      ]
    },
    {
      header:'Useful',
      items:[
        {
          name:'Stats',
          icon:()=><MdQueryStats/>
        },
        {
          name:'Reviews',
          icon:()=><MdReviews/>
        },
      ]
    },
  ]
  const [sidenavArr,setSideNavArr] =useState([]);
  const admin = useRef();
  const sideNavRef = useRef();

  //functions
  const searching = (val)=>{
    if(val === ''){
      return setSideNavArr(orgArr);
    }
    setSearch(val);
    const y = [{
        header:'Search',
        items:[]
    }]
   orgArr.forEach(e=>{
       e.items.forEach(x=>{
           if(x.name.toLowerCase().includes(val)){
              y[0].items.push(x);
           }
       })
   })

   setSideNavArr(y);
  }
  const closeMenu = (e)=>{
    admin.current.classList.toggle('active');
    const menuOption = e.currentTarget;
    const sideNav = menuOption.parentNode.parentNode;
    for(let i=0;i<sideNav.childNodes.length;i++){
      if(sideNav.childNodes[i].classList.contains('menu')){
        sideNav.childNodes[i].childNodes.forEach(e=>{
          e.classList.remove('active');
        })
      }
    }
    menuOption.classList.add('active')
  }

  const selectMenuFromDashboard = (e)=>{
    const menuList = []
    sideNavRef.current.childNodes.forEach(child=>{
      if(child.classList.contains('menu')){
        menuList.push(child);
      }
    })
    let ourMenu = '';
    menuList.forEach(x=>{
      x.childNodes.forEach(y=>{
        if(y.classList.contains('content')){
          if(y.childNodes[1].innerHTML.toLowerCase() === e.toLowerCase()){
            ourMenu = y;
          }
          y.classList.remove('active');
        }
      })
    })
    ourMenu.classList.add('active');
  }

  //rendering
  useEffect(()=>{
    setLoader(true);
    if(!auth.isAuth){
      setLoader(false);
      return navigate('/*')
    }
    if(auth.user.role !== 'admin'){
      setLoader(false);
      return navigate('/*')
    }
    setSideNavArr(orgArr);
    setLoader(false);

  },[content])

  return (
    <div ref={admin} className="admin">
      {
    (loader)?<Loader/>:
    <>
        <Header openMenu = {closeMenu} searching = {searching}/>
        <div className="main">
          <SideNav sideNavRev={sideNavRef} closeMenu = {closeMenu} sidenavArr={sidenavArr} setContent={setContent}/>
          <div className="wrapper">
            {
              (()=>{
                switch(content){
                  case 'Dashboard':
                    return <Dashboard selectMenu={selectMenuFromDashboard} setContent={setContent}/>;
                  case 'Users':
                    return <Users/>
                  case 'Products':
                    return <Products/>
                  case 'Orders':
                    return <Orders/>
                  case 'Delivery':
                    return <Delivery selectMenu={selectMenuFromDashboard} setContent={setContent}/>
                  case 'Stats':
                    return <Stats/>
                  case 'Reviews':
                    return <Reviews/>
                  case 'Contacts':
                    return <Contacts/>
                  case '':
                    return <Dashboard/>
                }
              })()
            }
          </div>
        </div>
    </>
      }
    </div>
  )
}

export default Admin