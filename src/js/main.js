const express = require('express');
import Instagram from 'node-instagram';
const config = require('../../config.json');

// Create a new instance.
const instagram = new Instagram({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

const redirectUri = 'http://localhost:3000/auth/instagram/callback';

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
// listen to port 3000
app.listen(3000, () => {
  console.log('app listening on http://localhost:3000');
});