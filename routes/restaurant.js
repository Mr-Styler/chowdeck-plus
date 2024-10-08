const express = require('express');
const auth = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/roleMiddleware');
const { getAllRestaurants, createRestaurant, getRestaurant, updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');

const authorization = (req, res, next) => {
  req.params.id = req.user.restaurant

  console.log(req.user.restaurant, req.params.id)
  next()
}

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.post('/', restrictTo("user"), (req, res, next) => {
    req.body.owner = req.user._id

    next()
  }, createRestaurant)


router.use('/me', restrictTo('owner'))

router.route('/me').get(authorization, getRestaurant).patch(authorization, updateRestaurant).delete(authorization, deleteRestaurant)
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurant)


// Admin routes
router.use(restrictTo(['admin']));

router
  .route('/:id')
  .patch(updateRestaurant)
  .delete(deleteRestaurant);


module.exports = router;
