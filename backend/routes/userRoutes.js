import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  updateCart
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/signup').post(registerUser)
router.post('/login', authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/cart')
  .put(protect, updateCart)

export default router
