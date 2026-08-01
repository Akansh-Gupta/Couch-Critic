const express = require('express');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const { default: axios } = require('axios');
const { connectToMongoDB } = require('./mongodb');
const { ObjectId } = require('mongodb');
const { getDb } = require('./mongodb');

const app = express();

const jwtCheck = auth({
    audience: 'https://akansh-gupta.github.io/Couch-Critic/',
    issuerBaseURL: 'https://dev-z0rvyj6urasdkpip.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Movie API');
});

app.get('/protected', jwtCheck, async (req, res) => {
    try {
        const db = getDb();
        if (!getDb()) return res.status(503).send("Database not ready");
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

        const usersCollection = db.collection('users');

        await usersCollection.updateOne(
            { sub },
            {
                $set: { username, picture, email }
            },
            { upsert: true }
        );

        // res.send({ username, picture, email, role: 'USER' });
        // res.send(userInfo)
    } catch (error) {
        console.error('Error fetching or storing user info:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }

});

app.get('/comments/:type/:id', async (req, res) => {
    try {
        const db = getDb();
        const { type, id } = req.params;
        const comments = await db.collection('comments')
            .find({ itemType: type, itemId: id })
            .sort({ createdAt: -1 })
            .toArray();
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/comments', jwtCheck, async (req, res) => {
    try {
        const db = getDb();
        const { itemId, itemType, text, parentId } = req.body;

        if (!itemId || !itemType || !text || !text.trim()) {
            return res.status(400).send({ error: 'itemId, itemType and text are required' });
        }
        if (text.length > 1000) {
            return res.status(400).send({ error: 'Comment too long' });
        }
        if (parentId && !ObjectId.isValid(parentId)) {
            return res.status(400).send({ error: 'Invalid parentId' });
        }

        const sub = req.auth.payload.sub;
        const user = await db.collection('users').findOne({ sub });

        const comment = {
            itemId,
            itemType,
            parentId: parentId || null,
            userSub: sub,
            username: user?.username || 'Anonymous',
            picture: user?.picture || null,
            text: text.trim(),
            createdAt: new Date()
        };

        const result = await db.collection('comments').insertOne(comment);
        res.status(201).json({ ...comment, _id: result.insertedId });
    } catch (error) {
        console.error('Error posting comment:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.patch('/comments/:id', jwtCheck, async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).send({ error: 'text is required' });
        }
        if (text.length > 1000) {
            return res.status(400).send({ error: 'Comment too long' });
        }
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ error: 'Invalid comment id' });
        }

        const sub = req.auth.payload.sub;
        const comment = await db.collection('comments').findOne({ _id: new ObjectId(id) });

        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }
        if (comment.userSub !== sub) {
            return res.status(403).send({ error: 'You can only edit your own comments' });
        }

        const updatedText = text.trim();
        await db.collection('comments').updateOne(
            { _id: new ObjectId(id) },
            { $set: { text: updatedText, editedAt: new Date() } }
        );

        res.json({ ...comment, text: updatedText, editedAt: new Date() });
    } catch (error) {
        console.error('Error editing comment:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.delete('/comments/:id', jwtCheck, async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ error: 'Invalid comment id' });
        }

        const sub = req.auth.payload.sub;
        const comment = await db.collection('comments').findOne({ _id: new ObjectId(id) });

        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }
        if (comment.userSub !== sub) {
            return res.status(403).send({ error: 'You can only delete your own comments' });
        }

        await db.collection('comments').deleteOne({ _id: new ObjectId(id) });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error.message);
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