const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ msg: "No token, access denied" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.secret_key);
    if (!decoded || !decoded._id) {
      return res.status(401).json({ msg: "Invalid token payload" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
