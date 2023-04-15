import { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProductDetails from './components/ProductDeltails/ProductDetails';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Links from './components/Header/Links';
import Home from './components/Home/Home'
import LoginSignUp from './components/LoginSignUp/LoginSignUp';
import {  ToastContainer } from 'react-toastify';
import Me from './components/User/Me';
import Shop from './components/Shop/Shop';
import Cart from './components/Cart/Cart';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Admin from './components/Admin/Admin';
import NoLoad from './components/Extra/NoLoad/NoLoad';
import MyOrders from './components/MyOrders/MyOrders';


function App() {
  //States
  const app = useRef();

  
  // funtions


  //Rendering..
  useEffect(()=>{
    
  },[])
  const clickMenu = ()=>{app.current.classList.toggle('active')}
  return (
    <>
      <div ref={app} className="App">
        <Header clickMenu={clickMenu}/>
        <div className="main-content">
          <div className="content-box">
            <Routes>
              <Route exact path={'/'} element = {<Home/>}/>
              <Route exact path={'/product/:id'} element = {<ProductDetails/>}/>
              <Route exact path = {'/login'} element= {<LoginSignUp/>} />
              <Route exact path = {'/me'} element= {<Me/>} />
              <Route exact path = {'/shop'} element= {<Shop/>} />
              <Route exact path = {'/cart'} element= {<Cart/>} />
              <Route exact path = {'/about'} element= {<About/>} />
              <Route exact path = {'/contact'} element= {<Contact/>} />
              <Route exact path = {'/me/myOrders'} element= {<MyOrders/>} />
              <Route exact path ={'/*'} element = {<NoLoad data={{name:'404 Page Not found',text:'The page resource is not found, kindly go back to the home page.'}}/>}/>
              <Route exact path={'/admin'}/>
            </Routes>    
            <Footer/>
          </div>

          <Links activeClick = {clickMenu}/>
          <ToastContainer/>
        </div>
      </div>
      <Routes>
            <Route exact path={'/admin'} element={<Admin/>}/>
      </Routes>
    </>  
  );
}

export default App;
