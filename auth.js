// Simple HTTP Basic Authentication for the assignment.
// Use HTTPS in any deployed environment and keep credentials in .env.
function safeEqual(a, b) {
  const crypto = require("crypto");
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function basicAuth(req, res, next) {
  const expectedUser = process.env.API_USERNAME;
  const expectedPassword = process.env.API_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return res.status(500).json({
      message: "API authentication is not configured. Set API_USERNAME and API_PASSWORD."
    });
  }

  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="User Management API"');
    return res.status(401).json({ message: "Authentication required" });
  }

  let decoded;
  try {
    decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch {
    return res.status(401).json({ message: "Invalid authentication credentials" });
  }

  const separator = decoded.indexOf(":");
  if (separator < 0) {
    return res.status(401).json({ message: "Invalid authentication credentials" });
  }

  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  if (!safeEqual(username, expectedUser) || !safeEqual(password, expectedPassword)) {
    return res.status(401).json({ message: "Invalid authentication credentials" });
  }

  next();
}

module.exports = basicAuth;
