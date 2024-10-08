const express = require('express');
const auth = require('../middleware/authMiddleware'); // If authentication is required
const router = express.Router();

// Home route - Render the form for user input
router.get('/', (req, res) => {
    res.render('landing', { title: 'Welcome to Our Restaurant', user: req.user});
});

// AUTH ROUTES

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.get('/forgot-password', (req, res) => {
    res.render('forgotPwd', { title: 'Register' });
});

router.get('/reset/:token', (req, res) => {
    res.render('resetPwd', { title: 'Register' });
});

// Navigation Routes

router.get('/dishes', (req, res) => {
    res.render('search', { title: 'Search Dishes', user: req.user });
});

router.get('/order/:id', (req, res) => {
    res.render('dish-show', { title: 'Search Dishes', user: req.user });
});

router.get('/restaurants', (req, res) => {
    res.render('restaurants', { title: 'Search Dishes', user: req.user });
});

router.get('/restaurant/:id', (req, res) => {
    res.render('restaurant-show', { title: 'Search Dishes', user: req.user });
});

// Render the allergies form
router.get('/allergies', (req, res) => {
    res.render('allergies', { title: 'Specify Allergies', user: req.user });
});
router.get('/profile', (req, res) => {
    res.render('profile', { title: 'Specify Allergies', user: req.user });
});

// Render Cart Page
router.get('/cart', (req, res) => {
    res.render('cart', { title: 'Your Cart', user: req.user });
})
// Render Cart Page
router.get('/settings', (req, res) => {
    res.render('settings', { title: 'Your Cart', user: req.user });
})

router.get('/owner/dashboard', (req, res) => {
    res.render('owner-dashboard', { title: 'Search Dishes', user: req.user });
});

// // Render 404 Page for undefined routes
// router.use((req, res) => {
//     res.status(404).render('404', { title: '404 - Page Not Found' });
// });

module.exports = router;
