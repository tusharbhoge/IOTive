import { auth } from "../db/index.js";

export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided or incorrect format." });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Debugging logs
    console.log("Decoded Token:", decodedToken);

    // Ensure user has admin role
    if (decodedToken.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized. Admin access required." });
    }

    req.user = { uid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};
