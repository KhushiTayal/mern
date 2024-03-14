// backend/src/models/invoice.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface Product {
  name: string;
  quantity: number;
  rate: number;
  productTotal: number;
  productGST: number;
}

export interface InvoiceInterface extends Document {
  userId: string;
  products: Product[];
}

const InvoiceSchema: Schema = new Schema({
  userId: { type: String, required: true },
  products: [{ type: Object }],
});

const Invoice = mongoose.model<InvoiceInterface>('Invoice', InvoiceSchema);
console.log("Invoice database created");

export default Invoice;
