//Setup server
const express = require("express");
const socket = require("socket.io");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

app.use(express.static(__dirname + "/../client"));

//Connect to database
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "paperloon_database"
});

//Setup io
const io = socket(server);

io.on("connection", socket => {
	console.log(`${socket.id} has connected.`);
});

/*con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  let sql = "INSERT INTO users VALUES (default, 'test', '1234')";
  con.query(sql, (err, result) => {
  	if (err) throw err;
  	console.log("Record inserted");
  });

  con.end();
});*/

