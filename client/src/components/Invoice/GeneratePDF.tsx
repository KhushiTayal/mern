import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchInvoices } from '../../store/invoiceSlice';
import { AppDispatch } from '../../types';

const GeneratePDF: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleGeneratePDF = async () => {
    // Implement logic to generate PDF and update the state
    // ...

    // Fetch updated invoices after generating the PDF
    await dispatch(fetchInvoices());
  };

  return (
    <div>
      <button onClick={handleGeneratePDF}>Generate PDF</button>
    </div>
  );
};

export default GeneratePDF;
