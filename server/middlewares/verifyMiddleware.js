import jwt from "jsonwebtoken";

const verifyMiddleware = async (req, res, next) => {
  try {
    if (!req.cookies.verifyToken) {
      return res.json({
        success: false,
        message: "Session expired",
      });
    }
    const decoded = jwt.verify(req.cookies.verifyToken, process.env.JWT_SECRET);
    req.body.email = decoded.email;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default verifyMiddleware;
