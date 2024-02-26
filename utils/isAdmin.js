const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return next(errorHandler(403, 'You are not authorized to access this resource!'));
    }
}

module.exports = isAdmin;