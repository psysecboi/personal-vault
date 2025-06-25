import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import auth from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

//db connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
connectDB();


//route handlers
app.get('/', (req, res) => {
  res.json({ 
    message: 'Personal Vault API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});     

app.get('/api/profile', auth, (req, res) => {
  res.json({
    success: true,
    message: 'This is a token protected route!',
    user: req.user
  });
});

// app.post('/test-user', async (req, res) => {
//   try {
//     const testUser = new User({
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'password123'
//     });
    
//     const savedUser = await testUser.save();
//     console.log('User saved to database:', savedUser);
    
//     res.json({ 
//       success: true, 
//       message: 'User created successfully',
//       user: {
//         id: savedUser._id,
//         name: savedUser.name,
//         email: savedUser.email,
//         createdAt: savedUser.createdAt
//       }
//     });
//   } 
//   catch (error) {
//     console.error('Error creating user:', error);
//     res.status(400).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// });

//firing server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});