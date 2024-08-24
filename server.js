import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mapRoutes from './routes/map.js';
import countyRoutes from './routes/county.js';
import cacheRoutes from './routes/cache.js';
import exportRoutes from './routes/export.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the County Data API' });
});
app.use('/map', mapRoutes);
app.use('/county', countyRoutes);
app.use('/cache', cacheRoutes);
app.use('/export', exportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});