require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');
const fs = require('fs');

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', require('./routes/trip.routes.js'));
app.use('/api/trip-sections', require('./routes/tripSection.routes.js'));
app.use('/api/recommendations', require('./routes/recommendation.routes.js'));
app.use('/api/cities', require('./routes/city.routes.js'));
app.use('/api/activities', require('./routes/activity.routes.js'));
app.use('/api/expenses', require('./routes/expense.routes.js'));
app.use('/api/notes', require('./routes/note.routes.js'));
app.use('/api/packing-list', require('./routes/packing.routes.js'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
