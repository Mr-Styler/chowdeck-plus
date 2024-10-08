const mongoose = require('mongoose');
const User = require('./User');

// Restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
  location: {
    type: {
      type: String,  // This will always be 'Point' for GeoJSON
      enum: ['Point'],  // We specify that only 'Point' is allowed
      required: true
    },
    coordinates: {
      type: [Number],  // An array of numbers, where the first element is longitude and the second is latitude
      required: true
    }
  },
  logo: {
    type: String
  }
});

restaurantSchema.pre("save", async function (next) {
  if (this.isNew) {
    const user = await User.findByIdAndUpdate(this.owner,
      { restaurant: this._id, role: "owner" },
      { new: true, runValidators: true })
  }

  next()
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant

// // sample data
// name: 'Pizza Palace',
// cuisine: 'Italian',
// owner: someUserId,  // Assuming this is the owner's user ID
// location: {
//   type: 'Point',
//   coordinates: [-73.935242, 40.730610]  // Example: New York City
// }