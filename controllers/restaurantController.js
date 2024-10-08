const Restaurant = require('../models/Restaurant');
const { getAll, getOne, deleteOne, createNew, updateOne } = require('../utils/crudHandler');

exports.getAllRestaurants = getAll(Restaurant)
exports.getRestaurant = getOne(Restaurant)
exports.createRestaurant = createNew(Restaurant)
exports.updateRestaurant = updateOne(Restaurant)
exports.deleteRestaurant = deleteOne(Restaurant)

