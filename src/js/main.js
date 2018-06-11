const express = require('express');
import Instagram from 'node-instagram';

// Create a new instance.
const instagram = new Instagram({
  clientId: process.env.NODE_ENV === 'sandbox' ? require('../../config.json').clientId : process.env.CLIENTID,
  clientSecret: process.env.NODE_ENV === 'sandbox' ? require('../../config.json').clientSecret : process.env.CLIENTSECRET
});

const redirectUri = process.env.REDIRECT_URI + '/auth/instagram/callback';

const port = process.env.PORT || 8080;

// create express server
const app = express();

// Redirect user to instagram oauth
app.get('/auth/instagram', (req, res) => {
  res.redirect(
    instagram.getAuthorizationUrl(
      redirectUri,
      {
        // an array of scopes
        scope: ['basic', 'public_content'],
      }
    )
  );
});

// Handle auth code and get access_token for user
app.get('/auth/instagram/callback', async (req, res) => {
  try {
    // The code from the request, here req.query.code for express
    const code = req.query.code;
    const data = await instagram.authorizeUser(code, redirectUri);
    // data.access_token contain the user access_token
    res.json(data);
  } catch (err) {
    res.json(err);
  }
});

app.get('/tag/:tag', (req, res) => {
  // Get information about a tag object.
  console.log(instagram);

  instagram.get(`tags/${req.params.tag}`).then(data => {
    console.log(data);
  })
});

// listen to port 3000
app.listen(port, () => {
  console.log('app listening on http://localhost:' + port);
});