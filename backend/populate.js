import connection from "./model/database.js";
import util from "util";
import bcrypt from "bcryptjs";
let query = util.promisify(connection.query).bind(connection);

let PASSWORD = "password123";

// update each row with a new password
async function updatePassword() {
  let rows = await query("SELECT * FROM customer");
  let all_promises = [];
  for (let i = 0; i < rows.length; i++) {
    console.log("updating password for " + rows[i].id + rows[i].email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PASSWORD, salt);
    all_promises.push(
      query("UPDATE customer SET password = ? WHERE customer_id = ?", [
        hashedPassword,
        rows[i].customer_id,
      ])
    );
  }
  Promise.all(all_promises);
}

async function updateAdminPassword() {
  let rows = await query("SELECT * FROM staff");
  for (let i = 0; i < rows.length; i++) {
    console.log("updating password for " + rows[i].staff_id + rows[i].email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PASSWORD, salt);
    await query("UPDATE staff SET password = ? WHERE staff_id = ?", [
      hashedPassword,
      rows[i].staff_id,
    ]);
  }
}

updateAdminPassword();
// updatePassword();
