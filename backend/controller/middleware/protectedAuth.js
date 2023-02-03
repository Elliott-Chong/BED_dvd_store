import jwt from "jsonwebtoken";
import connection from "../../model/database.js";
import util from "util";
const query = util.promisify(connection.query).bind(connection);
import * as dotenv from "dotenv";
dotenv.config();

const auth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (token) {
      token = token.replace("Bearer ", "");
      const payload = await jwt.verify(token, process.env.JWT_SECRET);
      if (payload) {
        const user = await query("SELECT * FROM staff WHERE staff_id=?", [
          payload.user.id,
        ]);
        req.user = user[0];
        next();
      }
    } else {
      console.log("no token");
      return res.status(403).send("no token");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("invalid token");
  }
};
export default auth;
