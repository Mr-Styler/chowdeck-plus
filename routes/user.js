const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const catchAsyncHandler = require('../utils/catchAsyncHandler');
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const restrictTo = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/me', auth, (req, res) => {
    res.json({ message: "User's profile", user: req.user})
})

// Handle form submission for allergies
router.post('/allergies', auth, catchAsyncHandler(async (req, res) => {
    const allergies = req.body.allergies;
    
    await User.findByIdAndUpdate(req.user._id, { allergies });
    
    res.redirect('/profile');
}));

router.use(auth)

router.use("/me", (req, res, next) => {
    req.params.id = req.user._id

    next()
})

router.route("/me").get(getUser).patch(updateUser).delete(deleteUser)

router.use(restrictTo("admin"))
router.get('/', getAllUsers)
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router;
