const AppError = require("../utils/appError");

const restrictTo = (roles) => {
    return(req, res, next) => {
        console.log(roles, req.user.role);
        if(!roles.includes(req.user.role)) return next(new AppError(`Access Denied.`, 403))
        next();
    }
};

module.exports = restrictTo;
