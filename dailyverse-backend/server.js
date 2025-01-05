require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define a Verse schema
const verseSchema = new mongoose.Schema({
    reference: String,
    text: String,
});

const Verse = mongoose.model('Verse', verseSchema);

// API endpoint to fetch a random verse
app.get('/api/verse', async (req, res) => {
    try {
        const verses = await Verse.find();
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        res.json(randomVerse);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching verse', error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
