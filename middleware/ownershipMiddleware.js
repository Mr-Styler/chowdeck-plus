const Dish = require('../models/Dish');
const AppError = require('../utils/appError');
const catchAsyncHandler = require('../utils/catchAsyncHandler');

const checkOwnership = catchAsyncHandler(async (req, res, next) => {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return next(new AppError('Dish not found' , 404));
    }

    // Assuming req.user.restaurant is the restaurant the user owns
    if (req.user.role !== 'admin' && dish.restaurant.toString() !== req.user.restaurant.toString()) {
      return next(new AppError('You do not own this restaurant', 403));
    }
    next();
});

module.exports = checkOwnership;
