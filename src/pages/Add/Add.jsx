import React, { useState } from 'react'
//import React from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
//import { useState } from 'react-router-dom'
import axios from "axios"
import { toast } from 'react-toastify'


const Add = ({ url }) => {


    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "curd",
        phone: "",
        city: "",
        street: "",
        firstName: ""

    })
    const notify = () => toast("Food ADD");


    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("image", image)
        formData.append("firstName", data.firstName)
        formData.append("phone", data.phone)
        formData.append("city", data.city)
        formData.append("street", data.street)






        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: "curd",
                phone: "",
                city: "",
                street: "",
                firstName: "",
                


            })
            setImage(false)
            toast.success(response.data.message)

        }
        else {
            toast.error(response.data.message)

        }
    }

    return (
        <div className='add'>
            <form className='form1' onSubmit={onSubmitHandler} >
                <div className="add-img-up form1">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.download} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>
                <div className="add-product-name form1">
                    <p>Product Name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here' />
                </div>
                <div className="add-product-description form1">
                    <p>Product Description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows='6' placeholder='Write Content Here'></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category form1">
                        <p>Product Category</p>
                        <select name="category" onChange={onChangeHandler} id="">
                            <option value="Milk">Milk</option>
                            <option value="Curd">Curd</option>
                            <option value="Butter">Butter</option>
                            <option value="ButterMilk">Butter Milk</option>
                            <option value="Ghee">Ghee</option>
                            <option value="Paneer">Paneer</option>
                            <option value="IceCream ">Ice Cream</option>
                            <option value="Cheese">Cheese</option>
                            <option value="Mozzrela cheese">Mozzrela cheese</option>
                            <option value="Process cheese">Process cheese</option>
                            <option value="Badam MIlk">Badam MIlk</option>
                            <option value="Lassi">Lassi</option>
                            <option value="Kulfi">Kulfi</option>
                            <option value="Feta cheese">Feta cheese</option>
                            <option value="Fresh cream">Fresh cream</option>
                            <option value="Condensed Milk">Condensed Milk</option>

                        </select>
                    </div>

                    <div className="add-price form1">
                        <p>Product Price</p>
                        <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='$20' />
                    </div>
                </div>
                <div className="store">
                    <p>Store deteles</p>
                    <input onChange={onChangeHandler} value={data.firstName} name='firstName' type="text" placeholder='Store Name' />
                    <input onChange={onChangeHandler} value={data.phone} name='phone' type="number" placeholder='Store Number' />
                    <input onChange={onChangeHandler} value={data.street} name='street' type="text" placeholder='Area Name' />
                    <input onChange={onChangeHandler} value={data.city} name='city' type="text" placeholder='Your City Name' />
                </div>

                <button type='submit' onClick={notify} className='add-btn'>ADD</button>
            </form>
        </div>
    )
}

export default Add;
/*
<div className="rating-star" onChange={onChangeHandler} value={data.rating} name="rating">
<input type="radio" name="rating1" id="r1" />
<label htmlFor="r1"></label>
<input type="radio" name="rating1" id="r2" />
<label htmlFor="r2"></label>
<input type="radio" name="rating1" id="r3" />
<label htmlFor="r3"></label>
<input type="radio" name="rating1" id="r4" />
<label htmlFor="r4"></label>
<input type="radio" name="rating1" id="r5" />
<label htmlFor="r5"></label>

</div>
formData.append("add",data.add)
        formData.append("remove",data.remove)

.add-icon img{
    width: 60px;
    height: 60px;
}
.remove{
    width: 50px;
    height: 50px;
}
.rating-star >*{
    float: left;
    
}
.rating-star label{
    height: 40px;
    width: 20px;
    position: relative;
    cursor: pointer;

}
.rating-star label::after{
    transition: all 0.5s ease-out;
    position: absolute;
    content: "*";
    color: gold;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    font-size: 60px;
    gap: 20px;
    -webkit-animation: 1s pulse ease;
    animation: 1s pulse ease;
}
.rating-star label:hover::after{
    color: black;
    text-shadow: 0 0 5px gold;
}
.rating-star input{
    display: none;
}
.rating-star input:checked + label::after,
.rating-star input:checked ~ label::after{
    content: "*";
    color: red;
}
*/