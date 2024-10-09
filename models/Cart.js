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
    ],
    notes: [{ type: String }]
});

cartSchema.methods.addItem = function (dishId, quantity) {
    const existingItem = this.items.find(item => item.dish.toString() === dishId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({ dish: dishId, quantity });
    }
}

cartSchema.methods.removeItem = function (dishId) {
    this.items = this.items.filter(item => item.dish.toString() !== dishId);
    const index = this.items.findIndex(item => item.dish.toString() !== dishId);
    this.notes = this.notes.filter(a => this.notes[i] !== index)
}

cartSchema.methods.clear = function () {
    this.items = []
    this.notes = []
}

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
