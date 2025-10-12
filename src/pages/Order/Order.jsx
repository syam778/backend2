import React from 'react'
import './Order.css'
import { useState } from 'react'
import axios from 'axios'
import {toast} from "react-toastify"
import { useEffect } from 'react'
import { assets } from '../../assets/assets'

const Order = ({url}) => {
  const [orders,setOrders] =useState([]);

  const fetchAllOrders = async ()=>{
    const response = await axios.get(url+"/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data)

    }
    else{
      toast.error("error")
    }

  }
  const statusHandler = async (event,orderId) =>{
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status:event.target.value
    })
    if (response.data.success){
      await fetchAllOrders();
    }

  }
  useEffect(()=>{
    fetchAllOrders();

  },[])
  return (
    <div className='order'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order,index)=>(
          <div className="order-item" key={index}>
            <img src={assets.store} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item,index)=>{
                if (index ===order.items.length-1){
                  return item.name + "x" +item.quantity

                }
                else{
                  return item.name + "x" +item.quantity+ ", "

                }

              })}</p>
              <p className='order-item-name'>{order.address.firstName+""+order.address.lastName}</p>
              <div className='order-item-add'>
                <p>{order.address.street+","}</p>
                <p>{order.address.city+","+order.address.state+","+order.address.country+","+order.address.ziocode+","+order.address.email+","}</p>
                
              </div>
              <p className='phone'>{order.address.phone+","+order.address.age+","+order.address.gender+","+order.address.firstName+","}</p>
            </div>
            <p className='len'>Items : {order.items.length}</p>
            <p className='amount'>${order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivery">Delivery</option>
              <option value="Delay">Delay</option>
              <option value="Cencel This Order">Cencel This Order</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order