const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  getMyCart,
  updateMyCart,
  getAllCarts,
  updateCart,
  deleteCart
} = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

router.use('/me', restrictTo('user'));

router
  .route('/me')
  .get(getMyCart)
  .patch(updateMyCart);

router.post('/me/add', addToCart);
router.post('/me/remove', removeFromCart);

// Admin routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(getAllCarts);

router
  .route('/:id')
  .get(getCart)
  .patch(updateCart)
  .delete(deleteCart);

// User routes

module.exports = router;
