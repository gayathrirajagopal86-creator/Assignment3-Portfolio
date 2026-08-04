import jwt from "jsonwebtoken";

export const requireSignin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.auth.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};
