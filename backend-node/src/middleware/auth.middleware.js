const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const cookieToken = req.cookies?.accessToken;
  const authHeader = req.headers.authorization;

  const bearerToken = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  const token = cookieToken || bearerToken;

  if (!token)
    return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      provider: decoded.provider
    };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
