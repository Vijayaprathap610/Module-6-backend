import jwt from "jsonwebtoken";




export const auth = (req, _res, next) => {

    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer') ? header.slice(7) : null;
    
    if (!token) return next(new Error('Unauthorized'));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, name, email }
        next();

    } catch {
        next(new Error('Unauthorized'));
    }
};

export const permit = (...roles) => (req, _res, next) => {
    if (!req.user) return next(new Error('Unauthorized'));
    if (!roles.includes(req.user.role)) return next(new Error('Forbidden'));
    next();
};

