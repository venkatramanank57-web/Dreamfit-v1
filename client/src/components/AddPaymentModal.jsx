// // client/src/components/AddPaymentModal.jsx
// import React, { useState, useEffect } from "react";
// import { X, IndianRupee, Calendar, Clock, Hash, Wallet, Banknote, Smartphone, Landmark, CreditCard } from "lucide-react";
// import showToast from "../utils/toast";

// export default function AddPaymentModal({ 
//   isOpen, 
//   onClose, 
//   onSave, 
//   orderTotal = 0,
//   orderId,
//   customerId,
//   initialData = null,
//   title = "Add Payment"
// }) {
//   const [formData, setFormData] = useState({
//     amount: "",
//     type: "advance",
//     method: "cash",
//     referenceNumber: "",
//     paymentDate: new Date().toISOString().split('T')[0],
//     paymentTime: new Date().toLocaleTimeString('en-US', { 
//       hour12: false, 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     }),
//     notes: ""
//   });

//   const [errors, setErrors] = useState({});

//   // Load initial data if editing
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         amount: initialData.amount || "",
//         type: initialData.type || "advance",
//         method: initialData.method || "cash",
//         referenceNumber: initialData.referenceNumber || "",
//         paymentDate: initialData.paymentDate?.split('T')[0] || new Date().toISOString().split('T')[0],
//         paymentTime: initialData.paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
//         notes: initialData.notes || ""
//       });
//     }
//   }, [initialData]);

//   // Reset form when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setFormData({
//         amount: "",
//         type: "advance",
//         method: "cash",
//         referenceNumber: "",
//         paymentDate: new Date().toISOString().split('T')[0],
//         paymentTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
//         notes: ""
//       });
//       setErrors({});
//     }
//   }, [isOpen]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.amount || formData.amount <= 0) {
//       newErrors.amount = "Please enter a valid amount";
//     }

//     if (formData.type === "full" && Number(formData.amount) < orderTotal) {
//       newErrors.amount = `Full payment should be at least ₹${orderTotal}`;
//     }

//     if (!formData.paymentDate) {
//       newErrors.paymentDate = "Payment date is required";
//     }

//     if (!formData.paymentTime) {
//       newErrors.paymentTime = "Payment time is required";
//     }

//     if (formData.method !== "cash" && !formData.referenceNumber.trim()) {
//       newErrors.referenceNumber = `Reference number is required for ${getMethodLabel(formData.method)} payment`;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const getMethodLabel = (method) => {
//     switch(method) {
//       case 'upi': return 'UPI';
//       case 'bank-transfer': return 'Bank Transfer';
//       case 'card': return 'Card';
//       default: return 'Cash';
//     }
//   };

//   const getMethodIcon = (method) => {
//     switch(method) {
//       case 'cash': return <Banknote size={18} className="text-green-600" />;
//       case 'upi': return <Smartphone size={18} className="text-blue-600" />;
//       case 'bank-transfer': return <Landmark size={18} className="text-purple-600" />;
//       case 'card': return <CreditCard size={18} className="text-orange-600" />;
//       default: return <Wallet size={18} className="text-slate-600" />;
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     onSave({
//       order: orderId,
//       customer: customerId,
//       ...formData,
//       amount: Number(formData.amount)
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: null }));
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
//       <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-black text-slate-800">{title}</h3>
//           <button 
//             onClick={onClose} 
//             className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {orderTotal > 0 && (
//           <div className="bg-blue-50 p-3 rounded-xl mb-4">
//             <p className="text-xs text-blue-600 font-bold">Order Total</p>
//             <p className="text-lg font-black text-blue-700">₹{orderTotal}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Amount */}
//           <div>
//             <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//               Amount (₹) <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <IndianRupee className="absolute left-3 top-3 text-slate-400" size={18} />
//               <input
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 min="1"
//                 step="1"
//                 className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
//                   errors.amount ? 'border-red-300 bg-red-50' : 'border-slate-200'
//                 }`}
//                 placeholder="Enter amount"
//                 required
//               />
//             </div>
//             {errors.amount && (
//               <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
//             )}
//           </div>

//           {/* Payment Type */}
//           <div>
//             <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//               Payment Type <span className="text-red-500">*</span>
//             </label>
//             <div className="grid grid-cols-3 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setFormData({...formData, type: "advance"})}
//                 className={`py-3 rounded-xl font-bold transition-all ${
//                   formData.type === "advance"
//                     ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
//                     : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//                 }`}
//               >
//                 Advance
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setFormData({...formData, type: "full"})}
//                 className={`py-3 rounded-xl font-bold transition-all ${
//                   formData.type === "full"
//                     ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
//                     : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//                 }`}
//               >
//                 Full
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setFormData({...formData, type: "extra"})}
//                 className={`py-3 rounded-xl font-bold transition-all ${
//                   formData.type === "extra"
//                     ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
//                     : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//                 }`}
//               >
//                 Extra
//               </button>
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div>
//             <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//               Payment Method <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <div className="absolute left-3 top-3">
//                 {getMethodIcon(formData.method)}
//               </div>
//               <select
//                 name="method"
//                 value={formData.method}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
//                 required
//               >
//                 <option value="cash">Cash</option>
//                 <option value="upi">UPI</option>
//                 <option value="bank-transfer">Bank Transfer</option>
//                 <option value="card">Card</option>
//               </select>
//             </div>
//           </div>

//           {/* Reference Number - for non-cash payments */}
//           {formData.method !== 'cash' && (
//             <div>
//               <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                 Reference Number 
//                 <span className="text-xs font-normal lowercase ml-1 text-slate-400">
//                   (Transaction ID / UPI Ref)
//                 </span>
//               </label>
//               <div className="relative">
//                 <Hash className="absolute left-3 top-3 text-slate-400" size={18} />
//                 <input
//                   type="text"
//                   name="referenceNumber"
//                   value={formData.referenceNumber}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
//                     errors.referenceNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'
//                   }`}
//                   placeholder={`Enter ${getMethodLabel(formData.method)} reference`}
//                 />
//               </div>
//               {errors.referenceNumber && (
//                 <p className="text-xs text-red-500 mt-1">{errors.referenceNumber}</p>
//               )}
//               <p className="text-xs text-slate-400 mt-1">
//                 {formData.method === "upi" && "e.g., UPI transaction ID or VPA"}
//                 {formData.method === "bank-transfer" && "e.g., NEFT/IMPS/RTGS reference"}
//                 {formData.method === "card" && "e.g., Card transaction ID"}
//               </p>
//             </div>
//           )}

//           {/* Date and Time */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                 Date <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
//                 <input
//                   type="date"
//                   name="paymentDate"
//                   value={formData.paymentDate}
//                   onChange={handleChange}
//                   max={new Date().toISOString().split('T')[0]}
//                   className={`w-full pl-9 pr-3 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
//                     errors.paymentDate ? 'border-red-300 bg-red-50' : 'border-slate-200'
//                   }`}
//                   required
//                 />
//               </div>
//               {errors.paymentDate && (
//                 <p className="text-xs text-red-500 mt-1">{errors.paymentDate}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                 Time <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Clock className="absolute left-3 top-3 text-slate-400" size={16} />
//                 <input
//                   type="time"
//                   name="paymentTime"
//                   value={formData.paymentTime}
//                   onChange={handleChange}
//                   className={`w-full pl-9 pr-3 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
//                     errors.paymentTime ? 'border-red-300 bg-red-50' : 'border-slate-200'
//                   }`}
//                   required
//                 />
//               </div>
//               {errors.paymentTime && (
//                 <p className="text-xs text-red-500 mt-1">{errors.paymentTime}</p>
//               )}
//             </div>
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//               Notes <span className="text-slate-400">(Optional)</span>
//             </label>
//             <textarea
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               rows="2"
//               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
//               placeholder="Any notes about this payment..."
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-500/30"
//             >
//               {initialData ? 'Update' : 'Add'} Payment
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-bold transition-all"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// client/src/components/AddPaymentModal.jsx
import React, { useState, useEffect } from "react";
import { X, IndianRupee, Calendar, Clock, Hash, Wallet, Banknote, Smartphone, Landmark, CreditCard } from "lucide-react";
import showToast from "../utils/toast";

export default function AddPaymentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  orderTotalMin = 0,    // ✅ Changed from orderTotal
  orderTotalMax = 0,    // ✅ Added max price
  orderId,
  customerId,
  initialData = null,
  title = "Add Payment"
}) {
  const [formData, setFormData] = useState({
    amount: "",
    type: "advance",
    method: "cash",
    referenceNumber: "",
    paymentDate: new Date().toISOString().split('T')[0],
    paymentTime: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    notes: ""
  });

  const [errors, setErrors] = useState({});

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || "",
        type: initialData.type || "advance",
        method: initialData.method || "cash",
        referenceNumber: initialData.referenceNumber || "",
        paymentDate: initialData.paymentDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        paymentTime: initialData.paymentTime || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        notes: initialData.notes || ""
      });
    }
  }, [initialData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        amount: "",
        type: "advance",
        method: "cash",
        referenceNumber: "",
        paymentDate: new Date().toISOString().split('T')[0],
        paymentTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        notes: ""
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    // ✅ Updated validation with price range
    if (formData.type === "full") {
      if (Number(formData.amount) < orderTotalMin) {
        newErrors.amount = `Full payment should be at least minimum amount ₹${orderTotalMin}`;
      }
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }

    if (!formData.paymentTime) {
      newErrors.paymentTime = "Payment time is required";
    }

    // ✅ UPI Reference Number is now OPTIONAL - removed validation
    // Only show warning but don't block submission
    if (formData.method !== "cash" && !formData.referenceNumber.trim()) {
      // Just show toast warning, don't add to errors
      setTimeout(() => {
        showToast.warning(`Reference number is recommended for ${getMethodLabel(formData.method)} payment`);
      }, 100);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getMethodLabel = (method) => {
    switch(method) {
      case 'upi': return 'UPI';
      case 'bank-transfer': return 'Bank Transfer';
      case 'card': return 'Card';
      default: return 'Cash';
    }
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'cash': return <Banknote size={18} className="text-green-600" />;
      case 'upi': return <Smartphone size={18} className="text-blue-600" />;
      case 'bank-transfer': return <Landmark size={18} className="text-purple-600" />;
      case 'card': return <CreditCard size={18} className="text-orange-600" />;
      default: return <Wallet size={18} className="text-slate-600" />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      order: orderId,
      customer: customerId,
      ...formData,
      amount: Number(formData.amount)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-slate-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* ✅ Updated to show price range */}
        {(orderTotalMin > 0 || orderTotalMax > 0) && (
          <div className="bg-blue-50 p-3 rounded-xl mb-4">
            <p className="text-xs text-blue-600 font-bold">Order Price Range</p>
            <p className="text-lg font-black text-blue-700">
              ₹{orderTotalMin} - ₹{orderTotalMax}
            </p>
            {orderTotalMin === orderTotalMax && (
              <p className="text-xs text-blue-600 mt-1">Fixed price</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="1"
                step="1"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="Enter amount"
                required
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">
              Payment Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: "advance"})}
                className={`py-3 rounded-xl font-bold transition-all ${
                  formData.type === "advance"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Advance
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: "full"})}
                className={`py-3 rounded-xl font-bold transition-all ${
                  formData.type === "full"
                    ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Full
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: "extra"})}
                className={`py-3 rounded-xl font-bold transition-all ${
                  formData.type === "extra"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Extra
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3">
                {getMethodIcon(formData.method)}
              </div>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                required
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>

          {/* Reference Number - Now OPTIONAL for all methods */}
          {formData.method !== 'cash' && (
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                Reference Number 
                <span className="text-xs font-normal lowercase ml-1 text-slate-400">
                  (Optional - Transaction ID / UPI Ref)
                </span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={`Enter ${getMethodLabel(formData.method)} reference (optional)`}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {formData.method === "upi" && "e.g., UPI transaction ID or VPA (optional)"}
                {formData.method === "bank-transfer" && "e.g., NEFT/IMPS/RTGS reference (optional)"}
                {formData.method === "card" && "e.g., Card transaction ID (optional)"}
              </p>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-9 pr-3 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                    errors.paymentDate ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                  required
                />
              </div>
              {errors.paymentDate && (
                <p className="text-xs text-red-500 mt-1">{errors.paymentDate}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="time"
                  name="paymentTime"
                  value={formData.paymentTime}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                    errors.paymentTime ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                  required
                />
              </div>
              {errors.paymentTime && (
                <p className="text-xs text-red-500 mt-1">{errors.paymentTime}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">
              Notes <span className="text-slate-400">(Optional)</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Any notes about this payment..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-500/30"
            >
              {initialData ? 'Update' : 'Add'} Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}