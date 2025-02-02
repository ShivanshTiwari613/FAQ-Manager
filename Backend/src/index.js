import express from 'express';
import { connectDB } from './config/DBconfig.js';
import faqRoutes from './routes/index.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api', faqRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') { 
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for testing.
export default app;