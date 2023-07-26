const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// const database = {
//   users: [
//     {
//       id: "123",
//       name: "john",
//       email: "john@gmail.com",
//       password: "cookies",
//       entries: 0,
//       joined: new Date(),
//     },
//     {
//       id: "124",
//       name: "Sally",
//       email: "sally@gmail.com",
//       password: "bananas",
//       entries: 0,
//       joined: new Date(),
//     },
//   ],
// };

// login: [
//   {
//     id: "987",
//     hash: "",
//     email: "john@gmail.com",
//   },
// ];

/**
 * Creates a new instance of a Knex database connection.
 * @param {object} options - The configuration options for the database connection.
 * @param {string} options.client - The database client to use (e.g. "pg" for PostgreSQL).
 * @param {object} options.connection - The connection details for the database.
 * @param {string} options.connection.host - The host of the database server.
 * @param {number} options.connection.port - The port number of the database server.
 * @param {string} options.connection.user - The username for the database connection.
 * @param {string} options.connection.password - The password for the database connection.
 * @param {string} options.connection.database - The name
 */
const db = knex({
  client: "pg",
  // connection: {
  //   host: process.env.POSTGRES_HOST,
  //   port: 5432,
  //   user: process.env.POSTGRES_USER,
  //   password: process.env.POSTGRES_PASSWORD,
  //   database: process.env.POSTGRES_DB,
  // },
  connection: process.env.POSTGRES_URI,
});

// db.select("*")
//   .from("users")
//   .then((data) => {
//     console.log(data);
//   });

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

// Test root end point by retrieving all users from the database
// app.get("/", (req, res) => {
//   res.send(database.users);
// });

app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleProfileGet(db));
app.put("/image", image.handleImage(db));
app.post("/imageurl", image.handleApiCall());

app.listen(4000, () => {
  console.log("app is running on port 4000");
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user 
*/
