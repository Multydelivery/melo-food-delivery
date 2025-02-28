import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
  }

  try {
    // Verify the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", token_decode); // Debugging log

    // Attach the user ID to req.user
    req.user = { id: token_decode.id };
    next();
  } catch (error) {
    console.error("Error verifying token:", error); // Debugging log
    return res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};

export default authMiddleware;