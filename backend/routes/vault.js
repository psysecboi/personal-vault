import express from 'express';
import VaultItem from '../models/vaultItem.js';
import auth from '../middleware/auth.js';

const router = express.Router();    

//middlewares
router.use(auth);

//route handlers
router.post('/', async (req, res) => {
  try{
    const vaultItem = new VaultItem({
      ...req.body,
      owner: req.user._id
    });
    
    await vaultItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Vault item created successfully',
      item: vaultItem
    });
  } 
  catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;