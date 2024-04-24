const jwt = require('jsonwebtoken');
const key = "xyz"

const authenticateToken = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
      
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  
    jwt.verify(token, key, (err, user) => {
      if (err) {
        console.log(token);
        return res.status(403).json({ error: "Unauthorized: Invalid token" });
      }
      req.user = user;
      next();
    });
  };
  module.exports = {authenticateToken};
  