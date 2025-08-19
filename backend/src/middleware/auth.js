import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "yoursecretkey"; // replace in prod

export const decodeUserFromToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = {
      user_id: decoded.id,
      username: decoded.username,
      user_role: decoded.user_role,
    };
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
