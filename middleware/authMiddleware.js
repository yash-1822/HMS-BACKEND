// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//     const token = req.cookies?.token; // Read token from HTTP-only cookie
//     console.log("token is",req.cookies)

//     if (!token) {
//         return res.status(401).json({ error: "Unauthorized: No token provided" });
//     }

//     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ error: "Forbidden: Invalid token" });
//         }
//         req.user = decoded; // Store user info in request object
//         next();
//     });
// };

// module.exports = verifyToken;




const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("toekn is:",authHeader)

  // Check if Authorization header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // Extract token from Bearer string
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    req.user = decoded; // Add user data to request
    next();
  });
};

module.exports = verifyToken;

