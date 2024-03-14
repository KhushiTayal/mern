// controllers/invoiceController.ts

import { Request, Response } from 'express';
import Invoice, { Product } from '../models/invoice';
import pdf from 'html-pdf'; // Import your HTML to PDF conversion library

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user || { userId: '' };
    const invoices = await Invoice.find({ userId });
    res.json(invoices);
  } catch (error) {
    console.error('Error in getInvoices:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user || { userId: '' };
    const { title, amount } = req.body;
    const newInvoice = new Invoice({ title, amount, userId });
    await newInvoice.save();
    res.status(201).json({ message: 'Invoice created successfully' });
  } catch (error) {
    console.error('Error in createInvoice:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user || { userId: '' };
    const { name, quantity, rate } = req.body;
    console.log("new info:", name, quantity, rate);
    const product: Product = {
      name,
      quantity,
      rate,
      productTotal: quantity * rate,
      productGST: 0.18 * (quantity * rate),
    };

    console.log("adding product to database:", req.body);

    // Find the invoice document with the provided userId
    let invoice = await Invoice.findOne({ userId });

    // If no invoice document exists, create a new one
    if (!invoice) {
      invoice = new Invoice({ userId, products: [] });
    }

    // Push the new product into the products array
    invoice.products.push(product);

    // Save the updated or new invoice document
    await invoice.save();

    console.log("added product");

    res.status(200).json({ message: 'Product added to invoice successfully' });
  } catch (error) {
    console.error('Error in addProduct:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const generatePDFInvoice = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user || { userId: '' };
    console.log('UserID:', userId);
    const invoice = await Invoice.findOne({ userId });

    if (!invoice) {
      console.log('No invoice found for UserID:', userId); 
      return res.status(404).json({ message: 'Invoice not found' });
    }

    console.log('Invoice:', invoice);

    // Generate HTML content for the PDF (replace with your actual HTML template)
    const htmlContent = `
  <h1>INVOICE GENERATOR</h1>
  <table style="width:100%; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid black;">
      <th style="text-align: left; padding: 8px;">Product</th>
      <th style="text-align: left; padding: 8px;">Quantity</th>
      <th style="text-align: left; padding: 8px;">Rate</th>
      <th style="text-align: left; padding: 8px;">Total</th>
    </tr>
    ${invoice.products.map((product) => `
      <tr style="border-bottom: 1px solid black;">
        <td style="padding: 8px;">${product.name}</td>
        <td style="padding: 8px;">${product.quantity}</td>
        <td style="padding: 8px;">${product.rate}</td>
        <td style="padding: 8px;">${product.productTotal}</td>
      </tr>
    `).join('')}
    <tr>
      <td colspan="3" style="text-align: right; padding: 8px;">Grand Total:</td>
      <td style="padding: 8px;">${invoice.products.reduce((total, product) => total + product.productTotal, 0)}</td>
    </tr>
  </table>
`;


    // Add console log to check HTML content
    console.log('HTML Content:', htmlContent);

    // Configuration for PDF generation (replace with your actual configuration)
    const pdfOptions: {
      format: "A3" | "A4" | "A5" | "Legal" | "Letter" | "Tabloid";
      orientation: "portrait" | "landscape";
    } = {
      format: "A4", // Example format, adjust as needed
      orientation: "portrait", // Example orientation, adjust as needed
    };

    // Generate PDF from HTML content
    pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
      if (err) {
        console.error('Error generating PDF:', err);
        res.status(500).json({ message: 'Error generating PDF' });
      } else {
        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        res.send(buffer);
      }
    });
  } catch (error) {
    console.error('Error in generatePDFInvoice:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

