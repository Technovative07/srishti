import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "your-secret-key";

export function authenticateJWT(req, res, next) {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  if (typeof token !== "string") {
    return res.status(400).send({ message: "Invalid token format!" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized! Invalid token." });
    }
    req.userId = decoded.id; // assuming JWT payload contains id
    next();
  });
}
