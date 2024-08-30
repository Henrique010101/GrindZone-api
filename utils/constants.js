/* 
  - Generating Token to test the API
  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ has_auth: true }, secret, { expiresIn: "1h" });
  console.log({ token });
*/

const secret = process.env.JWT_SECRET;
export default {
  secret,
};