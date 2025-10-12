import React from 'react'
import './List.css'
import { useState } from 'react'
import axios from "axios"
import {toast} from "react-toastify"
import { useEffect } from 'react'

const List = ({url}) => {
  
  const [list,setList] = useState([]);
  const fetchList = async ()=>{
    const response = await axios.get(`${url}/api/food/list`);
    //console.log(response.data);
    if (response.data.success){
      setList(response.data.data);
    }
    else {
      toast.error("Error")
      
    }
  }
  const removeFood = async(foodId)=>{
    //console.log(foodId)
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
    await fetchList();
    if (response.data.success){
      toast.success(response.data.message)
    }
    else{
      toast.error("Error")
    }
  }
  useEffect(()=>{
    fetchList();
  },[])
  return (
    <div className='list'>
      <h2>All Foods List</h2>
      <div className="list-table">
        <div className="list-table-format ti">
          <div className="pop">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Store <p>deteles</p></b>
          <b>Action</b></div>
          {list.map((item,index)=>{
            return(
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/`+item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₹{item.price}</p>
                <span className='stor'>
                <p className='city'>{item.city}</p>
                
                <p className='street'>{item.street}</p>
                <p className='brand'>{item.firstName}</p>
                <p className='phone'>{item.phone}</p>
                
                </span>
                <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>
              </div>
            )

          })}
        </div>
      </div>
    </div>
  )
}

export default List