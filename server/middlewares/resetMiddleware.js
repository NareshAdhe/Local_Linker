import jwt from "jsonwebtoken";

const resetMiddleware = async (req, res, next) => {
  try {
    if (!req.cookies.resetToken) {
      return res.json({
        success: false,
        message: "Session expired",
      });
    }
    const decoded = jwt.verify(req.cookies.resetToken, process.env.JWT_SECRET);
    req.body.userId = decoded.userId;
    req.body.email = decoded.email;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default resetMiddleware;
