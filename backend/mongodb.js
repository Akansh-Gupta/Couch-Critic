require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URL);

let db;
console.log("MONGO_URL:", process.env.MONGO_URL);
async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db('CouchCritic');
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

function getDb() {
    if (!db) {
        throw new Error("Database not initialized. Call connectToMongoDB first.");
    }
    return db;
}

module.exports = {
    connectToMongoDB,
    getDb
};
