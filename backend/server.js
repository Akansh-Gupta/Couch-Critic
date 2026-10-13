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

app.use(cors({ origin: ['https://akansh-gupta.github.io', 'http://localhost:5173'] }));
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
                $set: { username, picture, email },
                $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true }
        );

        res.sendStatus(204);
    } catch (error) {
        console.error('Error fetching or storing user info:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
app.get('/users/me', jwtCheck, async (req, res) => {
    try {
        const db = getDb();
        const sub = req.auth.payload.sub;
        const user = await db.collection('users').findOne(
            { sub },
            { projection: { _id: 0, username: 1, email: 1, picture: 1, createdAt: 1 } }
        );
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.patch('/users/me', jwtCheck, async (req, res) => {
    try {
        const db = getDb();
        const sub = req.auth.payload.sub;
        const { username } = req.body;

        if (!username || !username.trim()) {
            return res.status(400).send({ error: 'username is required' });
        }
        const trimmed = username.trim();
        if (trimmed.length > 20) {
            return res.status(400).send({ error: 'Username must be 20 characters or fewer' });
        }

        await db.collection('users').updateOne(
            { sub },
            { $set: { username: trimmed } }
        );

        const updated = await db.collection('users').findOne(
            { sub },
            { projection: { _id: 0, username: 1, email: 1, picture: 1, createdAt: 1 } }
        );
        res.json(updated);
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get('/watchlater', jwtCheck, async (req, res) => {
    try {
        const sub = req.auth.payload.sub;
        const list = await getDb().collection('watchlater').find({ sub }).toArray();
        res.json(list);
    } catch (error) {
        console.error('Error fetching watch later:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/watchlater', jwtCheck, async (req, res) => {
    try {
        const sub = req.auth.payload.sub;
        const { simklId, item } = req.body;
        if (!simklId || !item) {
            return res.status(400).send({ error: 'simklId and item are required' });
        }
        await getDb().collection('watchlater').updateOne(
            { sub, simklId },
            { $set: { sub, simklId, item } },
            { upsert: true }
        );
        res.sendStatus(204);
    } catch (error) {
        console.error('Error saving watch later:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.delete('/watchlater/:simklId', jwtCheck, async (req, res) => {
    try {
        const sub = req.auth.payload.sub;
        await getDb().collection('watchlater').deleteOne({ sub, simklId: Number(req.params.simklId) });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error removing watch later:', error.message);
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

        await db.collection('comments').deleteMany({
            $or: [{ _id: new ObjectId(id) }, { parentId: id }]
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

connectToMongoDB()
    .then(() => {
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err);
        process.exit(1); // Exit if DB fails
    });