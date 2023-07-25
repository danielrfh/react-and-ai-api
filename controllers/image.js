/**
 * Returns the request options object for making a Clarifai API request.
 * @param {string} imageUrl - The URL of the image to analyze.
 * @returns {object} The request options object.
 */
const returnClarifaiRequestOptions = (imageUrl) => {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // In this section, we set the user authentication, user and app ID, model details, and the URL
  // of the image we want as an input. Change these strings to run your own example.
  //////////////////////////////////////////////////////////////////////////////////////////////////

  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "d7bc774fde8a4850af4ac59501f89928";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "danielrfh";
  const APP_ID = "my-first-application-twtjtb";

  const IMAGE_URL = imageUrl;
  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////
  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };
  return requestOptions;
};

/**
 * Handles an API call by sending a request and responding with the received data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns None
 */
const handleApiCall = () => (req, res) => {
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = "face-detection";
  // app.models.predict(MODEL_ID, this.state.input) <- Old API

  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id

  // Call Clarifai API using the URL on this.state.input
  fetch(
    "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
    returnClarifaiRequestOptions(req.body.input)
  )
    // Fetch does not directly return the JSON response body but instead
    // returns a promise that resolves with a Response object.
    .then((data) => {
      // console.log(response);

      // The Response object, in turn, does not directly contain the
      // actual JSON response body but is instead a representation of
      // the entire HTTP response. So, to extract the JSON body content
      // from the Response object, we use the json() method, which
      // returns a second promise that resolves with the result of
      // parsing the response body text as JSON

      data.json().then((data) => {
        // Access the object in the 'data' variable
        // console.log(this.calculateFaceLocation(data));
        res.json(data);
      });
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

/**
 * Handles the request to increment the "entries" count for a user in the database.
 * @param {Object} db - The database object.
 * @returns {Function} - The request handler function.
 */
const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries"));

  // let found = false;
  // database.users.forEach((user) => {
  //   if (user.id === id) {
  //     found = true;
  //     user.entries++;
  //     return res.json(user.entries);
  //   }
  // });
  // if (!found) {
  //   res.status(400).json("not found");
  // }
};

module.exports = {
  handleImage,
  handleApiCall,
};
