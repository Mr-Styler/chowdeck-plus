const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            dish: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Dish',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
});

cartSchema.methods.addItem = (dishId, quantity) => {
    const existingItem = this.items.find(item => item.dish.toString() === dishId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({ dish: dishId, quantity });
    }
}

cartSchema.methods.removeItem = (dishId) => {
    this.items = this.items.filter(item => item.dish.toString() !== dishId);
}

cartSchema.methods.clear = () => {
    this.items = []
}

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
