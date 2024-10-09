const Cart = require('../models/Cart');
const AppError = require('../utils/appError');
const catchAsyncHandler = require('../utils/catchAsyncHandler');
const { getAll, getOne, updateOne, deleteOne } = require('../utils/crudHandler');

exports.getAllCarts = getAll(Cart)
exports.getCart = getOne(Cart)
exports.updateCart = updateOne(Cart)
exports.deleteCart = deleteOne(Cart)

// Get cart for a specific user
exports.getMyCart = catchAsyncHandler(async (req, res, next) => {
    const cart = await Cart.findById(req.user.cart).populate('items.dish');

    if (!cart) {
        next(new AppError(`Cart not found`, 404))
    }
    
    res.status(200).json({
        status: "success",
        message: `Cart successfully retrieved`,
        data: {
            document: cart
        }
    })
});

// Add a dish to the cart
exports.addToCart = catchAsyncHandler(async (req, res, next) => {
    const {dishId, quantity, note} = req.body;
    const cart = await Cart.findById(req.user.cart);

    if (!cart) {
        next(new AppError(`Cart not found`, 404))
    }
    cart.addItem(dishId, quantity)
    cart.notes.push(note)
    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Item successfully added"
    })
});

// Remove an item from the cart
exports.removeFromCart = catchAsyncHandler(async (req, res, next) => {
    const {dishId} = req.body;
    const cart = await Cart.findById(req.user.cart);

    if (!cart) {
        next(new AppError(`Cart not found`, 404))
    }

    cart.removeItem(dishId)
    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Item successfully removed"
    })
});

exports.updateMyCart = catchAsyncHandler(async (req, res, next) => {
    const cart = await Cart.findByIdAndUpdate(req.user.cart, req.body, {
        new: true,
        runValidators: true
    })

    if (!cart) {
        next(new AppError(`Cart not found`, 404))
    }

    res.status(200).json({
        status: "success",
        message: "Cart successfully updated"
    })
})

exports.clearCart = catchAsyncHandler(async (req, res, next) => {
    const cart = await Cart.findById(req.user.cart);

    if (!cart) {
        next(new AppError(`Cart not found`, 404))
    }

    cart.clear()
    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Cart successfully cleared"
    })
});

