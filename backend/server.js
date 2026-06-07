const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const { sequelize } = require('./models');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// API Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/songs', require('./routes/songRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/admin.html'));
});

// Error handling
app.use(errorHandler);

// Initialize database and start server
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log('\n🎵 ====== Sons da Casa ======');
            console.log(`✅ Database synchronized`);
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📱 Public: http://localhost:${PORT}`);
            console.log(`🔐 Admin: http://localhost:${PORT}/admin.html`);
            console.log(`📊 API: http://localhost:${PORT}/api`);
            console.log('===========================\n');
        });
    })
    .catch(error => {
        console.error('❌ Failed to sync database:', error);
        process.exit(1);
    });