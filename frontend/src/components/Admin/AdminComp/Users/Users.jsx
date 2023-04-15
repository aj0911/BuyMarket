import React, { useEffect, useState } from 'react'
import './Users.css'
import {FaGreaterThan, FaLessThan, FaSearch} from 'react-icons/fa'
import api from 'axios'
import Loader from '../../../Extra/Loader/Loader'
import NoLoad from '../../../Extra/NoLoad/NoLoad'
import ViewModal from './ViewModal'
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { urlPrefix } from '../../../../Helper/Helper'

const Users = () => {
  //States
  const [data,setData] = useState('');
  const [err,setErr] = useState('');
  const [search,setSearch] = useState('');
  const [loader,setLoader] = useState(false)
  const [page,setPage] = useState(1);
  const itemPerPage = (window.innerWidth>599)?10:5;
  const [maxPage,setMaxPage] = useState(0);
  const [viewModal,setViewModal] = useState(false);
  const [deleteModal,setDeleteModal] = useState(false);
  const [id,setId] = useState('');
  const auth = useSelector(state=>state.auth);
  const dispatch = useDispatch();

  //Functions
  const getUsers = ()=>{
    setLoader(true);
    api.create({withCredentials:true}).get(`${urlPrefix}/admin/users?keyword=${search}&page=${page}&itemPerPage=${itemPerPage}`).then((res)=>{
      setData(res.data);
      setMaxPage((res.data.totalUsers%itemPerPage===0)?(res.data.totalUsers/itemPerPage):(Math.floor(res.data.totalUsers/itemPerPage)+1));
      setLoader(false);
    }).catch((error)=>{
      setErr(error);
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    })
  }

  const openViewModal = (data_id)=>{
    setId(data_id)
    setViewModal(false);
    setViewModal(true);
  }
  const openDeleteModal = (data_id)=>{
    setId(data_id)
    setDeleteModal(false);
    setDeleteModal(true);
  }
  const deleteUser = (e)=>{
    e.preventDefault();
    if(auth.user._id===id){
      toast.warn('You can\'t delete your own Id.')
      setDeleteModal(false)
    }
    else{
          setLoader(true);
          api.create({withCredentials:true}).delete(urlPrefix+'/admin/users/'+id).then((res)=>{
          if(res.data.success){
              toast.success('User deleted successfully.');
              dispatch({type:'deleteUserCart',payload:{
                user_id:id
              }})
              setDeleteModal(false);
              setLoader(false);
          }
          setLoader(false);
          }).catch((error)=>{
          toast.warn(error.message);
          setLoader(false);
          }).finally(()=>{
          setLoader(false);
          })
    }
  }

  useEffect(()=>{
    getUsers();
  },[page,search,viewModal,deleteModal])
  return (
    <>
    <div className="users" style={{display:(viewModal || deleteModal)?'none':''}}>
      <div className="heading">
        <h3>Customers</h3>
        <div className="search">
          <input onChange={(e)=>setSearch(e.currentTarget.value)} type="text" placeholder='Search..' />
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
                <td>Role</td>
                <td>Actions</td>
              </thead>
              <tbody>
                {
                  data.users.map((user,i)=>{
                    return (
                      <tr key={i}>
                        <td data-label="Avatar"><img src={user.avatar.url} alt="" /></td>
                        <td data-label="Name">{user.name}</td>
                        <td data-label="Role"><span style={{color:(user.role==='user')?'green':'crimson',padding:'5px',borderRadius:'5px',background:'var(--navColor)'}}>{user.role}</span></td>
                        <td data-label="Action">
                          <div className="btns">
                          <button onClick={()=>openViewModal(user._id)} >View</button>
                          {
                            (auth.user._id===user._id)?<button>Can't Delete</button>:
                            <button onClick={()=>openDeleteModal(user._id)}>Delete</button>
                          }
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
      (viewModal)?<ViewModal urlPrefix={urlPrefix} loader={loader} setLoader={setLoader} setViewModal= {setViewModal} user_id = {id} />:''
    }
    {
      (deleteModal)?
      <div className="viewModal">
        <div id='deleteModal' className="modal">
          <div className="heading">
            Are You sure to delete the User?
          </div>
          <form onSubmit={(e)=>{deleteUser(e)}}>
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

export default Users