// backend/src/app.ts

import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import invoiceRoutes from './routes/invoiceRoutes';

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// API routes
app.use('/auth', authRoutes);
app.use('/invoice', invoiceRoutes);

export default app;
