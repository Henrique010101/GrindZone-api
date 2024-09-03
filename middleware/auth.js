import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../app.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req
      .header("Cookie")
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("token="))
      ?.split("=")[1];
    if (!token) throw new Error("Missing auth token");

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) throw new Error("Missing user");

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authMiddleware: ", error);
    res.status(401).send({ error: `${error.message || error} - Unauthorized` });
  }
};

export default  authMiddleware;