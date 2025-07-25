import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if(!token){
            return res.status(401).json({
            success: false,
            message: 'No token provided, access denied'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(401).json({
            success: false,
            message: 'Token is not valid'
            });
        }

        req.user = user;
        next();

    } 
    catch(error){
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

export default auth;