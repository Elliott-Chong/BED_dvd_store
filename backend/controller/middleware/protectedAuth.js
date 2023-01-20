import jwt from "jsonwebtoken";
import connection from "../../model/database.js";
import util from "util";
const query = util.promisify(connection.query).bind(connection);
import * as dotenv from "dotenv";
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (token) {
      const payload = await jwt.verify(token, process.env.JWT_SECRET);
      if (payload) {
        const user = await query("SELECT * FROM Users WHERE id=?", [
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
    console.log("invalid token");
    res.status(401).send("invalid token");
  }
};
export default auth;
