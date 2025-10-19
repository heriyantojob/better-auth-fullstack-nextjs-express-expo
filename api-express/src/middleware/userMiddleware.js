// src/middleware/userMiddleware.ts


const userMiddleware = (req, res, next) => {
    if (!res.locals.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

export default userMiddleware;