// features/payment/paymentapi.js
import API from "../../app/axios";

const paymentAPI = {
  // Get payment statistics
  getPaymentStats: (params) => 
    API.get("/payments/stats", { params }),

  // Get all payments for an order
  getOrderPayments: (orderId) => 
    API.get(`/payments/order/${orderId}`),

  // Get single payment
  getPayment: (id) => 
    API.get(`/payments/${id}`),

  // Create new payment
  createPayment: (data) => 
    API.post("/payments", data),

  // Update payment
  updatePayment: (id, data) => 
    API.put(`/payments/${id}`, data),

  // Delete payment
  deletePayment: (id) => 
    API.delete(`/payments/${id}`)
};

export default paymentAPI;