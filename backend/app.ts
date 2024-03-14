// backend/src/app.ts

import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import invoiceRoutes from './routes/invoiceRoutes';

const app = express();

app.use(express.json());
app.use(cors());

// Your code
if (process.env.NODE_ENV === "production") {
    const path = require("path");
    app.use(express.static(path.resolve(__dirname, 'client', 'build')));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'),function (err) {
            if(err) {
                res.status(500).send(err)
            }
        });
    })
}
// Your code


// Connect to MongoDB
connectDB();

// API routes
app.use('/auth', authRoutes);
app.use('/invoice', invoiceRoutes);

export default app;
