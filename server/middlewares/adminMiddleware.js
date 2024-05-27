// adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied, only admins are allowed' });
    }
  };
  
  export default adminMiddleware;