import userModel from "../models/userModel.js";
//import userModel from "../models/userModel.js"; // Ensure .js extension is present
import fs from 'fs'

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "user Doesnt exists" })

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.json({ success: false, message: "invalide user" })
        }
        const token = createToken(user._id)
        res.json({ success: true, token });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "error" })

    }


}
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
const registerUser = async (req, res) => {
    const {name,email,password} = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "user already exists" })

        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please enter a valid email" })
        }
        if (mobile_number.length < 10 || mobile_number.length >11) {
            return res.json({ success: false, message: "please enter Your Mobile Number" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "please enter a storng password" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name: name,
            email: email,
            mobile_number:mobile_number,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message:"error" })

    }

}
export { loginUser, registerUser }