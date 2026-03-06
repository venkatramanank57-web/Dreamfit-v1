// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   ArrowLeft,
//   Save,
//   Plus,
//   Trash2,
//   User,
//   Calendar,
//   CreditCard,
//   IndianRupee,
//   Package,
//   Clock,
//   Wallet,
//   Banknote,
//   Smartphone,
//   Landmark,
//   X,
//   AlertCircle,
//   CheckCircle,
//   Info,
//   Bug,
// } from "lucide-react";
// import { createNewOrder } from "../../../features/order/orderSlice";
// import { createGarment } from "../../../features/garment/garmentSlice";
// import { fetchAllCustomers } from "../../../features/customer/customerSlice";
// import GarmentForm from "../garment/GarmentForm";
// import AddPaymentModal from "../../../components/AddPaymentModal";
// import showToast from "../../../utils/toast";

// export default function NewOrder() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Enhanced Debug configuration
//   const DEBUG = {
//     ENABLED: true,
//     LOG_LEVEL: 'verbose',
//     SHOW_PANEL: true,
//     LOG_REDUX: true,
//     LOG_API: true,
//     LOG_VALIDATION: true,
//     LOG_FORM_DATA: true
//   };
  
//   // Debug logger
//   const logDebug = (level, category, message, data = null) => {
//     if (!DEBUG.ENABLED) return;
    
//     const levels = { minimal: 1, normal: 2, verbose: 3 };
//     const currentLevel = levels[DEBUG.LOG_LEVEL] || 2;
//     const msgLevel = levels[level] || 2;
    
//     if (msgLevel > currentLevel) return;
    
//     const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
//     console.log(
//       `%c[${timestamp}][${category}] ${message}`,
//       `color: #00ff00; font-weight: bold;`,
//       data || ''
//     );
//   };

//   // Error logger
//   const logError = (context, error, additionalData = {}) => {
//     console.group(`❌ ERROR [${context}] - ${new Date().toISOString()}`);
//     console.error('Error object:', error);
//     console.error('Error message:', error?.message);
    
//     if (error?.response) {
//       console.log('🔍 Response Data:', error.response.data);
//       console.log('🔍 Status:', error.response.status);
//       console.log('🔍 Status Text:', error.response.statusText);
//       console.log('🔍 Headers:', error.response.headers);
      
//       if (error.response.data?.errors) {
//         console.log('📋 Validation Errors:', error.response.data.errors);
//       }
//       if (error.response.data?.message) {
//         console.log('📋 Server Message:', error.response.data.message);
//       }
//     }
    
//     if (error?.request) {
//       console.log('📡 Request:', error.request);
//     }
    
//     if (Object.keys(additionalData).length > 0) {
//       console.log('📦 Additional Data:', additionalData);
//     }
    
//     console.groupEnd();
//   };

//   // Validation helper
//   const validateMongoId = (id) => {
//     if (!id) return { valid: false, reason: 'ID is empty' };
//     const isValid = /^[0-9a-fA-F]{24}$/.test(id);
//     return { 
//       valid: isValid, 
//       reason: isValid ? 'Valid' : 'Invalid format - must be 24 hex characters' 
//     };
//   };

//   // Get passed customer from Customer Page (if any)
//   const passedCustomer = location.state?.customer;
  
//   logDebug('normal', 'INIT', 'Component initialized', {
//     hasPassedCustomer: !!passedCustomer,
//     passedCustomerId: passedCustomer?._id
//   });

//   useEffect(() => {
//     logDebug('normal', 'LIFECYCLE', 'Component mounted');
//     return () => logDebug('normal', 'LIFECYCLE', 'Component unmounted');
//   }, []);

//   // Fixed Redux selectors
//   const { customers, loading: customersLoading } = useSelector((state) => {
//     const customerData = state.customers?.customers || state.customer?.customers || [];
//     const customersArray = Array.isArray(customerData) ? customerData : [];
    
//     return {
//       customers: customersArray,
//       loading: state.customers?.loading || state.customer?.loading || false
//     };
//   });

//   const { user } = useSelector((state) => {
//     return { user: state.auth?.user };
//   });
  
//   const [formData, setFormData] = useState({
//     customer: "",
//     deliveryDate: "",
//     specialNotes: "",
//     advancePayment: {
//       amount: 0,
//       method: "cash",
//     },
//   });

//   // State for multiple payments
//   const [payments, setPayments] = useState([]);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [editingPayment, setEditingPayment] = useState(null);

//   const [garments, setGarments] = useState([]);
//   const [showGarmentModal, setShowGarmentModal] = useState(false);
//   const [editingGarment, setEditingGarment] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
//   const [selectedCustomerDisplay, setSelectedCustomerDisplay] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [serverErrors, setServerErrors] = useState(null);

//   // Get user ID
//   const userId = user?.id || user?._id;
//   const userRole = user?.role;

//   // Validate user ID
//   const userIdValidation = validateMongoId(userId);

//   logDebug('normal', 'AUTH', 'User authentication details', {
//     userId,
//     userIdValid: userIdValidation.valid,
//     userRole
//   });

//   // Get base path based on user role
//   const basePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // Load customers on mount
//   useEffect(() => {
//     logDebug('normal', 'API', 'Fetching customers');
//     dispatch(fetchAllCustomers())
//       .unwrap()
//       .then((result) => {
//         logDebug('normal', 'API', 'Customers fetched', { count: result?.length });
//       })
//       .catch((error) => {
//         logError('fetchCustomers', error);
//         showToast.error("Failed to load customers");
//       });
//   }, [dispatch]);

//   // AUTO-FILL LOGIC: When passedCustomer is available, auto-select them
//   useEffect(() => {
//     if (passedCustomer) {
//       logDebug('normal', 'AUTO-FILL', 'Auto-filling customer', {
//         passedCustomerId: passedCustomer._id
//       });
      
//       const fullCustomer = customers?.find(c => c._id === passedCustomer._id) || passedCustomer;
      
//       setFormData(prev => ({
//         ...prev,
//         customer: fullCustomer._id
//       }));

//       const fullName = getCustomerFullName(fullCustomer);
//       const displayId = getCustomerDisplayId(fullCustomer);
//       let displayText = `${fullName} (${displayId})`;
      
//       setSelectedCustomerDisplay(displayText);
//       setSearchTerm(displayText);
//       setShowCustomerDropdown(false);
//     }
//   }, [passedCustomer, customers]);

//   // Helper functions for customer display
//   const getCustomerFullName = (customer) => {
//     if (!customer) return 'Unknown Customer';
    
//     if (customer.firstName || customer.lastName) {
//       const firstName = customer.firstName || '';
//       const lastName = customer.lastName || '';
//       const fullName = `${firstName} ${lastName}`.trim();
//       if (fullName) return fullName;
//     }
    
//     if (customer.name) return customer.name;
    
//     return 'Unknown Customer';
//   };

//   const getCustomerDisplayId = (customer) => {
//     if (!customer) return '';
//     return customer.customerId || customer._id?.slice(-6) || '';
//   };

//   const getCustomerPhone = (customer) => {
//     if (!customer) return 'No phone';
//     return customer.phone || customer.whatsappNumber || 'No phone';
//   };

//   // Filter customers
//   const filteredCustomers = useMemo(() => {
//     if (!customers || !Array.isArray(customers) || customers.length === 0) {
//       return [];
//     }
    
//     if (formData.customer && searchTerm === selectedCustomerDisplay) {
//       return [];
//     }
    
//     return customers.filter(customer => {
//       if (!customer) return false;

//       const fullName = getCustomerFullName(customer).toLowerCase();
//       const customerId = getCustomerDisplayId(customer).toLowerCase();
//       const phone = getCustomerPhone(customer).toLowerCase();
//       const firstName = (customer.firstName || '').toLowerCase();
//       const lastName = (customer.lastName || '').toLowerCase();
      
//       const searchLower = searchTerm.toLowerCase();
      
//       return fullName.includes(searchLower) ||
//              firstName.includes(searchLower) ||
//              lastName.includes(searchLower) ||
//              phone.includes(searchLower) ||
//              customerId.includes(searchLower);
//     });
//   }, [customers, searchTerm, formData.customer, selectedCustomerDisplay]);

//   // Calculate total payments
//   const totalPayments = useMemo(() => {
//     return payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
//   }, [payments]);

//   // Calculate price summary
//   const priceSummary = useMemo(() => {
//     const totalMin = garments.reduce((sum, g) => {
//       return sum + Number(g.priceRange?.min || 0);
//     }, 0);
    
//     const totalMax = garments.reduce((sum, g) => {
//       return sum + Number(g.priceRange?.max || 0);
//     }, 0);
    
//     return { totalMin, totalMax };
//   }, [garments]);

//   // Calculate balance
//   const balanceAmount = useMemo(() => {
//     return {
//       min: Number(priceSummary.totalMin) - totalPayments,
//       max: Number(priceSummary.totalMax) - totalPayments,
//     };
//   }, [priceSummary, totalPayments]);

//   // Payment handlers
//   const handleAddPayment = useCallback(() => {
//     setEditingPayment(null);
//     setShowPaymentModal(true);
//   }, []);

//   const handleEditPayment = useCallback((payment) => {
//     setEditingPayment(payment);
//     setShowPaymentModal(true);
//   }, []);

//   const handleDeletePayment = useCallback((index) => {
//     if (window.confirm("Are you sure you want to delete this payment?")) {
//       const newPayments = [...payments];
//       newPayments.splice(index, 1);
//       setPayments(newPayments);
//       showToast.success("Payment removed");
//     }
//   }, [payments]);

//   // Handle Save Payment with proper type mapping
//   const handleSavePayment = useCallback((paymentData) => {
//     logDebug('normal', 'PAYMENT', 'Saving payment', { 
//       isEdit: !!editingPayment,
//       paymentData
//     });
    
//     // Map frontend type to backend enum
//     let backendType = paymentData.type || 'advance';
//     if (backendType === 'partial') {
//       backendType = 'part-payment';
//     } else if (backendType === 'full') {
//       backendType = 'final-settlement';
//     }
    
//     const paymentWithMappedType = {
//       ...paymentData,
//       type: backendType,
//       date: paymentData.paymentDate || paymentData.date || new Date().toISOString().split('T')[0],
//       time: paymentData.paymentTime || paymentData.time || new Date().toLocaleTimeString('en-US', { hour12: false })
//     };
    
//     if (editingPayment) {
//       // Update existing payment
//       const index = payments.findIndex(p => p.tempId === editingPayment.tempId);
//       if (index !== -1) {
//         const newPayments = [...payments];
//         newPayments[index] = { 
//           ...paymentWithMappedType, 
//           tempId: editingPayment.tempId
//         };
//         setPayments(newPayments);
//         showToast.success("Payment updated");
//       }
//     } else {
//       // Add new payment
//       const newPayment = {
//         ...paymentWithMappedType,
//         tempId: Date.now() + Math.random()
//       };
//       setPayments([...payments, newPayment]);
//       showToast.success("Payment added");
//     }
    
//     setShowPaymentModal(false);
//     setEditingPayment(null);
//   }, [payments, editingPayment]);

//   // ✅ UPDATED: Garment handlers with customer validation
//   const handleAddGarment = useCallback(() => {
//     // Validate customer selected first
//     if (!formData.customer) {
//       showToast.error("Please select a customer first before adding garments");
//       return;
//     }
    
//     setEditingGarment(null);
//     setShowGarmentModal(true);
//   }, [formData.customer]);

//   const handleEditGarment = useCallback((garment) => {
//     setEditingGarment(garment);
//     setShowGarmentModal(true);
//   }, []);

//   const handleDeleteGarment = useCallback((index, garment) => {
//     if (window.confirm(`Are you sure you want to remove ${garment.name || 'this garment'}?`)) {
//       const newGarments = [...garments];
//       newGarments.splice(index, 1);
//       setGarments(newGarments);
//       showToast.success("Garment removed");
//     }
//   }, [garments]);

//   // Handle Save Garment
//   const handleSaveGarment = useCallback((garmentData) => {
//     logDebug('normal', 'GARMENT', 'Saving garment', {
//       isEdit: !!editingGarment
//     });
    
//     if (garmentData instanceof FormData) {
//       // Convert FormData to object
//       const garmentObj = {
//         tempId: editingGarment?.tempId || Date.now() + Math.random(),
//         referenceImages: [],
//         customerImages: [],
//         customerClothImages: []
//       };
      
//       for (let [key, value] of garmentData.entries()) {
//         if (value instanceof File) {
//           if (key === 'referenceImages') {
//             garmentObj.referenceImages.push(value);
//           } else if (key === 'customerImages') {
//             garmentObj.customerImages.push(value);
//           } else if (key === 'customerClothImages') {
//             garmentObj.customerClothImages.push(value);
//           }
//         } else {
//           if (key === 'measurements' || key === 'priceRange') {
//             try {
//               garmentObj[key] = JSON.parse(value);
//             } catch (e) {
//               garmentObj[key] = value;
//             }
//           } else {
//             garmentObj[key] = value;
//           }
//         }
//       }
      
//       if (editingGarment) {
//         const index = garments.findIndex(g => g.tempId === editingGarment.tempId);
//         if (index !== -1) {
//           const newGarments = [...garments];
//           newGarments[index] = garmentObj;
//           setGarments(newGarments);
//           showToast.success("Garment updated");
//         }
//       } else {
//         setGarments([...garments, garmentObj]);
//         showToast.success("Garment added");
//       }
//     } else {
//       if (editingGarment) {
//         const index = garments.findIndex(g => g.tempId === editingGarment.tempId);
//         if (index !== -1) {
//           const newGarments = [...garments];
//           newGarments[index] = { ...garmentData, tempId: editingGarment.tempId };
//           setGarments(newGarments);
//           showToast.success("Garment updated");
//         }
//       } else {
//         const newGarment = {
//           ...garmentData,
//           tempId: Date.now() + Math.random()
//         };
//         setGarments([...garments, newGarment]);
//         showToast.success("Garment added");
//       }
//     }
    
//     setShowGarmentModal(false);
//   }, [garments, editingGarment]);

//   const handleCustomerSelect = useCallback((customer) => {
//     const fullName = getCustomerFullName(customer);
//     const displayId = getCustomerDisplayId(customer);
    
//     setFormData(prev => ({
//       ...prev,
//       customer: customer._id
//     }));

//     let displayText = `${fullName} (${displayId})`;
//     setSelectedCustomerDisplay(displayText);
//     setSearchTerm(displayText);
//     setShowCustomerDropdown(false);
//   }, []);

//   const handleSearchChange = useCallback((e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     setShowCustomerDropdown(true);
    
//     if (!value.trim()) {
//       setFormData(prev => ({ ...prev, customer: "" }));
//       setSelectedCustomerDisplay("");
//     }
//   }, []);

//   // Payment Method Icon Component
//   const PaymentMethodIcon = ({ method }) => {
//     switch(method) {
//       case 'cash':
//         return <Banknote size={14} className="text-green-600" />;
//       case 'upi':
//         return <Smartphone size={14} className="text-blue-600" />;
//       case 'bank-transfer':
//         return <Landmark size={14} className="text-purple-600" />;
//       case 'card':
//         return <CreditCard size={14} className="text-orange-600" />;
//       default:
//         return <Wallet size={14} className="text-slate-600" />;
//     }
//   };

//   // COMPLETELY FIXED handleSubmit with proper validation
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     logDebug('normal', 'SUBMIT', 'Form submission started');
//     setServerErrors(null);

//     // Validation
//     if (!formData.customer) {
//       showToast.error("Please select a customer");
//       return;
//     }

//     if (garments.length === 0) {
//       showToast.error("Please add at least one garment");
//       return;
//     }

//     if (!formData.deliveryDate) {
//       showToast.error("Please select delivery date");
//       return;
//     }

//     const finalUserId = userId;
//     if (!finalUserId) {
//       showToast.error("You must be logged in to create an order");
//       return;
//     }

//     // Validate MongoDB IDs
//     const customerIdValid = /^[0-9a-fA-F]{24}$/.test(formData.customer);
//     const userIdValid = /^[0-9a-fA-F]{24}$/.test(finalUserId);

//     if (!customerIdValid) {
//       showToast.error("Invalid customer ID format");
//       return;
//     }

//     if (!userIdValid) {
//       showToast.error("Invalid user ID format. Please log in again.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Map payment types to match model enum EXACTLY
//       const mappedPayments = payments.map(payment => {
//         let modelType = payment.type || 'advance';
        
//         if (modelType === 'partial') {
//           modelType = 'part-payment';
//         } else if (modelType === 'full') {
//           modelType = 'final-settlement';
//         }
        
//         const validTypes = ['advance', 'part-payment', 'final-settlement', 'extra'];
//         if (!validTypes.includes(modelType)) {
//           console.error(`Invalid payment type after mapping: ${modelType}`);
//           modelType = 'advance';
//         }
        
//         return {
//           amount: Number(payment.amount),
//           type: modelType,
//           method: payment.method || 'cash',
//           referenceNumber: payment.referenceNumber || '',
//           date: payment.date || new Date().toISOString().split('T')[0],
//           notes: payment.notes || ''
//         };
//       });

//       console.log("💰 Mapped Payments:", JSON.stringify(mappedPayments, null, 2));

//       const validMethods = ['cash', 'upi', 'bank-transfer', 'card'];
//       const validTypes = ['advance', 'part-payment', 'final-settlement', 'extra'];
      
//       for (const payment of mappedPayments) {
//         if (!validTypes.includes(payment.type)) {
//           throw new Error(`Invalid payment type: ${payment.type}. Must be one of: ${validTypes.join(', ')}`);
//         }
//         if (!validMethods.includes(payment.method)) {
//           throw new Error(`Invalid payment method: ${payment.method}`);
//         }
//         if (isNaN(payment.amount) || payment.amount <= 0) {
//           throw new Error(`Invalid payment amount: ${payment.amount}`);
//         }
//       }

//       const orderData = {
//         customer: formData.customer,
//         deliveryDate: formData.deliveryDate,
//         specialNotes: formData.specialNotes || "",
//         payments: mappedPayments,
//         advancePayment: {
//           amount: mappedPayments.length > 0 ? mappedPayments[0]?.amount || 0 : 0,
//           method: mappedPayments.length > 0 ? mappedPayments[0]?.method || "cash" : "cash",
//           date: new Date().toISOString()
//         },
//         priceSummary: {
//           totalMin: Number(priceSummary.totalMin),
//           totalMax: Number(priceSummary.totalMax)
//         },
//         balanceAmount: Number(balanceAmount.min),
//         createdBy: finalUserId,
//         status: "draft",
//         orderDate: new Date().toISOString(),
//         garments: []
//       };

//       const requiredFields = ['customer', 'deliveryDate', 'createdBy', 'priceSummary', 'balanceAmount', 'status', 'orderDate'];
//       const missingFields = requiredFields.filter(field => !orderData[field]);
      
//       if (missingFields.length > 0) {
//         throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
//       }

//       console.log("🔍 FINAL ORDER DATA BEING SENT:", JSON.stringify(orderData, null, 2));

//       const result = await dispatch(createNewOrder(orderData)).unwrap();
//       logDebug('normal', 'SUBMIT', 'Order created', result);
      
//       const orderId = result.order?._id || result._id;

//       if (!orderId) {
//         throw new Error("Order created but no ID returned");
//       }

//       for (const garment of garments) {
//         const garmentFormData = new FormData();
        
//         garmentFormData.append("name", garment.name);
//         garmentFormData.append("category", garment.category);
//         garmentFormData.append("item", garment.item);
//         garmentFormData.append("measurementTemplate", garment.measurementTemplate || "");
//         garmentFormData.append("measurementSource", garment.measurementSource || "template");
//         garmentFormData.append("measurements", JSON.stringify(garment.measurements || []));
//         garmentFormData.append("additionalInfo", garment.additionalInfo || "");
//         garmentFormData.append("estimatedDelivery", garment.estimatedDelivery || formData.deliveryDate);
//         garmentFormData.append("priority", garment.priority || "normal");
//         garmentFormData.append("priceRange", JSON.stringify({
//           min: Number(garment.priceRange?.min) || 0,
//           max: Number(garment.priceRange?.max) || 0
//         }));
//         garmentFormData.append("orderId", orderId);
//         garmentFormData.append("createdBy", finalUserId);

//         if (garment.referenceImages?.length > 0) {
//           garment.referenceImages.forEach(img => {
//             if (img instanceof File) {
//               garmentFormData.append("referenceImages", img);
//             }
//           });
//         }
        
//         if (garment.customerImages?.length > 0) {
//           garment.customerImages.forEach(img => {
//             if (img instanceof File) {
//               garmentFormData.append("customerImages", img);
//             }
//           });
//         }
        
//         if (garment.customerClothImages?.length > 0) {
//           garment.customerClothImages.forEach(img => {
//             if (img instanceof File) {
//               garmentFormData.append("customerClothImages", img);
//             }
//           });
//         }

//         await dispatch(createGarment({ orderId, garmentData: garmentFormData })).unwrap();
//       }

//       showToast.success("Order created successfully! 🎉");
//       navigate(`${basePath}/orders`);
//     } catch (error) {
//       logError('createOrder', error, { 
//         formData, 
//         garmentsCount: garments.length,
//         paymentsCount: payments.length 
//       });
      
//       if (error.response?.data) {
//         setServerErrors(error.response.data);
//       }
      
//       let errorMessage = "Failed to create order";
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.errors) {
//         errorMessage = `Validation failed: ${error.response.data.errors.join(', ')}`;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       showToast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Enhanced Debug Panel
//   const DebugPanel = () => {
//     if (!DEBUG.SHOW_PANEL || process.env.NODE_ENV !== 'development') return null;
    
//     return (
//       <div className="bg-gray-900 text-green-400 p-4 rounded-2xl font-mono text-sm mb-4 overflow-auto max-h-[600px] border border-green-500/30">
//         <div className="flex justify-between items-center mb-3 sticky top-0 bg-gray-900 pb-2 border-b border-gray-700">
//           <div className="flex items-center gap-2">
//             <Bug size={16} className="text-yellow-400" />
//             <span className="font-bold text-yellow-400">DEBUG PANEL v3.0</span>
//             <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">DEV MODE</span>
//           </div>
//           <div className="flex gap-2">
//             <button 
//               onClick={() => window.location.reload()} 
//               className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
//             >
//               🔄 Refresh
//             </button>
//             <button 
//               onClick={() => console.clear()} 
//               className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
//             >
//               🧹 Clear
//             </button>
//           </div>
//         </div>
        
//         <div className="space-y-2 mb-3">
//           <div className="font-bold text-yellow-400 flex items-center gap-1">
//             <Info size={14} /> STATE OVERVIEW
//           </div>
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             <div className="text-gray-400">Customer:</div>
//             <div className={formData.customer ? 'text-green-400 font-bold' : 'text-red-400'}>
//               {formData.customer ? '✅ Selected' : '❌ Not selected'}
//             </div>
            
//             <div className="text-gray-400">Customer ID:</div>
//             <div className="font-mono text-xs">
//               {formData.customer ? `${formData.customer.substring(0,8)}...` : 'N/A'}
//             </div>
            
//             <div className="text-gray-400">ID Valid:</div>
//             <div className={validateMongoId(formData.customer).valid ? 'text-green-400' : 'text-red-400'}>
//               {validateMongoId(formData.customer).valid ? '✅' : '❌'}
//             </div>
            
//             <div className="text-gray-400">Garments:</div>
//             <div className="text-blue-400 font-bold">{garments.length}</div>
            
//             <div className="text-gray-400">Payments:</div>
//             <div className="text-green-400 font-bold">{payments.length}</div>
            
//             <div className="text-gray-400">Total Paid:</div>
//             <div className="text-green-400 font-bold">₹{totalPayments}</div>
//           </div>
//         </div>

//         <div className="space-y-2 mb-3 border-t border-gray-700 pt-2">
//           <div className="font-bold text-yellow-400 flex items-center gap-1">
//             <User size={14} /> USER INFO
//           </div>
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             <div className="text-gray-400">User ID:</div>
//             <div className="font-mono">{userId ? `${userId.substring(0,8)}...` : '❌'}</div>
            
//             <div className="text-gray-400">ID Valid:</div>
//             <div className={userIdValidation.valid ? 'text-green-400' : 'text-red-400'}>
//               {userIdValidation.valid ? '✅' : '❌'}
//             </div>
            
//             <div className="text-gray-400">Role:</div>
//             <div className="text-purple-400">{userRole || 'N/A'}</div>
            
//             <div className="text-gray-400">Base Path:</div>
//             <div className="text-blue-400">{basePath}</div>
//           </div>
//         </div>

//         {/* ✅ NEW: Garment Form Props Debug */}
//         <div className="space-y-2 mb-3 border-t border-gray-700 pt-2">
//           <div className="font-bold text-yellow-400 flex items-center gap-1">
//             <Package size={14} /> GARMENT FORM PROPS
//           </div>
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             <div className="text-gray-400">Customer ID passed:</div>
//             <div className={formData.customer ? 'text-green-400 font-bold' : 'text-red-400'}>
//               {formData.customer ? '✅ Yes' : '❌ No'}
//             </div>
//             <div className="text-gray-400">Customer ID:</div>
//             <div className="font-mono text-xs">
//               {formData.customer ? `${formData.customer.substring(0,8)}...` : 'N/A'}
//             </div>
//             <div className="text-gray-400">Can add garments:</div>
//             <div className={formData.customer ? 'text-green-400' : 'text-red-400'}>
//               {formData.customer ? '✅ Yes' : '❌ Select customer first'}
//             </div>
//           </div>
//         </div>

//         {payments.length > 0 && (
//           <div className="space-y-2 mb-3 border-t border-gray-700 pt-2">
//             <div className="font-bold text-yellow-400 flex items-center gap-1">
//               <Wallet size={14} /> PAYMENT DETAILS
//             </div>
//             {payments.map((p, idx) => {
//               const validTypes = ['advance', 'part-payment', 'final-settlement', 'extra'];
//               const typeValid = validTypes.includes(p.type);
              
//               return (
//                 <div key={p.tempId} className="bg-gray-800 p-2 rounded text-xs">
//                   <div className="grid grid-cols-2 gap-1">
//                     <span className="text-gray-400">#{idx+1}:</span>
//                     <span className="text-green-400">₹{p.amount}</span>
                    
//                     <span className="text-gray-400">Type:</span>
//                     <div className="flex items-center gap-1">
//                       <span className={`${
//                         p.type === 'advance' ? 'text-blue-400' :
//                         p.type === 'part-payment' ? 'text-orange-400' :
//                         p.type === 'final-settlement' ? 'text-green-400' : 
//                         p.type === 'extra' ? 'text-purple-400' : 'text-red-400'
//                       }`}>
//                         {p.type}
//                       </span>
//                       {!typeValid && (
//                         <span className="text-red-400 font-bold ml-1">❌ INVALID</span>
//                       )}
//                     </div>
                    
//                     <span className="text-gray-400">Method:</span>
//                     <span className="capitalize">{p.method}</span>
                    
//                     <span className="text-gray-400">Will map to:</span>
//                     <span className="text-yellow-400">
//                       {p.type === 'partial' ? 'part-payment' : 
//                        p.type === 'full' ? 'final-settlement' : p.type}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         <div className="space-y-2 border-t border-gray-700 pt-2">
//           <div className="font-bold text-yellow-400 flex items-center gap-1">
//             <IndianRupee size={14} /> PRICE SUMMARY
//           </div>
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             <div className="text-gray-400">Total Min:</div>
//             <div className="text-blue-400">₹{priceSummary.totalMin}</div>
//             <div className="text-gray-400">Total Max:</div>
//             <div className="text-blue-400">₹{priceSummary.totalMax}</div>
//             <div className="text-gray-400">Balance Min:</div>
//             <div className="text-orange-400">₹{balanceAmount.min}</div>
//             <div className="text-gray-400">Balance Max:</div>
//             <div className="text-orange-400">₹{balanceAmount.max}</div>
//           </div>
//         </div>

//         <div className="space-y-2 border-t border-gray-700 pt-2 mt-2">
//           <div className="font-bold text-yellow-400 flex items-center gap-1">
//             <CheckCircle size={14} /> VALIDATION STATUS
//           </div>
//           <div className="space-y-1 text-xs">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-400">Customer Selected:</span>
//               {formData.customer ? 
//                 <span className="text-green-400">✅</span> : 
//                 <span className="text-red-400">❌</span>}
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-gray-400">Garments Added:</span>
//               {garments.length > 0 ? 
//                 <span className="text-green-400">✅ ({garments.length})</span> : 
//                 <span className="text-red-400">❌</span>}
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-gray-400">Delivery Date:</span>
//               {formData.deliveryDate ? 
//                 <span className="text-green-400">✅</span> : 
//                 <span className="text-red-400">❌</span>}
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-gray-400">User Logged In:</span>
//               {userId ? 
//                 <span className="text-green-400">✅</span> : 
//                 <span className="text-red-400">❌</span>}
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-gray-400">Payment Types Valid:</span>
//               {payments.every(p => ['advance', 'part-payment', 'final-settlement', 'extra', 'partial', 'full'].includes(p.type)) ? 
//                 <span className="text-green-400">✅</span> : 
//                 <span className="text-red-400">❌</span>}
//             </div>
//           </div>
//         </div>

//         {serverErrors && (
//           <div className="space-y-2 border-t border-red-700 pt-2 mt-2">
//             <div className="font-bold text-red-400 flex items-center gap-1">
//               <AlertCircle size={14} /> SERVER ERRORS
//             </div>
//             <div className="bg-red-900/50 p-2 rounded text-xs text-red-300">
//               <pre className="whitespace-pre-wrap">
//                 {JSON.stringify(serverErrors, null, 2)}
//               </pre>
//             </div>
//           </div>
//         )}

//         <div className="text-xs text-gray-500 mt-4 text-center border-t border-gray-700 pt-2">
//           <div>Last updated: {new Date().toLocaleTimeString()}</div>
//           <div>Log Level: {DEBUG.LOG_LEVEL}</div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 p-6">
//       <DebugPanel />

//       {/* Add Payment Modal */}
//       {/* <AddPaymentModal
//         isOpen={showPaymentModal}
//         onClose={() => {
//           setShowPaymentModal(false);
//           setEditingPayment(null);
//         }}
//         onSave={handleSavePayment}
//         orderTotal={priceSummary.totalMax}
//         orderId="temp"
//         customerId={formData.customer}
//         initialData={editingPayment}
//         title={editingPayment ? "Edit Payment" : "Add Payment"}
//       /> */}




// <AddPaymentModal
//   isOpen={showPaymentModal}
//   onClose={() => {
//     setShowPaymentModal(false);
//     setEditingPayment(null);
//   }}
//   onSave={handleSavePayment}
//   orderTotalMin={priceSummary.totalMin}  // ✅ Changed
//   orderTotalMax={priceSummary.totalMax}  // ✅ Added
//   orderId="temp"
//   customerId={formData.customer}
//   initialData={editingPayment}
//   title={editingPayment ? "Edit Payment" : "Add Payment"}
// />
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => navigate(`${basePath}/orders`)}
//           className="p-2 hover:bg-slate-100 rounded-xl transition-all"
//         >
//           <ArrowLeft size={20} className="text-slate-600" />
//         </button>
//         <div>
//           <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create New Order</h1>
//           <p className="text-slate-500">Add customer details and garments to create an order</p>
//         </div>
//       </div>

//       {/* Main Form */}
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Customer & Order Details */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Customer Selection */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
//             <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
//               <User size={20} className="text-blue-600" />
//               Customer Details
//             </h2>

//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search customer by name, phone or ID..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 onFocus={() => setShowCustomerDropdown(true)}
//                 onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//               />

//               {showCustomerDropdown && (
//                 <>
//                   {customersLoading && (
//                     <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center">
//                       <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
//                       <p className="text-sm text-slate-500 mt-2">Loading customers...</p>
//                     </div>
//                   )}

//                   {!customersLoading && filteredCustomers.length > 0 && (
//                     <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
//                       {filteredCustomers.map((customer) => {
//                         const fullName = getCustomerFullName(customer);
//                         const displayId = getCustomerDisplayId(customer);
//                         const phone = getCustomerPhone(customer);
                        
//                         return (
//                           <button
//                             key={customer._id}
//                             type="button"
//                             onClick={() => handleCustomerSelect(customer)}
//                             className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0"
//                           >
//                             <p className="font-medium text-slate-800">{fullName}</p>
//                             <p className="text-xs text-slate-400">
//                               <span className="font-mono">{displayId}</span> • {phone}
//                             </p>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}

//                   {!customersLoading && filteredCustomers.length === 0 && searchTerm && (
//                     <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center">
//                       <p className="text-slate-500">No customers found</p>
//                       <button
//                         type="button"
//                         onClick={() => navigate(`${basePath}/add-customer`)}
//                         className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
//                       >
//                         + Create new customer
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}

//               {formData.customer && !showCustomerDropdown && (
//                 <div className="mt-2 text-xs text-green-600 font-medium">
//                   ✓ Customer selected: {selectedCustomerDisplay}
//                 </div>
//               )}
//             </div>

//             {/* Special Notes */}
//             <div className="mt-4">
//               <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                 Special Notes
//               </label>
//               <textarea
//                 value={formData.specialNotes}
//                 onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
//                 rows="3"
//                 placeholder="Any special instructions for this order..."
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
//               />
//             </div>
//           </div>

//           {/* Garments Section */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
//                 <Package size={20} className="text-blue-600" />
//                 Garments
//               </h2>
//               <button
//                 type="button"
//                 onClick={handleAddGarment}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add Garment
//               </button>
//             </div>

//             {garments.length === 0 ? (
//               <div className="text-center py-8 bg-slate-50 rounded-xl">
//                 <Package size={40} className="mx-auto text-slate-300 mb-2" />
//                 <p className="text-slate-500">No garments added yet</p>
//                 <button
//                   type="button"
//                   onClick={handleAddGarment}
//                   className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
//                 >
//                   + Add your first garment
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {garments.map((garment, index) => (
//                   <div
//                     key={garment.tempId}
//                     className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all"
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2">
//                           <h3 className="font-black text-slate-800">{garment.name}</h3>
//                           <span className={`text-xs px-2 py-1 rounded-full ${
//                             garment.priority === 'urgent' ? 'bg-red-100 text-red-600' :
//                             garment.priority === 'high' ? 'bg-orange-100 text-orange-600' :
//                             'bg-blue-100 text-blue-600'
//                           }`}>
//                             {garment.priority}
//                           </span>
//                           {(garment.referenceImages?.length > 0 || 
//                             garment.customerImages?.length > 0 || 
//                             garment.customerClothImages?.length > 0) && (
//                             <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
//                               📸 {garment.referenceImages?.length || 0}/
//                               {garment.customerImages?.length || 0}/
//                               {garment.customerClothImages?.length || 0}
//                             </span>
//                           )}
//                         </div>
                        
//                         <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
//                           <div>
//                             <p className="text-xs text-slate-400">Category/Item</p>
//                             <p className="font-medium">{garment.category} / {garment.item}</p>
//                           </div>
                          
//                           <div>
//                             <p className="text-xs text-slate-400">Garment Delivery</p>
//                             <p className="font-medium text-purple-600">
//                               {garment.estimatedDelivery ? new Date(garment.estimatedDelivery).toLocaleDateString() : 'Not set'}
//                             </p>
//                           </div>
                          
//                           <div>
//                             <p className="text-xs text-slate-400">Price Range</p>
//                             <p className="font-medium">₹{garment.priceRange?.min} - ₹{garment.priceRange?.max}</p>
//                           </div>
//                         </div>
                        
//                         {garment.additionalInfo && (
//                           <p className="text-sm text-slate-500 mt-2 italic">
//                             Note: {garment.additionalInfo}
//                           </p>
//                         )}
//                       </div>
                      
//                       <div className="flex gap-2 ml-4">
//                         <button
//                           type="button"
//                           onClick={() => handleEditGarment(garment)}
//                           className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
//                           title="Edit"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => handleDeleteGarment(index, garment)}
//                           className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
//                           title="Delete"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Delivery Date */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
//             <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
//               <Calendar size={20} className="text-blue-600" />
//               Order Delivery Details
//             </h2>
            
//             <div>
//               <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                 Expected Delivery Date <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Calendar className="absolute left-4 top-3.5 text-slate-400" size={18} />
//                 <input
//                   type="date"
//                   value={formData.deliveryDate}
//                   onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
//                   min={new Date().toISOString().split("T")[0]}
//                   className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                   required
//                 />
//               </div>
//               <p className="text-xs text-slate-400 mt-2">
//                 This is the overall order delivery date. Each garment can have its own estimated delivery date.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Payment Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
//             <h2 className="text-lg font-black text-slate-800 mb-4">Price Summary</h2>
            
//             <div className="space-y-4">
//               <div className="bg-blue-50 p-4 rounded-xl">
//                 <p className="text-xs text-blue-600 font-black uppercase mb-1">Total Amount</p>
//                 <p className="text-2xl font-black text-blue-700">
//                   ₹{priceSummary.totalMin} - ₹{priceSummary.totalMax}
//                 </p>
//               </div>

//               {/* Garment Delivery Range */}
//               {garments.length > 0 && (
//                 <div className="bg-purple-50 p-4 rounded-xl">
//                   <p className="text-xs text-purple-600 font-black uppercase mb-1">
//                     Garment Delivery Range
//                   </p>
//                   <p className="text-sm font-bold text-purple-700">
//                     {new Date(Math.min(...garments.map(g => new Date(g.estimatedDelivery || formData.deliveryDate)))).toLocaleDateString()} - {new Date(Math.max(...garments.map(g => new Date(g.estimatedDelivery || formData.deliveryDate)))).toLocaleDateString()}
//                   </p>
//                 </div>
//               )}

//               {/* Payments Section */}
//               <div className="border-t border-slate-100 pt-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-sm font-black text-slate-700">Payments</h3>
//                   <button
//                     type="button"
//                     onClick={handleAddPayment}
//                     className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1"
//                   >
//                     <Plus size={14} />
//                     Add Payment
//                   </button>
//                 </div>

//                 {payments.length === 0 ? (
//                   <p className="text-sm text-slate-400 italic text-center py-2">
//                     No payments added yet
//                   </p>
//                 ) : (
//                   <div className="space-y-2 max-h-48 overflow-y-auto">
//                     {payments.map((payment, index) => (
//                       <div
//                         key={payment.tempId}
//                         className="bg-slate-50 rounded-lg p-3 border border-slate-200"
//                       >
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2">
//                               <p className="font-bold text-green-600">₹{payment.amount}</p>
//                               <span className={`text-xs px-2 py-0.5 rounded-full ${
//                                 payment.type === 'advance' ? 'bg-blue-100 text-blue-700' :
//                                 payment.type === 'part-payment' ? 'bg-orange-100 text-orange-700' :
//                                 payment.type === 'final-settlement' ? 'bg-green-100 text-green-700' :
//                                 'bg-purple-100 text-purple-700'
//                               }`}>
//                                 {payment.type === 'advance' ? 'Advance' :
//                                  payment.type === 'part-payment' ? 'Part' :
//                                  payment.type === 'final-settlement' ? 'Full' : 'Extra'}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
//                               <PaymentMethodIcon method={payment.method} />
//                               <span className="capitalize">{payment.method}</span>
//                             </div>
//                             {payment.referenceNumber && (
//                               <p className="text-xs text-purple-600 font-mono mt-0.5">
//                                 Ref: {payment.referenceNumber}
//                               </p>
//                             )}
//                             <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
//                               <span>{new Date(payment.date).toLocaleDateString()}</span>
//                               <span>•</span>
//                               <span>{payment.time}</span>
//                             </div>
//                             {payment.notes && (
//                               <p className="text-xs text-slate-400 mt-1 italic">
//                                 {payment.notes}
//                               </p>
//                             )}
//                           </div>
//                           <div className="flex gap-1 ml-2">
//                             <button
//                               type="button"
//                               onClick={() => handleEditPayment(payment)}
//                               className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
//                               title="Edit"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleDeletePayment(index)}
//                               className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
//                               title="Delete"
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {payments.length > 0 && (
//                   <div className="mt-3 pt-2 border-t border-slate-200">
//                     <div className="flex justify-between text-sm">
//                       <span className="font-medium text-slate-600">Total Paid:</span>
//                       <span className="font-bold text-green-600">₹{totalPayments}</span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="bg-orange-50 p-4 rounded-xl">
//                 <p className="text-xs text-orange-600 font-black uppercase mb-1">Balance Amount</p>
//                 <p className="text-xl font-black text-orange-700">
//                   ₹{balanceAmount.min} - ₹{balanceAmount.max}
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting || !userId}
//                 className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-black uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6 ${
//                   isSubmitting || !userId ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Creating...
//                   </>
//                 ) : !userId ? (
//                   'Please log in to create order'
//                 ) : (
//                   <>
//                     <Save size={18} />
//                     Create Order
//                   </>
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => navigate(`${basePath}/orders`)}
//                 className="w-full px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-black uppercase tracking-wider transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>

//       {/* ✅ UPDATED: Garment Form Modal with customerId prop */}
//       {showGarmentModal && (
//         <GarmentForm
//           onClose={() => setShowGarmentModal(false)}
//           onSave={handleSaveGarment}
//           editingGarment={editingGarment}
//           customerId={formData.customer} // ✅ Pass selected customer ID
//         />
//       )}
//     </div>
//   );
// }





import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  User,
  Calendar,
  CreditCard,
  IndianRupee,
  Package,
  Clock,
  Wallet,
  Banknote,
  Smartphone,
  Landmark,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Bug,
} from "lucide-react";
import { createNewOrder } from "../../../features/order/orderSlice";
import { createGarment } from "../../../features/garment/garmentSlice";
import { fetchAllCustomers } from "../../../features/customer/customerSlice";
import GarmentForm from "../garment/GarmentForm";
import AddPaymentModal from "../../../components/AddPaymentModal";
import showToast from "../../../utils/toast";

export default function NewOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Enhanced Debug configuration
  const DEBUG = {
    ENABLED: true,
    LOG_LEVEL: 'verbose',
    SHOW_PANEL: true,
    LOG_REDUX: true,
    LOG_API: true,
    LOG_VALIDATION: true,
    LOG_FORM_DATA: true
  };
  
  // Debug logger
  const logDebug = (level, category, message, data = null) => {
    if (!DEBUG.ENABLED) return;
    
    const levels = { minimal: 1, normal: 2, verbose: 3 };
    const currentLevel = levels[DEBUG.LOG_LEVEL] || 2;
    const msgLevel = levels[level] || 2;
    
    if (msgLevel > currentLevel) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(
      `%c[${timestamp}][${category}] ${message}`,
      `color: #00ff00; font-weight: bold;`,
      data || ''
    );
  };

  // Error logger
  const logError = (context, error, additionalData = {}) => {
    console.group(`❌ ERROR [${context}] - ${new Date().toISOString()}`);
    console.error('Error object:', error);
    console.error('Error message:', error?.message);
    
    if (error?.response) {
      console.log('🔍 Response Data:', error.response.data);
      console.log('🔍 Status:', error.response.status);
      console.log('🔍 Status Text:', error.response.statusText);
      console.log('🔍 Headers:', error.response.headers);
      
      if (error.response.data?.errors) {
        console.log('📋 Validation Errors:', error.response.data.errors);
      }
      if (error.response.data?.message) {
        console.log('📋 Server Message:', error.response.data.message);
      }
    }
    
    if (error?.request) {
      console.log('📡 Request:', error.request);
    }
    
    if (Object.keys(additionalData).length > 0) {
      console.log('📦 Additional Data:', additionalData);
    }
    
    console.groupEnd();
  };

  // Validation helper
  const validateMongoId = (id) => {
    if (!id) return { valid: false, reason: 'ID is empty' };
    const isValid = /^[0-9a-fA-F]{24}$/.test(id);
    return { 
      valid: isValid, 
      reason: isValid ? 'Valid' : 'Invalid format - must be 24 hex characters' 
    };
  };

  // Get passed customer from Customer Page (if any)
  const passedCustomer = location.state?.customer;
  
  logDebug('normal', 'INIT', 'Component initialized', {
    hasPassedCustomer: !!passedCustomer,
    passedCustomerId: passedCustomer?._id
  });

  useEffect(() => {
    logDebug('normal', 'LIFECYCLE', 'Component mounted');
    return () => logDebug('normal', 'LIFECYCLE', 'Component unmounted');
  }, []);

  // Fixed Redux selectors
  const { customers, loading: customersLoading } = useSelector((state) => {
    const customerData = state.customers?.customers || state.customer?.customers || [];
    const customersArray = Array.isArray(customerData) ? customerData : [];
    
    return {
      customers: customersArray,
      loading: state.customers?.loading || state.customer?.loading || false
    };
  });

  // ✅ Add categories selector to get category names
  const { categories } = useSelector((state) => {
    const categoriesData = state.categories?.categories || [];
    return {
      categories: Array.isArray(categoriesData) ? categoriesData : []
    };
  });

  const { user } = useSelector((state) => {
    return { user: state.auth?.user };
  });
  
  const [formData, setFormData] = useState({
    customer: "",
    deliveryDate: "",
    specialNotes: "",
    advancePayment: {
      amount: 0,
      method: "cash",
    },
  });

  // State for multiple payments
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [garments, setGarments] = useState([]);
  const [showGarmentModal, setShowGarmentModal] = useState(false);
  const [editingGarment, setEditingGarment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomerDisplay, setSelectedCustomerDisplay] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  // Get user ID
  const userId = user?.id || user?._id;
  const userRole = user?.role;

  // Validate user ID
  const userIdValidation = validateMongoId(userId);

  logDebug('normal', 'AUTH', 'User authentication details', {
    userId,
    userIdValid: userIdValidation.valid,
    userRole
  });

  // Get base path based on user role
  const basePath = user?.role === "ADMIN" ? "/admin" : 
                   user?.role === "STORE_KEEPER" ? "/storekeeper" : 
                   "/cuttingmaster";

  // Load customers on mount
  useEffect(() => {
    logDebug('normal', 'API', 'Fetching customers');
    dispatch(fetchAllCustomers())
      .unwrap()
      .then((result) => {
        logDebug('normal', 'API', 'Customers fetched', { count: result?.length });
      })
      .catch((error) => {
        logError('fetchCustomers', error);
        showToast.error("Failed to load customers");
      });
  }, [dispatch]);

  // AUTO-FILL LOGIC: When passedCustomer is available, auto-select them
  useEffect(() => {
    if (passedCustomer) {
      logDebug('normal', 'AUTO-FILL', 'Auto-filling customer', {
        passedCustomerId: passedCustomer._id
      });
      
      const fullCustomer = customers?.find(c => c._id === passedCustomer._id) || passedCustomer;
      
      setFormData(prev => ({
        ...prev,
        customer: fullCustomer._id
      }));

      const fullName = getCustomerFullName(fullCustomer);
      const displayId = getCustomerDisplayId(fullCustomer);
      let displayText = `${fullName} (${displayId})`;
      
      setSelectedCustomerDisplay(displayText);
      setSearchTerm(displayText);
      setShowCustomerDropdown(false);
    }
  }, [passedCustomer, customers]);

  // Helper functions for customer display
  const getCustomerFullName = (customer) => {
    if (!customer) return 'Unknown Customer';
    
    if (customer.firstName || customer.lastName) {
      const firstName = customer.firstName || '';
      const lastName = customer.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
    }
    
    if (customer.name) return customer.name;
    
    return 'Unknown Customer';
  };

  const getCustomerDisplayId = (customer) => {
    if (!customer) return '';
    return customer.customerId || customer._id?.slice(-6) || '';
  };

  const getCustomerPhone = (customer) => {
    if (!customer) return 'No phone';
    return customer.phone || customer.whatsappNumber || 'No phone';
  };

  // Filter customers
  const filteredCustomers = useMemo(() => {
    if (!customers || !Array.isArray(customers) || customers.length === 0) {
      return [];
    }
    
    if (formData.customer && searchTerm === selectedCustomerDisplay) {
      return [];
    }
    
    return customers.filter(customer => {
      if (!customer) return false;

      const fullName = getCustomerFullName(customer).toLowerCase();
      const customerId = getCustomerDisplayId(customer).toLowerCase();
      const phone = getCustomerPhone(customer).toLowerCase();
      const firstName = (customer.firstName || '').toLowerCase();
      const lastName = (customer.lastName || '').toLowerCase();
      
      const searchLower = searchTerm.toLowerCase();
      
      return fullName.includes(searchLower) ||
             firstName.includes(searchLower) ||
             lastName.includes(searchLower) ||
             phone.includes(searchLower) ||
             customerId.includes(searchLower);
    });
  }, [customers, searchTerm, formData.customer, selectedCustomerDisplay]);

  // Calculate total payments
  const totalPayments = useMemo(() => {
    return payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }, [payments]);

  // Calculate price summary
  const priceSummary = useMemo(() => {
    const totalMin = garments.reduce((sum, g) => {
      return sum + Number(g.priceRange?.min || 0);
    }, 0);
    
    const totalMax = garments.reduce((sum, g) => {
      return sum + Number(g.priceRange?.max || 0);
    }, 0);
    
    return { totalMin, totalMax };
  }, [garments]);

  // Calculate balance
  const balanceAmount = useMemo(() => {
    return {
      min: Number(priceSummary.totalMin) - totalPayments,
      max: Number(priceSummary.totalMax) - totalPayments,
    };
  }, [priceSummary, totalPayments]);

  // Payment handlers
  const handleAddPayment = useCallback(() => {
    setEditingPayment(null);
    setShowPaymentModal(true);
  }, []);

  const handleEditPayment = useCallback((payment) => {
    setEditingPayment(payment);
    setShowPaymentModal(true);
  }, []);

  const handleDeletePayment = useCallback((index) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      const newPayments = [...payments];
      newPayments.splice(index, 1);
      setPayments(newPayments);
      showToast.success("Payment removed");
    }
  }, [payments]);

  // Handle Save Payment with proper type mapping
  const handleSavePayment = useCallback((paymentData) => {
    logDebug('normal', 'PAYMENT', 'Saving payment', { 
      isEdit: !!editingPayment,
      paymentData
    });
    
    // Map frontend type to backend enum
    let backendType = paymentData.type || 'advance';
    if (backendType === 'partial') {
      backendType = 'part-payment';
    } else if (backendType === 'full') {
      backendType = 'final-settlement';
    }
    
    const paymentWithMappedType = {
      ...paymentData,
      type: backendType,
      date: paymentData.paymentDate || paymentData.date || new Date().toISOString().split('T')[0],
      time: paymentData.paymentTime || paymentData.time || new Date().toLocaleTimeString('en-US', { hour12: false })
    };
    
    if (editingPayment) {
      // Update existing payment
      const index = payments.findIndex(p => p.tempId === editingPayment.tempId);
      if (index !== -1) {
        const newPayments = [...payments];
        newPayments[index] = { 
          ...paymentWithMappedType, 
          tempId: editingPayment.tempId
        };
        setPayments(newPayments);
        showToast.success("Payment updated");
      }
    } else {
      // Add new payment
      const newPayment = {
        ...paymentWithMappedType,
        tempId: Date.now() + Math.random()
      };
      setPayments([...payments, newPayment]);
      showToast.success("Payment added");
    }
    
    setShowPaymentModal(false);
    setEditingPayment(null);
  }, [payments, editingPayment]);

  // ✅ UPDATED: Garment handlers with customer validation
  const handleAddGarment = useCallback(() => {
    // Validate customer selected first
    if (!formData.customer) {
      showToast.error("Please select a customer first before adding garments");
      return;
    }
    
    setEditingGarment(null);
    setShowGarmentModal(true);
  }, [formData.customer]);

  const handleEditGarment = useCallback((garment) => {
    setEditingGarment(garment);
    setShowGarmentModal(true);
  }, []);

  const handleDeleteGarment = useCallback((index, garment) => {
    if (window.confirm(`Are you sure you want to remove ${garment.name || 'this garment'}?`)) {
      const newGarments = [...garments];
      newGarments.splice(index, 1);
      setGarments(newGarments);
      showToast.success("Garment removed");
    }
  }, [garments]);

  // Handle Save Garment
  const handleSaveGarment = useCallback((garmentData) => {
    logDebug('normal', 'GARMENT', 'Saving garment', {
      isEdit: !!editingGarment
    });
    
    if (garmentData instanceof FormData) {
      // Convert FormData to object
      const garmentObj = {
        tempId: editingGarment?.tempId || Date.now() + Math.random(),
        referenceImages: [],
        customerImages: [],
        customerClothImages: []
      };
      
      for (let [key, value] of garmentData.entries()) {
        if (value instanceof File) {
          if (key === 'referenceImages') {
            garmentObj.referenceImages.push(value);
          } else if (key === 'customerImages') {
            garmentObj.customerImages.push(value);
          } else if (key === 'customerClothImages') {
            garmentObj.customerClothImages.push(value);
          }
        } else {
          if (key === 'measurements' || key === 'priceRange') {
            try {
              garmentObj[key] = JSON.parse(value);
            } catch (e) {
              garmentObj[key] = value;
            }
          } else {
            garmentObj[key] = value;
          }
        }
      }
      
      if (editingGarment) {
        const index = garments.findIndex(g => g.tempId === editingGarment.tempId);
        if (index !== -1) {
          const newGarments = [...garments];
          newGarments[index] = garmentObj;
          setGarments(newGarments);
          showToast.success("Garment updated");
        }
      } else {
        setGarments([...garments, garmentObj]);
        showToast.success("Garment added");
      }
    } else {
      if (editingGarment) {
        const index = garments.findIndex(g => g.tempId === editingGarment.tempId);
        if (index !== -1) {
          const newGarments = [...garments];
          newGarments[index] = { ...garmentData, tempId: editingGarment.tempId };
          setGarments(newGarments);
          showToast.success("Garment updated");
        }
      } else {
        const newGarment = {
          ...garmentData,
          tempId: Date.now() + Math.random()
        };
        setGarments([...garments, newGarment]);
        showToast.success("Garment added");
      }
    }
    
    setShowGarmentModal(false);
  }, [garments, editingGarment]);

  const handleCustomerSelect = useCallback((customer) => {
    const fullName = getCustomerFullName(customer);
    const displayId = getCustomerDisplayId(customer);
    
    setFormData(prev => ({
      ...prev,
      customer: customer._id
    }));

    let displayText = `${fullName} (${displayId})`;
    setSelectedCustomerDisplay(displayText);
    setSearchTerm(displayText);
    setShowCustomerDropdown(false);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowCustomerDropdown(true);
    
    if (!value.trim()) {
      setFormData(prev => ({ ...prev, customer: "" }));
      setSelectedCustomerDisplay("");
    }
  }, []);

  // ✅ Helper function to get category name from ID
  const getCategoryName = useCallback((categoryId) => {
    if (!categoryId) return 'Unknown';
    const category = categories?.find(c => c._id === categoryId);
    return category?.name || category?.categoryName || categoryId;
  }, [categories]);

  // ✅ Helper function to get item name from garment object
  const getItemName = useCallback((garment) => {
    // First check if itemName is directly available (from GarmentForm)
    if (garment.itemName) return garment.itemName;
    
    // If not, try to find in categories
    if (garment.item && categories) {
      for (const category of categories) {
        if (category.items && Array.isArray(category.items)) {
          const foundItem = category.items.find(item => 
            item._id === garment.item || item._id?.toString() === garment.item?.toString()
          );
          if (foundItem) return foundItem.name || foundItem.itemName;
        }
      }
    }
    
    return garment.item || 'Unknown';
  }, [categories]);

  // Payment Method Icon Component
  const PaymentMethodIcon = ({ method }) => {
    switch(method) {
      case 'cash':
        return <Banknote size={14} className="text-green-600" />;
      case 'upi':
        return <Smartphone size={14} className="text-blue-600" />;
      case 'bank-transfer':
        return <Landmark size={14} className="text-purple-600" />;
      case 'card':
        return <CreditCard size={14} className="text-orange-600" />;
      default:
        return <Wallet size={14} className="text-slate-600" />;
    }
  };

  // COMPLETELY FIXED handleSubmit with proper validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    logDebug('normal', 'SUBMIT', 'Form submission started');
    setServerErrors(null);

    // Validation
    if (!formData.customer) {
      showToast.error("Please select a customer");
      return;
    }

    if (garments.length === 0) {
      showToast.error("Please add at least one garment");
      return;
    }

    if (!formData.deliveryDate) {
      showToast.error("Please select delivery date");
      return;
    }

    const finalUserId = userId;
    if (!finalUserId) {
      showToast.error("You must be logged in to create an order");
      return;
    }

    // Validate MongoDB IDs
    const customerIdValid = /^[0-9a-fA-F]{24}$/.test(formData.customer);
    const userIdValid = /^[0-9a-fA-F]{24}$/.test(finalUserId);

    if (!customerIdValid) {
      showToast.error("Invalid customer ID format");
      return;
    }

    if (!userIdValid) {
      showToast.error("Invalid user ID format. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Map payment types to match model enum EXACTLY
      const mappedPayments = payments.map(payment => {
        let modelType = payment.type || 'advance';
        
        if (modelType === 'partial') {
          modelType = 'part-payment';
        } else if (modelType === 'full') {
          modelType = 'final-settlement';
        }
        
        const validTypes = ['advance', 'part-payment', 'final-settlement', 'extra'];
        if (!validTypes.includes(modelType)) {
          console.error(`Invalid payment type after mapping: ${modelType}`);
          modelType = 'advance';
        }
        
        return {
          amount: Number(payment.amount),
          type: modelType,
          method: payment.method || 'cash',
          referenceNumber: payment.referenceNumber || '',
          date: payment.date || new Date().toISOString().split('T')[0],
          notes: payment.notes || ''
        };
      });

      console.log("💰 Mapped Payments:", JSON.stringify(mappedPayments, null, 2));

      const validMethods = ['cash', 'upi', 'bank-transfer', 'card'];
      const validTypes = ['advance', 'part-payment', 'final-settlement', 'extra'];
      
      for (const payment of mappedPayments) {
        if (!validTypes.includes(payment.type)) {
          throw new Error(`Invalid payment type: ${payment.type}. Must be one of: ${validTypes.join(', ')}`);
        }
        if (!validMethods.includes(payment.method)) {
          throw new Error(`Invalid payment method: ${payment.method}`);
        }
        if (isNaN(payment.amount) || payment.amount <= 0) {
          throw new Error(`Invalid payment amount: ${payment.amount}`);
        }
      }

      const orderData = {
        customer: formData.customer,
        deliveryDate: formData.deliveryDate,
        specialNotes: formData.specialNotes || "",
        payments: mappedPayments,
        advancePayment: {
          amount: mappedPayments.length > 0 ? mappedPayments[0]?.amount || 0 : 0,
          method: mappedPayments.length > 0 ? mappedPayments[0]?.method || "cash" : "cash",
          date: new Date().toISOString()
        },
        priceSummary: {
          totalMin: Number(priceSummary.totalMin),
          totalMax: Number(priceSummary.totalMax)
        },
        balanceAmount: Number(balanceAmount.min),
        createdBy: finalUserId,
        status: "draft",
        orderDate: new Date().toISOString(),
        garments: []
      };

      const requiredFields = ['customer', 'deliveryDate', 'createdBy', 'priceSummary', 'balanceAmount', 'status', 'orderDate'];
      const missingFields = requiredFields.filter(field => !orderData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log("🔍 FINAL ORDER DATA BEING SENT:", JSON.stringify(orderData, null, 2));

      const result = await dispatch(createNewOrder(orderData)).unwrap();
      logDebug('normal', 'SUBMIT', 'Order created', result);
      
      const orderId = result.order?._id || result._id;

      if (!orderId) {
        throw new Error("Order created but no ID returned");
      }

      for (const garment of garments) {
        const garmentFormData = new FormData();
        
        garmentFormData.append("name", garment.name);
        garmentFormData.append("category", garment.category);
        garmentFormData.append("item", garment.item);
        
        // ✅ Add categoryName and itemName if available
        if (garment.categoryName) {
          garmentFormData.append("categoryName", garment.categoryName);
        }
        
        if (garment.itemName) {
          garmentFormData.append("itemName", garment.itemName);
        }
        
        garmentFormData.append("measurementTemplate", garment.measurementTemplate || "");
        garmentFormData.append("measurementSource", garment.measurementSource || "template");
        garmentFormData.append("measurements", JSON.stringify(garment.measurements || []));
        garmentFormData.append("additionalInfo", garment.additionalInfo || "");
        garmentFormData.append("estimatedDelivery", garment.estimatedDelivery || formData.deliveryDate);
        garmentFormData.append("priority", garment.priority || "normal");
        garmentFormData.append("priceRange", JSON.stringify({
          min: Number(garment.priceRange?.min) || 0,
          max: Number(garment.priceRange?.max) || 0
        }));
        garmentFormData.append("orderId", orderId);
        garmentFormData.append("createdBy", finalUserId);

        if (garment.referenceImages?.length > 0) {
          garment.referenceImages.forEach(img => {
            if (img instanceof File) {
              garmentFormData.append("referenceImages", img);
            }
          });
        }
        
        if (garment.customerImages?.length > 0) {
          garment.customerImages.forEach(img => {
            if (img instanceof File) {
              garmentFormData.append("customerImages", img);
            }
          });
        }
        
        if (garment.customerClothImages?.length > 0) {
          garment.customerClothImages.forEach(img => {
            if (img instanceof File) {
              garmentFormData.append("customerClothImages", img);
            }
          });
        }

        await dispatch(createGarment({ orderId, garmentData: garmentFormData })).unwrap();
      }

      showToast.success("Order created successfully! 🎉");
      navigate(`${basePath}/orders`);
    } catch (error) {
      logError('createOrder', error, { 
        formData, 
        garmentsCount: garments.length,
        paymentsCount: payments.length 
      });
      
      if (error.response?.data) {
        setServerErrors(error.response.data);
      }
      
      let errorMessage = "Failed to create order";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = `Validation failed: ${error.response.data.errors.join(', ')}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced Debug Panel
  const DebugPanel = () => {
    if (!DEBUG.SHOW_PANEL || process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="bg-gray-900 text-green-400 p-4 rounded-2xl font-mono text-sm mb-4 overflow-auto max-h-[600px] border border-green-500/30">
        <div className="flex justify-between items-center mb-3 sticky top-0 bg-gray-900 pb-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Bug size={16} className="text-yellow-400" />
            <span className="font-bold text-yellow-400">DEBUG PANEL v3.0</span>
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">DEV MODE</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
            >
              🔄 Refresh
            </button>
            <button 
              onClick={() => console.clear()} 
              className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
            >
              🧹 Clear
            </button>
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="font-bold text-yellow-400 flex items-center gap-1">
            <Info size={14} /> STATE OVERVIEW
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-400">Customer:</div>
            <div className={formData.customer ? 'text-green-400 font-bold' : 'text-red-400'}>
              {formData.customer ? '✅ Selected' : '❌ Not selected'}
            </div>
            
            <div className="text-gray-400">Customer ID:</div>
            <div className="font-mono text-xs">
              {formData.customer ? `${formData.customer.substring(0,8)}...` : 'N/A'}
            </div>
            
            <div className="text-gray-400">ID Valid:</div>
            <div className={validateMongoId(formData.customer).valid ? 'text-green-400' : 'text-red-400'}>
              {validateMongoId(formData.customer).valid ? '✅' : '❌'}
            </div>
            
            <div className="text-gray-400">Garments:</div>
            <div className="text-blue-400 font-bold">{garments.length}</div>
            
            <div className="text-gray-400">Payments:</div>
            <div className="text-green-400 font-bold">{payments.length}</div>
            
            <div className="text-gray-400">Total Paid:</div>
            <div className="text-green-400 font-bold">₹{totalPayments}</div>
          </div>
        </div>

        <div className="space-y-2 mb-3 border-t border-gray-700 pt-2">
          <div className="font-bold text-yellow-400 flex items-center gap-1">
            <User size={14} /> USER INFO
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-400">User ID:</div>
            <div className="font-mono">{userId ? `${userId.substring(0,8)}...` : '❌'}</div>
            
            <div className="text-gray-400">ID Valid:</div>
            <div className={userIdValidation.valid ? 'text-green-400' : 'text-red-400'}>
              {userIdValidation.valid ? '✅' : '❌'}
            </div>
            
            <div className="text-gray-400">Role:</div>
            <div className="text-purple-400">{userRole || 'N/A'}</div>
            
            <div className="text-gray-400">Base Path:</div>
            <div className="text-blue-400">{basePath}</div>
          </div>
        </div>

        {/* ✅ NEW: Garment Form Props Debug */}
        <div className="space-y-2 mb-3 border-t border-gray-700 pt-2">
          <div className="font-bold text-yellow-400 flex items-center gap-1">
            <Package size={14} /> GARMENT FORM PROPS
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-400">Customer ID passed:</div>
            <div className={formData.customer ? 'text-green-400 font-bold' : 'text-red-400'}>
              {formData.customer ? '✅ Yes' : '❌ No'}
            </div>
            <div className="text-gray-400">Customer ID:</div>
            <div className="font-mono text-xs">
              {formData.customer ? `${formData.customer.substring(0,8)}...` : 'N/A'}
            </div>
            <div className="text-gray-400">Can add garments:</div>
            <div className={formData.customer ? 'text-green-400' : 'text-red-400'}>
              {formData.customer ? '✅ Yes' : '❌ Select customer first'}
            </div>
          </div>
        </div>

        {payments.length > 0 && (
          <div className="space-y-2 mb-3 border-t border-gray-700 pt-2">
            <div className="font-bold text-yellow-400 flex items-center gap-1">
              <Wallet size={14} /> PAYMENT DETAILS
            </div>
            {payments.map((p, idx) => {
              const validTypes = ['advance', 'part-payment', 'final-settlement', 'extra'];
              const typeValid = validTypes.includes(p.type);
              
              return (
                <div key={p.tempId} className="bg-gray-800 p-2 rounded text-xs">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-400">#{idx+1}:</span>
                    <span className="text-green-400">₹{p.amount}</span>
                    
                    <span className="text-gray-400">Type:</span>
                    <div className="flex items-center gap-1">
                      <span className={`${
                        p.type === 'advance' ? 'text-blue-400' :
                        p.type === 'part-payment' ? 'text-orange-400' :
                        p.type === 'final-settlement' ? 'text-green-400' : 
                        p.type === 'extra' ? 'text-purple-400' : 'text-red-400'
                      }`}>
                        {p.type}
                      </span>
                      {!typeValid && (
                        <span className="text-red-400 font-bold ml-1">❌ INVALID</span>
                      )}
                    </div>
                    
                    <span className="text-gray-400">Method:</span>
                    <span className="capitalize">{p.method}</span>
                    
                    <span className="text-gray-400">Will map to:</span>
                    <span className="text-yellow-400">
                      {p.type === 'partial' ? 'part-payment' : 
                       p.type === 'full' ? 'final-settlement' : p.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-2 border-t border-gray-700 pt-2">
          <div className="font-bold text-yellow-400 flex items-center gap-1">
            <IndianRupee size={14} /> PRICE SUMMARY
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-400">Total Min:</div>
            <div className="text-blue-400">₹{priceSummary.totalMin}</div>
            <div className="text-gray-400">Total Max:</div>
            <div className="text-blue-400">₹{priceSummary.totalMax}</div>
            <div className="text-gray-400">Balance Min:</div>
            <div className="text-orange-400">₹{balanceAmount.min}</div>
            <div className="text-gray-400">Balance Max:</div>
            <div className="text-orange-400">₹{balanceAmount.max}</div>
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-700 pt-2 mt-2">
          <div className="font-bold text-yellow-400 flex items-center gap-1">
            <CheckCircle size={14} /> VALIDATION STATUS
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Customer Selected:</span>
              {formData.customer ? 
                <span className="text-green-400">✅</span> : 
                <span className="text-red-400">❌</span>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Garments Added:</span>
              {garments.length > 0 ? 
                <span className="text-green-400">✅ ({garments.length})</span> : 
                <span className="text-red-400">❌</span>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Delivery Date:</span>
              {formData.deliveryDate ? 
                <span className="text-green-400">✅</span> : 
                <span className="text-red-400">❌</span>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">User Logged In:</span>
              {userId ? 
                <span className="text-green-400">✅</span> : 
                <span className="text-red-400">❌</span>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Payment Types Valid:</span>
              {payments.every(p => ['advance', 'part-payment', 'final-settlement', 'extra', 'partial', 'full'].includes(p.type)) ? 
                <span className="text-green-400">✅</span> : 
                <span className="text-red-400">❌</span>}
            </div>
          </div>
        </div>

        {serverErrors && (
          <div className="space-y-2 border-t border-red-700 pt-2 mt-2">
            <div className="font-bold text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> SERVER ERRORS
            </div>
            <div className="bg-red-900/50 p-2 rounded text-xs text-red-300">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(serverErrors, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4 text-center border-t border-gray-700 pt-2">
          <div>Last updated: {new Date().toLocaleTimeString()}</div>
          <div>Log Level: {DEBUG.LOG_LEVEL}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 p-6">
      <DebugPanel />

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setEditingPayment(null);
        }}
        onSave={handleSavePayment}
        orderTotalMin={priceSummary.totalMin}
        orderTotalMax={priceSummary.totalMax}
        orderId="temp"
        customerId={formData.customer}
        initialData={editingPayment}
        title={editingPayment ? "Edit Payment" : "Add Payment"}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`${basePath}/orders`)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create New Order</h1>
          <p className="text-slate-500">Add customer details and garments to create an order</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer & Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Customer Details
            </h2>

            <div className="relative">
              <input
                type="text"
                placeholder="Search customer by name, phone or ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowCustomerDropdown(true)}
                onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />

              {showCustomerDropdown && (
                <>
                  {customersLoading && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                      <p className="text-sm text-slate-500 mt-2">Loading customers...</p>
                    </div>
                  )}

                  {!customersLoading && filteredCustomers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredCustomers.map((customer) => {
                        const fullName = getCustomerFullName(customer);
                        const displayId = getCustomerDisplayId(customer);
                        const phone = getCustomerPhone(customer);
                        
                        return (
                          <button
                            key={customer._id}
                            type="button"
                            onClick={() => handleCustomerSelect(customer)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0"
                          >
                            <p className="font-medium text-slate-800">{fullName}</p>
                            <p className="text-xs text-slate-400">
                              <span className="font-mono">{displayId}</span> • {phone}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!customersLoading && filteredCustomers.length === 0 && searchTerm && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center">
                      <p className="text-slate-500">No customers found</p>
                      <button
                        type="button"
                        onClick={() => navigate(`${basePath}/add-customer`)}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Create new customer
                      </button>
                    </div>
                  )}
                </>
              )}

              {formData.customer && !showCustomerDropdown && (
                <div className="mt-2 text-xs text-green-600 font-medium">
                  ✓ Customer selected: {selectedCustomerDisplay}
                </div>
              )}
            </div>

            {/* Special Notes */}
            <div className="mt-4">
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                Special Notes
              </label>
              <textarea
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                rows="3"
                placeholder="Any special instructions for this order..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Garments Section - UPDATED with Category/Item Names */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Package size={20} className="text-blue-600" />
                Garments
              </h2>
              <button
                type="button"
                onClick={handleAddGarment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <Plus size={16} />
                Add Garment
              </button>
            </div>

            {garments.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl">
                <Package size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500">No garments added yet</p>
                <button
                  type="button"
                  onClick={handleAddGarment}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add your first garment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {garments.map((garment, index) => {
                  // Get category name
                  const categoryName = garment.categoryName || getCategoryName(garment.category);
                  
                  // Get item name
                  const itemName = garment.itemName || getItemName(garment);
                  
                  return (
                    <div
                      key={garment.tempId}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-800">{garment.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              garment.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                              garment.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {garment.priority}
                            </span>
                            {(garment.referenceImages?.length > 0 || 
                              garment.customerImages?.length > 0 || 
                              garment.customerClothImages?.length > 0) && (
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                                📸 {garment.referenceImages?.length || 0}/
                                {garment.customerImages?.length || 0}/
                                {garment.customerClothImages?.length || 0}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                            {/* ✅ UPDATED: Show Category/Item Names instead of IDs */}
                            <div>
                              <p className="text-xs text-slate-400">Category/Item</p>
                              <p className="font-medium text-blue-700">
                                {categoryName} / {itemName}
                              </p>
                              {/* Optional: Show IDs in small text for debugging */}
                              {process.env.NODE_ENV === 'development' && (
                                <p className="text-xs text-slate-300 font-mono mt-0.5">
                                  {garment.category?.substring(0,6)}.../{garment.item?.substring(0,6)}...
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <p className="text-xs text-slate-400">Garment Delivery</p>
                              <p className="font-medium text-purple-600">
                                {garment.estimatedDelivery ? new Date(garment.estimatedDelivery).toLocaleDateString() : 'Not set'}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-slate-400">Price Range</p>
                              <p className="font-medium">₹{garment.priceRange?.min} - ₹{garment.priceRange?.max}</p>
                            </div>
                          </div>
                          
                          {garment.additionalInfo && (
                            <p className="text-sm text-slate-500 mt-2 italic">
                              Note: {garment.additionalInfo}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => handleEditGarment(garment)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGarment(index, garment)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery Date */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Order Delivery Details
            </h2>
            
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                Expected Delivery Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                This is the overall order delivery date. Each garment can have its own estimated delivery date.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <h2 className="text-lg font-black text-slate-800 mb-4">Price Summary</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-xs text-blue-600 font-black uppercase mb-1">Total Amount</p>
                <p className="text-2xl font-black text-blue-700">
                  ₹{priceSummary.totalMin} - ₹{priceSummary.totalMax}
                </p>
              </div>

              {/* Garment Delivery Range */}
              {garments.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-xs text-purple-600 font-black uppercase mb-1">
                    Garment Delivery Range
                  </p>
                  <p className="text-sm font-bold text-purple-700">
                    {new Date(Math.min(...garments.map(g => new Date(g.estimatedDelivery || formData.deliveryDate)))).toLocaleDateString()} - {new Date(Math.max(...garments.map(g => new Date(g.estimatedDelivery || formData.deliveryDate)))).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Payments Section */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-slate-700">Payments</h3>
                  <button
                    type="button"
                    onClick={handleAddPayment}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Payment
                  </button>
                </div>

                {payments.length === 0 ? (
                  <p className="text-sm text-slate-400 italic text-center py-2">
                    No payments added yet
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {payments.map((payment, index) => (
                      <div
                        key={payment.tempId}
                        className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-green-600">₹{payment.amount}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                payment.type === 'advance' ? 'bg-blue-100 text-blue-700' :
                                payment.type === 'part-payment' ? 'bg-orange-100 text-orange-700' :
                                payment.type === 'final-settlement' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {payment.type === 'advance' ? 'Advance' :
                                 payment.type === 'part-payment' ? 'Part' :
                                 payment.type === 'final-settlement' ? 'Full' : 'Extra'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                              <PaymentMethodIcon method={payment.method} />
                              <span className="capitalize">{payment.method}</span>
                            </div>
                            {payment.referenceNumber && (
                              <p className="text-xs text-purple-600 font-mono mt-0.5">
                                Ref: {payment.referenceNumber}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <span>{new Date(payment.date).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{payment.time}</span>
                            </div>
                            {payment.notes && (
                              <p className="text-xs text-slate-400 mt-1 italic">
                                {payment.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button
                              type="button"
                              onClick={() => handleEditPayment(payment)}
                              className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePayment(index)}
                              className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {payments.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-600">Total Paid:</span>
                      <span className="font-bold text-green-600">₹{totalPayments}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-xl">
                <p className="text-xs text-orange-600 font-black uppercase mb-1">Balance Amount</p>
                <p className="text-xl font-black text-orange-700">
                  ₹{balanceAmount.min} - ₹{balanceAmount.max}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !userId}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-black uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6 ${
                  isSubmitting || !userId ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : !userId ? (
                  'Please log in to create order'
                ) : (
                  <>
                    <Save size={18} />
                    Create Order
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate(`${basePath}/orders`)}
                className="w-full px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-black uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Garment Form Modal with customerId prop */}
      {showGarmentModal && (
        <GarmentForm
          onClose={() => setShowGarmentModal(false)}
          onSave={handleSaveGarment}
          editingGarment={editingGarment}
          customerId={formData.customer}
        />
      )}
    </div>
  );
}