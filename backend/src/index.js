const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests only from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed request headers
  credentials: true, // Allow sending cookies/credentials with requests
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);


app.get('/', (req, res) => {
    res.send('City Feed API running')
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
