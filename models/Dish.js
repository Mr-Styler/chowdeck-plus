const mongoose = require('mongoose');
const Restaurant = require('./Restaurant');

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: { type: Number},
    description: { type: String },
    ingredients: [{ type: String }],
    images: [{ type: String }],  // URL to image
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true }
});

dishSchema.pre("save", async function (next) {
    if (this.isNew) {
        const restaurant = await Restaurant.findByIdAndUpdate(this.restaurant,
            { $push: { dishes: this._id } },
            { new: true, runValidators: true })
    }

    next()
})

const Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish