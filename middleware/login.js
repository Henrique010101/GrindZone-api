import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../app.js';

const loginMiddleware = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) throw new Error("Missing auth token");

    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) throw new Error("Missing auth token");
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) throw new Error("Invalid token");
    next();
  } catch (error) {
    res.status(401).send({ error: `${error.message || error} - Unauthorized` });
  }
};

export default loginMiddleware;