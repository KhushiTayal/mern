// backend/src/utils/pdfGenerator.ts

import puppeteer from 'puppeteer';
import { InvoiceInterface } from '../models/invoice';

export const generatePDF = async (invoice: InvoiceInterface) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Customize PDF generation based on your requirements
  const content = `<html><body><h1>Invoice</h1><p>${JSON.stringify(invoice)}</p></body></html>`;

  await page.setContent(content);
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();

  return pdfBuffer;
};
