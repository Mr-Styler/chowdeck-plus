const AppError = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // For API responses
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : null
        });
    }

    // Render error template for web pages
    res.status(err.statusCode).render('error', {
        title: 'Error',
        message: err.message,
        status: err.status,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
};

module.exports = errorHandler;
