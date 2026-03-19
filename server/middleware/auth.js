import jwt from 'jsonwebtoken';

const authMiddleware = ({req}) => {
    const token = req.headers.authorization || '';
    if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }
    if (!token) return req;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return {user };
    } catch (err) {
        console.error('Invalid token');
        return {user: null};    
    }
};

export default authMiddleware;