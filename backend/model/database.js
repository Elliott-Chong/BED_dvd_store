import mysql from "mysql2";
let connection;

// exponential backoff
let retries = 5;
while (retries !== 0) {
  try {
    connection = mysql.createConnection({
	    host: "172.17.0.1",
      user: "docker_user",
	    password: "password",
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
