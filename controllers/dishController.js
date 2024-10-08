const Dish = require('../models/Dish');
const User = require('../models/User');
const catchAsyncHandler = require('../utils/catchAsyncHandler');
const { getAll, getOne, deleteOne, createNew, updateOne } = require('../utils/crudHandler');

exports.getAllDishes = getAll(Dish)
exports.getDish = getOne(Dish)
exports.createDish = createNew(Dish)
exports.updateDish = updateOne(Dish)
exports.deleteDish = deleteOne(Dish)

exports.searchDishes = catchAsyncHandler(async (req, res) => {
    const { ingredients, excludeAllergens, name } = req.query;
    const user = await User.findById(req.user._id);

    const query = {
        ingredients: { $all: ingredients },
        allergens: { $nin: excludeAllergens ? excludeAllergens.split(',') : user.allergies },
        name: { $regex: new RegExp(name, 'i') } // Case-insensitive partial matching
    };

    const dishes = await Dish.find(query);

    res.render('search', { dishes });
});
