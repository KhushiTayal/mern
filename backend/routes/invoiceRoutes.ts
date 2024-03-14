// backend/src/routes/invoiceRoutes.ts

import express from 'express';
import { addProduct, generatePDFInvoice } from '../controllers/invoiceController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/add-product', authenticateUser, addProduct);
router.post('/generate-pdf', authenticateUser, generatePDFInvoice);

export default router;
