const User = require('../models/User');
const { getAll, getOne, deleteOne, updateOne } = require('../utils/crudHandler');

exports.getAllUsers = getAll(User)
exports.getUser = getOne(User)
exports.updateUser = updateOne(User)
exports.deleteUser = deleteOne(User)

