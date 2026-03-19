import jwt from 'jsonwebtoken';

export const signToken = (user) => {
    return jwt.sign(
        {_id: user._id, email: user.email, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );
};

