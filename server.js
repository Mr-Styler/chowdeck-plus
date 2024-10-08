// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const dishRoutes = require('./routes/dishes');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const userRoute = require('./routes/user');
const restaurantRoute = require('./routes/restaurant');
const viewsRoute = require('./routes/views');
const errorHandler = require('./middleware/errorMiddleware');
const AppError = require('./utils/appError');

dotenv.config({path: "./config.env"});
const app = express();
const port = process.env.PORT || 3000;

const DBI = process.env.MONGO_URI || "mongodb://localhost:27017/restaurantDB"

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoute);
app.use('/api/restaurants', restaurantRoute);
app.use('/', viewsRoute);

// Handle 404 errors for routes not found
app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Error handler middleware
app.use(errorHandler);


mongoose.connect(DBI)
    .then(() => app.listen(port, () => console.log('Server running on port 3000')))
    .catch(err => console.error(err));


// Optional: Close the connection when done
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });