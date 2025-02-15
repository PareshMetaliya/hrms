import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, no token provided" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {id:decode.id,role:decode.role};
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
