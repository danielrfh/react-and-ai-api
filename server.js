const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "dan",
    password: "",
    database: "smart-brain",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

app.use(express.json());
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
