import User from "../model/usermodel.js";
import {z} from "zod";



export const register = async (req, res) => {

 try {
  const {email,username,password} = req.body;

  const user = await User.findOne({email})
  if(user){
    return res.status(400).json({message:"user already exist"})
  }

  const newUser = new User({ email , username, password});
  await newUser.save();
  if(newUser){
    res.status(201).json({message:"user registered successfully",newUser})
  }
  
 } catch (error) {
  console.log(error);
  return res.status(404).json({message:"Error registering user"});
  
 }

};

export const login = (req, res) => {
  console.log("login called");
};

export const logout = (req, res) => {
  console.log("logout called");
};