const express = require('express');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const { default: axios } = require('axios');
const { connectToMongoDB } = require('./mongodb');
const { getDb } = require('./mongodb');

const app = express();

const jwtCheck = auth({
    audience: 'https://akansh-gupta.github.io/Couch-Critic/',
    issuerBaseURL: 'https://dev-z0rvyj6urasdkpip.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the Movie API');
});

app.get('/protected', jwtCheck, async (req, res) => {
    try {
    const accessToken = req.headers.authorization.split(' ')[1];

    const response = await axios.get('https://dev-z0rvyj6urasdkpip.us.auth0.com/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const userInfo = response.data;
    // Check if the user is a Google user
    const isGoogleUser = userInfo.sub.startsWith('google-oauth2|');
    const username = isGoogleUser
        ? userInfo.name
        : userInfo['https://couch-critic/username'] || 'Anonymous';
    const { picture, email, sub } = userInfo;

    const db = getDb();
    const usersCollection = db.collection('users');

    await usersCollection.updateOne(
        { sub },
        {
            $set: { username, picture, email },
            $setOnInsert: { role: 'USER' }
        },
        { upsert: true }
    );

    // res.send({ username, picture, email, role: 'USER' });
    res.send(userInfo)
} catch (error) {
    console.error('Error fetching or storing user info:', error.message);
    res.status(500).send({ error: 'Internal Server Error' });
}

});

connectToMongoDB()
  .then(() => {
    app.listen(4000, () => console.log('Server running on port 4000'));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit if DB fails
  });