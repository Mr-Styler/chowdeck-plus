const express = require('express');
const { addDish } = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/dish', auth, roleMiddleware('admin'), addDish);

module.exports = router;
