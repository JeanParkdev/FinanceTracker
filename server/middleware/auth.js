import jwt from 'jsonwebtoken';

const authMiddleware = ({ req }) => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  if (!token) return { user: null };

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { user };
  } catch (err) {
    return { user: null };
  }
};

export default authMiddleware;