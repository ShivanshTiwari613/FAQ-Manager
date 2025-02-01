const express = require('express');
const connectDB = require('./config/config');
const faqRoutes = require('./routes/index');

const app = express();

app.use(express.json());

connectDB();

app.use('/api', faqRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
