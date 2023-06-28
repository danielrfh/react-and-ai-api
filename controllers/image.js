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

const handleApiCall = () => (req, res) => {
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = "face-detection";
  // app.models.predict(MODEL_ID, this.state.input)
  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id

  fetch(
    "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
    returnClarifaiRequestOptions(req.body.input)
  )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

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
