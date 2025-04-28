import jwt from 'jsonwebtoken';
import { getUserById } from '../models/userModel.js'; // Assuming you have a function to get user by ID

const authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).send({ error: 'Authorization header is missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = {
      id: user.id,
      user_role: user.user_role,
    };

    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export default authenticate;