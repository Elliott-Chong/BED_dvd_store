import mysql from "mysql2";
let connection;

// exponential backoff
let retries = 5;
while (retries !== 0) {
  try {
    connection = mysql.createConnection({
      host: "database",
      user: "bed_dvd_root",
      password: "hello",
      database: "bed_dvd_db",
      port: "3306",
    });
    // await new Promise((res) => setTimeout(res, 1000));
    console.log("mysql server connected!");
    break;
  } catch (error) {
    retries--;
    console.log("retries left: ", retries);
    console.error("elle", error);
  }
}

export default connection;
