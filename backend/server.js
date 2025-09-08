import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment variables');
  process.exit(1);
}

try {
  await mongoose.connect(MONGODB_URI, { 
    serverSelectionTimeoutMS: 10000 
  });
  console.log('MongoDB connected');
} catch (err) {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}

// --- Model
const readingSchema = new mongoose.Schema({
  deviceId: { type: String, default: 'esp32' },
  temperature: Number,
  humidity: Number,
  ts: { type: Date, default: Date.now }
}, { versionKey: false });

const Reading = mongoose.model('Reading', readingSchema);

// --- Routes
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'ESP32 Readings API' });
});

// Receive a new reading
app.post('/api/readings', async (req, res) => {
  try {
    const { deviceId = 'esp32', temperature, humidity, ts } = req.body || {};
    if (typeof temperature !== 'number' || typeof humidity !== 'number') {
      return res.status(400).json({ error: 'temperature and humidity (number) are required' });
    }
    const doc = await Reading.create({ deviceId, temperature, humidity, ts: ts ? new Date(ts) : new Date() });
    res.status(201).json({ insertedId: doc._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// List recent readings
app.get('/api/readings', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 200);
    const out = await Reading.find({}).sort({ ts: -1 }).limit(limit).lean();
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Latest reading
app.get('/api/readings/latest', async (req, res) => {
  try {
    const doc = await Reading.findOne({}).sort({ ts: -1 }).lean();
    if (!doc) return res.status(404).json({ error: 'no_data' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
