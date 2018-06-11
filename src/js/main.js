const express = require('express');
import Instagram from 'node-instagram';

// Create a new instance.
let instagram = new Instagram({
  clientId: process.env.NODE_ENV === 'sandbox' ? require('../../config.json').clientId : process.env.CLIENTID,
  clientSecret: process.env.NODE_ENV === 'sandbox' ? require('../../config.json').clientSecret : process.env.CLIENTSECRET,
  accessToken: process.env.NODE_ENV === 'sandbox' ? '' : process.env.accessToken
});

const redirectUri = (process.env.NODE_ENV === 'sandbox' ?  'http://localhost:8080' : process.env.REDIRECT_URI)+ '/auth/instagram/callback';

const port = process.env.PORT || 8080;

// create express server
const app = express();

console.log('instagram: ', instagram, process.env.NODE_ENV);

const getAuth = async function(res) {
  return res.redirect(
    instagram.getAuthorizationUrl(
      redirectUri,
      {
        // an array of scopes
        scope: ['basic', 'public_content'],
      }
    )
  )
}
// Redirect user to instagram oauth
app.get('/auth/instagram', (req, res) => {
    getAuth(res);
});

// Handle auth code and get access_token for user
app.get('/auth/instagram/callback', async (req, res) => {
  try {
    // The code from the request, here req.query.code for express
    const code = req.query.code;
    const data = await instagram.authorizeUser(code, redirectUri);
    // data.access_token contain the user access_token
    instagram.config.accessToken = data.access_token;
    res.json(data);
  } catch (err) {
    res.json(err);
  }
});

app.get('/tags/:tag', (req, res) => {
  instagram.get(`tags/${encodeURIComponent(req.params.tag)}`, {access_token: instagram.config.accessToken}).then(data => {
    console.log(data);
    res.json(data);
  });
});

// listen to port 3000
app.listen(port, () => {
  console.log('app listening on http://localhost:' + port);
});