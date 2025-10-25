import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.body.email = decoded.email;
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authMiddleware;
