import React, { useEffect, useState } from 'react'
import '../Users/Users.css'
import '../Products/Products.css'
import {FaGreaterThan, FaLess, FaLessThan, FaPlus,  FaSearch, FaTrash} from 'react-icons/fa'
import api from 'axios'
import Loader from '../../../Extra/Loader/Loader'
import NoLoad from '../../../Extra/NoLoad/NoLoad'
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import ContactViewModal from './ContactViewModal'
import './Contacts.css'
import { urlPrefix } from '../../../../Helper/Helper'

const Contacts = () => {
  //States
  const [data,setData] = useState('');
  const [err,setErr] = useState('');
  const [search,setSearch] = useState('');
  const [loader,setLoader] = useState(false)
  const [page,setPage] = useState(1);
  const itemPerPage = (window.innerWidth>599)?10:5;
  const [maxPage,setMaxPage] = useState(0);
  const [contactViewModal,setContactViewModal] = useState(false);
  const [deleteModal,setDeleteModal] = useState(false);
  const [id,setId] = useState('');


  //Functions
  const getContacts = ()=>{
    setLoader(true);
    api.create({withCredentials:true}).get(`${urlPrefix}/contacts?keyword=${search}&page=${page}&itemPerPage=${itemPerPage}`).then((res)=>{
      setData(res.data);
      setMaxPage((res.data.totalContacts%itemPerPage===0)?(res.data.totalContacts/itemPerPage):(Math.floor(res.data.totalContacts/itemPerPage)+1));
      setLoader(false);
    }).catch((error)=>{
      setErr(error);
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
  }

  const viewClick = (contactId)=>{
    setId(contactId);
    setContactViewModal(true);
  }
  const deleteClick = (contactId)=>{
    setId(contactId);
    setDeleteModal(true);
  }
  const deleteContact = (e)=>{
    e.preventDefault();
    setLoader(true);
    api.create({withCredentials:true}).delete(urlPrefix+'/admin/contacts/'+id).then((res)=>{
      toast.success(res.data.message);
      setLoader(false);
      setDeleteModal(false);
    }).catch((error)=>{
      toast.warn(error.response.data.message);
    setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
  }

  useEffect(()=>{
    getContacts();
  },[page,search,deleteModal,contactViewModal])
  return (
    <>
    <div className="users" style={{display:(contactViewModal || deleteModal)?'none':''}}>
      <div className="heading">
        <h3>Contacts</h3>
        <div className="search">
          <input onChange={(e)=>setSearch(e.currentTarget.value)} type="text" placeholder='Search..'/>
          <FaSearch/>
        </div>
      </div>
      {
        (loader)?<Loader/>:
          (data.success)?
            <table className="user-table">
              <thead>
                <td>Avatar</td>
                <td>Name</td>
                <td>Email</td>
                <td>Phone No</td>
                <td>Actions</td>
              </thead>
              <tbody>
                {
                  data.contacts.map((contact,i)=>{
                    return (
                      <tr key={i}>
                        <td data-label="Avatar"><img src={contact.user.avatar.url} alt="" /></td>
                        <td data-label="Name">{contact.name}</td>
                        <td style={{textTransform:'lowercase'}} data-label="Email">{contact.email}</td>
                        <td data-label="Phone No">{contact.phoneNo}</td>
                        <td data-label="Action">
                          <div className="btns">
                          <button onClick={()=>viewClick(contact._id)}>View</button>
                          <button onClick={()=>deleteClick(contact._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            :<NoLoad data={{name:'404 Users Not Found',text:'Unable to Fetch User Data from the Api, Kindly contact the website Admin or Developer.'}}/>
      }
      {
        (data.success)?
      <div className="pagination">
        {
          (page>1)?          
          <button onClick={()=>setPage(page-1)}><FaLessThan/></button>
          :''
        }
        <button>{page}</button>
        {
          (page<maxPage)?
          <button onClick={()=>setPage(page+1)}><FaGreaterThan/></button>:''
        }
      </div>:''
      }
    </div>
    {
      (contactViewModal)?<ContactViewModal setContactViewModal= {setContactViewModal} contactId = {id} urlPrefix={urlPrefix} />:''
    }
    {
      (deleteModal)?
      <div className="viewModal">
        <div id='deleteModal' className="modal">
          <div className="heading">
            Are You sure to delete the Contact Details?
          </div>
          <form onSubmit={(e)=>{deleteContact(e)}}>
            <div className="btns">
              <a onClick={()=>setDeleteModal(false)}>Cancel</a>
              <input type="submit" value={'Delete'} />
            </div>
          </form>
        </div>
      </div>
      :''
    } 
    </>
  )
}

export default Contacts