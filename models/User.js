const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Cart = require('./Cart'); // Import the Cart model

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
            },
            message: 'Please provide a valid email address',
        }
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user', 'owner'], default: 'user' },
    allergies: { type: [String], default: [], required: function() { return this.role === 'user'}  },
    resetToken: {
        type: String
    },
    resetExpires: {
        type: Date
    },
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "Cart"},
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: function() { return this.role === 'owner'} }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    if (this.isNew && this.role === "user") {
        const newCart = await Cart.create({ user: this._id });
        this.cart = newCart._id;
    }

    
    next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
    // Retrieve the update object and the role from the current document being updated
    const update = this.getUpdate();

    // Check if the role is being updated to "owner"
    if (update && update.role === "owner") {
        // Find the document being updated
        const docToUpdate = await this.model.findOne(this.getQuery());

        if (docToUpdate && docToUpdate.cart) {
            // Delete the cart if it exists
            await Cart.findByIdAndDelete(docToUpdate.cart);

            // Update the cart field to null using the update query
            await this.model.updateOne(this.getQuery(), { cart: null });
        }
    }

    next();
});



userSchema.methods.matchPassword = async (inputPassword, password) => {
    return await bcrypt.compare(inputPassword, password)
};

userSchema.methods.generateResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
