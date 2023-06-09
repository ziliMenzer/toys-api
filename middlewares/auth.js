const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.auth = async (req, res, next) => {
  let token = req.header("x-api-key")
  if (!token) {
    return res.status(401).json({ msg: "You need to send token to access this endpoint"});
  }
  try {
    let tokenData = jwt.verify(token, config.tokenSecret);
    req.tokenData = tokenData;
    next();
  }
  catch (err) {
    return res.status(401).json({ msg: "Token is not valid or expired"});
  }
}
exports.authAdmin = (req, res,next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ msg: "You need to send token to access this endpoint" });
  }
  try {
    let decodeToken = jwt.verify(token, config.tokenSecret);
    if (decodeToken.role != "admin") {
      return res.status(401).json({ msg: "Token invalid or expired, code 3" });
    }
    next();
  }
  catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Token invalid or expired, log in again or you are a hacker!" });
  }
}