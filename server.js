import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import mapRoutes from './routes/map.js';
import countyRoutes from './routes/county.js';
import cacheRoutes from './routes/cache.js';
import exportRoutes from './routes/export.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Trust proxy
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/map', mapRoutes);
app.use('/api/county', countyRoutes);
app.use('/api/cache', cacheRoutes);
app.use('/api/export', exportRoutes);

// Serve static files or proxy to Vite dev server
if (process.env.NODE_ENV === 'production') {
    if (fs.existsSync(path.join(__dirname, 'frontend', 'dist'))) {
        app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
        });
    } else {
        console.log('Frontend build not found. Please run "npm run build" in the frontend directory.');
    }
} else {
    // Proxy to Vite dev server in development
    app.use('/', createProxyMiddleware({
        target: 'http://localhost:5173', // Default Vite dev server port
        changeOrigin: true,
        ws: true,
    }));
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});