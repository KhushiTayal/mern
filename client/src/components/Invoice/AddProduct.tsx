import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices } from '../../store/invoiceSlice';
import { AppDispatch, RootState } from '../../types';

interface Product {
  name: string;
  quantity: number;
  rate: number;
}

const AddProduct: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user); // Assuming user details are stored in the Redux store

  const [productName, setProductName] = useState('');
  const [productQty, setProductQty] = useState(0);
  const [productRate, setProductRate] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  const handleAddProduct = async () => {
    // Validate input
    if (!productName || productQty <= 0 || productRate <= 0) {
      alert('Please fill in all product details.');
      return;
    }

    // Create a new product
    const newProduct: Product = {
      name: productName,
      quantity: productQty,
      rate: productRate,
    };

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/invoice/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        console.log('Product added successfully:', newProduct);
        setProducts([...products, newProduct]);
        setProductName('');
        setProductQty(0);
        setProductRate(0);
        await dispatch(fetchInvoices());
      } else {
        console.error('Error adding product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };


  const calculateTotal = () => {
    return products.reduce((total, product) => total + product.quantity * product.rate, 0);
  };

  const handleGeneratePDF = async () => {
    try {
      console.log("Sending PDF request...");

      const token = localStorage.getItem('authToken');
      console.log("token:", token);

      const response = await fetch('http://localhost:3001/invoice/generate-pdf', {
        method: 'POST', // Change to POST method
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user, products }), // Send user and products data in the request body
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);

      if (response.ok) {
        // Assuming the backend responds with the PDF data
        const pdfData = await response.blob();

        // Create a download link for the generated PDF
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(pdfData);
        downloadLink.download = 'generated-invoice.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log('PDF generated successfully.');
      } else {
        console.error('Error generating PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };


  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Add Product</h2>
      <div className="flex space-x-4">
        <div>
          <label htmlFor="productName" className="block">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="productQty" className="block">Product Quantity:</label>
          <input
            type="number"
            id="productQty"
            value={productQty}
            onChange={(e) => setProductQty(Number(e.target.value))}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="productRate" className="block">Product Rate:</label>
          <input
            type="number"
            id="productRate"
            value={productRate}
            onChange={(e) => setProductRate(Number(e.target.value))}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
      </div>
      <button onClick={handleAddProduct} className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">Add Product</button>

      {products.length > 0 && (
  <div>
    <h3 className="text-xl font-bold mb-4">Product List</h3>
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border border-gray-400 px-4 py-2">Product Name</th>
          <th className="border border-gray-400 px-4 py-2">Quantity</th>
          <th className="border border-gray-400 px-4 py-2">Rate</th>
          <th className="border border-gray-400 px-4 py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td className="border border-gray-400 px-4 py-2">{product.name}</td>
            <td className="border border-gray-400 px-4 py-2">{product.quantity}</td>
            <td className="border border-gray-400 px-4 py-2">{product.rate}</td>
            <td className="border border-gray-400 px-4 py-2">{product.quantity * product.rate}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <p className="text-lg font-bold mt-4">Total: {calculateTotal()}</p>
  </div>
)}


      {products.length > 0 && (
        <div>
          <button onClick={handleGeneratePDF} className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">Generate PDF</button>
        </div>
      )}
    </div>
  );
};

export default AddProduct;