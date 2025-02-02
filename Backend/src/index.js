import express from 'express';
import { connectDB } from './config/DBconfig.js';
import faqRoutes from './routes/index.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());


connectDB();

// Routes
app.use('/api', faqRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
