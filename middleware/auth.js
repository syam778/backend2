/*import jwt from "jsonwebtoken";


const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token = authHeader.split(" ")[1]; // get token after Bearer

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,   // or decoded._id depending on your token
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR 👉", error.message);
    return res.status(401).json({
      success: false,
      message: "Not Authorized Login Again",
    });
  }
};





export default authMiddleware //old code

*/
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default authMiddleware;
