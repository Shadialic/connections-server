import {jwtDecode} from "jwt-decode"; 

// Middleware to decode JWT token from request headers
const decodeTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization;;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      req.userId = decoded.id; 
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }

  next();
};

export default decodeTokenMiddleware;
