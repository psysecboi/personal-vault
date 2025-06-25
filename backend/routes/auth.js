import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

//signup/register route
router.post('/register', async(req, res) => {
  try{
    const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } 
  catch(error){
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});


//login route
router.post('/login', async(req, res) => {
  try{
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if(!user){
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } 
  catch(error){
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;