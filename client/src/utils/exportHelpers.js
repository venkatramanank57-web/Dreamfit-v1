// cutomer oda full paymet history download pana 
// frontend/src/utils/exportHelpers.js
import * as XLSX from 'xlsx';
import showToast from './toast';

// Export payments to Excel
export const exportPaymentsToExcel = (payments, customerInfo = {}) => {
  try {
    if (!payments || payments.length === 0) {
      showToast.error("No payments to export");
      return false;
    }

    // Prepare data with ALL fields
    const exportData = payments.map(payment => ({
      'Payment ID': payment._id || 'N/A',
      'Order ID': payment.order?.orderId || payment.order || 'N/A',
      'Customer ID': customerInfo.customerId || payment.customer?.customerId || 'N/A',
      'Customer Name': customerInfo.name || payment.customer?.name || 'N/A',
      'Amount (₹)': payment.amount || 0,
      'Payment Type': payment.type || 'N/A',
      'Payment Method': payment.method || 'N/A',
      'Reference Number': payment.referenceNumber || 'N/A',
      'Date': payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN') : 'N/A',
      'Time': payment.paymentTime || 'N/A',
      'Received By': payment.receivedBy?.name || payment.receivedBy || 'N/A',
      'Notes': payment.notes || 'N/A',
      'Created At': payment.createdAt ? new Date(payment.createdAt).toLocaleString('en-IN') : 'N/A'
    }));

    // Create worksheet with column widths
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wscols = [
      { wch: 25 }, // Payment ID
      { wch: 20 }, // Order ID
      { wch: 15 }, // Customer ID
      { wch: 25 }, // Customer Name
      { wch: 15 }, // Amount
      { wch: 15 }, // Type
      { wch: 15 }, // Method
      { wch: 20 }, // Reference
      { wch: 12 }, // Date
      { wch: 10 }, // Time
      { wch: 20 }, // Received By
      { wch: 30 }, // Notes
      { wch: 20 }  // Created At
    ];
    ws['!cols'] = wscols;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    
    // Generate filename
    const fileName = `payments_${customerInfo.customerId || 'customer'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, fileName);
    
    showToast.success(`${payments.length} payments exported successfully! 📊`);
    return true;
  } catch (error) {
    console.error("Export error:", error);
    showToast.error("Failed to export payments");
    return false;
  }
};

// Export orders to Excel
export const exportOrdersToExcel = (orders, customerInfo = {}) => {
  try {
    if (!orders || orders.length === 0) {
      showToast.error("No orders to export");
      return false;
    }

    const exportData = orders.map(order => ({
      'Order ID': order.orderId || 'N/A',
      'Customer ID': customerInfo.customerId || order.customer?.customerId || 'N/A',
      'Customer Name': customerInfo.name || order.customer?.name || 'N/A',
      'Order Date': order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : 'N/A',
      'Delivery Date': order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN') : 'N/A',
      'Status': order.status || 'N/A',
      'Total Amount (Min)': order.priceSummary?.totalMin || 0,
      'Total Amount (Max)': order.priceSummary?.totalMax || 0,
      'Total Paid': order.paymentSummary?.totalPaid || 0,
      'Balance': order.balanceAmount || 0,
      'Payment Status': order.paymentSummary?.paymentStatus || 'N/A',
      'Garments Count': order.garments?.length || 0,
      'Created At': order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    
    const fileName = `orders_${customerInfo.customerId || 'customer'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    showToast.success(`${orders.length} orders exported successfully! 📊`);
    return true;
  } catch (error) {
    console.error("Export error:", error);
    showToast.error("Failed to export orders");
    return false;
  }
};