/**
 * Handles the registration process for a user.
 * @param {Object} db - The database object.
 * @param {Object} bcrypt - The bcrypt object for password hashing.
 * @returns {Function} - A function that handles the registration request.
 */
const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));

  // bcrypt.hash(password, null, null, function (err, hash) {
  //   // Store hash in your password DB.
  //   console.log(hash);
  // });
  // database.users.push({
  //   id: "125",
  //   name: name,
  //   email: email,
  //   entries: 0,
  //   joined: new Date(),
  // });
  // res.json(database.users[database.users.length - 1]);
};

module.exports = {
  handleRegister: handleRegister,
};
