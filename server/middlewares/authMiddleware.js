import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = {
      ...user,
      token: token,
    };
    next();
  });
}

export default authenticateToken;
