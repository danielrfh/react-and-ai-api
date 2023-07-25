/**
 * Handles the sign-in process by checking the provided email and password against the
 * database and returning a response based on the result.
 * @param {object} db - The database object used to query the login table.
 * @param {object} bcrypt - The bcrypt object used to compare the password hash.
 * @returns {function} A function that takes in the request and response objects and
 * performs the sign-in process.
 */
const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));

  // Load hash from your password DB.
  // bcrypt.compare(
  //   "apples",
  //   "$2a$10$7SWq9Uo46cx3oPhgtDGrJ./D6FWSaosrQlaRm.7FYOoSx0blyWXNW",
  //   function (err, res) {
  //     // res == true
  //     console.log("first guess", res);
  //   }
  // );
  // bcrypt.compare(
  //   "veggies",
  //   "$2a$10$7SWq9Uo46cx3oPhgtDGrJ./D6FWSaosrQlaRm.7FYOoSx0blyWXNW",
  //   function (err, res) {
  //     // res = false
  //     console.log("second guess", res);
  //   }
  // );
  // if (
  //   req.body.email === database.users[0].email &&
  //   req.body.password === database.users[0].password
  // ) {
  //   res.json(database.users[0]);
  // } else {
  //   res.status(400).json("error logging in");
  // }
};

module.exports = {
  handleSignin: handleSignin,
};
