const express = require('express');
const {
  searchDishes,
  getAllDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish
} = require('../controllers/dishController');
const auth = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/roleMiddleware');
const checkOwnership = require('../middleware/ownershipMiddleware'); // Middleware to check if user owns the restaurant

const router = express.Router();

router.use(auth);

// Public routes
router.get('/', getAllDishes);
router.get('/search', restrictTo('user'), searchDishes);
router.get('/:id', getDish);

// Owner/Admin restricted routes
router.use((req, res, next) => {
    req.body.restaurant = req.user.restaurant

    next()
}, restrictTo(['owner', 'admin']));

router.post('/', createDish);
router.route('/:id')
  .patch(checkOwnership, updateDish)
  .delete(checkOwnership, deleteDish);

module.exports = router;
