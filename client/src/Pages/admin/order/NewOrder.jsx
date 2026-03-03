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
  ChevronDown,
  Clock,
  Wallet,
  Banknote,
  Smartphone,
  Landmark,
  X,
} from "lucide-react";
import { createOrder } from "../../../features/order/orderSlice";
import { createGarment } from "../../../features/garment/garmentSlice";
import { fetchAllCustomers } from "../../../features/customer/customerSlice";
import GarmentForm from "../garment/GarmentForm";
import AddPaymentModal from "../../../components/AddPaymentModal"; // ✅ Import reusable modal
import showToast from "../../../utils/toast";

export default function NewOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug flag
  const DEBUG = true;
  
  const logDebug = (message, data) => {
    if (DEBUG) {
      console.log(`[NewOrder Debug] ${message}`, data || '');
    }
  };

  // ✅ Get passed customer from Customer Page (if any)
  const passedCustomer = location.state?.customer;
  
  logDebug('Received from state:', passedCustomer);

  useEffect(() => {
    logDebug('Component mounted');
    return () => logDebug('Component unmounted');
  }, []);

  // Get customers from Redux with safety check
  const { customers, loading: customersLoading } = useSelector((state) => {
    console.log('🔍 Redux state.customer:', state.customer);
    
    const customerData = state.customer?.customers;
    const customersArray = Array.isArray(customerData) ? customerData : [];
    
    return {
      customers: customersArray,
      loading: state.customer?.loading || false
    };
  });

  // Get current user from auth state
  const { user } = useSelector((state) => {
    console.log('👤 Full auth state:', state.auth);
    console.log('👤 User object from Redux:', state.auth?.user);
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

  // 👇 State for multiple payments with enhanced fields
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

  // Get user ID directly from user.id
  const userId = user?.id;
  const userRole = user?.role;

  // ✅ Get base path based on user role
  const basePath = user?.role === "ADMIN" ? "/admin" : 
                   user?.role === "STORE_KEEPER" ? "/storekeeper" : 
                   "/cuttingmaster";

  // Enhanced user debugging
  useEffect(() => {
    console.log("👤 USER DEBUG:", {
      userExists: !!user,
      userObject: user,
      userId,
      userRole,
      allKeys: user ? Object.keys(user) : []
    });
  }, [user, userId, userRole]);

  // Log customers state for debugging
  useEffect(() => {
    console.log("👥 Customers state:", {
      exists: !!customers,
      isArray: Array.isArray(customers),
      length: customers?.length || 0,
      type: typeof customers,
      sample: customers?.length > 0 ? customers[0] : null
    });
  }, [customers]);

  logDebug('User authentication', { 
    userExists: !!user, 
    userId, 
    userRole,
    userObject: user 
  });

  // Load customers on mount
  useEffect(() => {
    logDebug('Dispatching fetchAllCustomers');
    dispatch(fetchAllCustomers())
      .unwrap()
      .then((result) => {
        logDebug('Customers fetched successfully', { 
          count: result?.length,
          isArray: Array.isArray(result)
        });
      })
      .catch((error) => {
        logDebug('Error fetching customers', { error: error.message });
        showToast.error("Failed to load customers");
      });
  }, [dispatch]);

  // ✅ AUTO-FILL LOGIC: When passedCustomer is available, auto-select them
  useEffect(() => {
    if (passedCustomer) {
      logDebug('Auto-filling customer from state', passedCustomer);
      
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
      
      logDebug('Auto-fill complete', { fullName, displayId });
    }
  }, [passedCustomer, customers]);

  // Function to get customer full name
  const getCustomerFullName = (customer) => {
    if (!customer) return 'Unknown Customer';
    
    if (customer.firstName || customer.lastName) {
      const firstName = customer.firstName || '';
      const lastName = customer.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
    }
    
    if (customer.salutation && customer.firstName) {
      return `${customer.salutation} ${customer.firstName}`.trim();
    }
    
    return 'Unknown Customer';
  };

  // Function to get customer display ID
  const getCustomerDisplayId = (customer) => {
    return customer.customerId || customer._id || '';
  };

  // Function to get customer phone
  const getCustomerPhone = (customer) => {
    return customer.phone || customer.whatsappNumber || 'No phone';
  };

  // Filter customers based on search with proper safety checks
  const filteredCustomers = useMemo(() => {
    if (!customers || !Array.isArray(customers) || customers.length === 0) {
      console.log('🔍 No valid customers array:', { 
        exists: !!customers, 
        isArray: Array.isArray(customers),
        length: customers?.length 
      });
      return [];
    }
    
    console.log('🔍 Filtering customers:', {
      totalCustomers: customers.length,
      searchTerm: searchTerm || '(empty)'
    });
    
    if (formData.customer && searchTerm === selectedCustomerDisplay) {
      return [];
    }
    
    const filtered = customers.filter(customer => {
      if (!customer) return false;

      const fullName = getCustomerFullName(customer).toLowerCase();
      const customerId = getCustomerDisplayId(customer).toLowerCase();
      const phone = getCustomerPhone(customer);
      const firstName = (customer.firstName || '').toLowerCase();
      const lastName = (customer.lastName || '').toLowerCase();
      
      const searchLower = searchTerm.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        phone.includes(searchTerm) ||
        customerId.includes(searchLower)
      );
    });
    
    logDebug('Filtered customers', { 
      searchTerm, 
      total: customers.length,
      filtered: filtered.length
    });
    
    return filtered;
  }, [customers, searchTerm, formData.customer, selectedCustomerDisplay]);

  // 👇 Calculate total payments
  const totalPayments = useMemo(() => {
    return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  }, [payments]);

  const priceSummary = useMemo(() => {
    const totalMin = garments.reduce((sum, g) => {
      const price = g.priceRange?.min || 0;
      return sum + Number(price);
    }, 0);
    
    const totalMax = garments.reduce((sum, g) => {
      const price = g.priceRange?.max || 0;
      return sum + Number(price);
    }, 0);
    
    return {
      totalMin,
      totalMax
    };
  }, [garments]);

  // 👇 Calculate balance amount based on total payments
  const balanceAmount = useMemo(() => {
    const totalPaid = totalPayments;
    return {
      min: Number(priceSummary.totalMin) - totalPaid,
      max: Number(priceSummary.totalMax) - totalPaid,
    };
  }, [priceSummary, totalPayments]);

  // 👇 Payment handlers
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

  const handleSavePayment = useCallback((paymentData) => {
    if (editingPayment !== null) {
      // Update existing payment
      const index = payments.findIndex(p => p.tempId === editingPayment.tempId);
      if (index !== -1) {
        const newPayments = [...payments];
        newPayments[index] = { 
          ...paymentData, 
          tempId: editingPayment.tempId,
          date: paymentData.date || new Date().toISOString().split('T')[0],
          time: paymentData.time || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        };
        setPayments(newPayments);
        showToast.success("Payment updated");
      }
    } else {
      // Add new payment
      const newPayment = {
        ...paymentData,
        tempId: Date.now() + Math.random(),
        date: paymentData.date || new Date().toISOString().split('T')[0],
        time: paymentData.time || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      };
      setPayments([...payments, newPayment]);
      showToast.success("Payment added");
    }
    
    setShowPaymentModal(false);
    setEditingPayment(null);
  }, [payments, editingPayment]);

  const handleAddGarment = useCallback(() => {
    setEditingGarment(null);
    setShowGarmentModal(true);
  }, []);

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

  // Handle FormData from GarmentForm
  const handleSaveGarment = useCallback((garmentData) => {
    console.log("📦 Received garment data:", garmentData);
    
    if (garmentData instanceof FormData) {
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
            } catch {
              garmentObj[key] = value;
            }
          } else {
            garmentObj[key] = value;
          }
        }
      }
      
      console.log("📦 Converted garment object:", {
        name: garmentObj.name,
        referenceImages: garmentObj.referenceImages?.length || 0,
        customerImages: garmentObj.customerImages?.length || 0,
        customerClothImages: garmentObj.customerClothImages?.length || 0
      });
      
      if (editingGarment !== null) {
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
      if (editingGarment !== null) {
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
          tempId: Date.now() + Math.random(),
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
    
    logDebug('Customer selected', { 
      id: customer._id,
      fullName,
      displayId,
      customer
    });

    setFormData(prev => ({
      ...prev,
      customer: customer._id
    }));

    let displayText = fullName;
    if (customer.salutation && !fullName.includes(customer.salutation)) {
      displayText = `${customer.salutation} ${fullName}`.trim();
    }
    displayText = `${displayText} (${displayId})`;
    
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

  // ✅ Payment Method Icon Component
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const finalUserId = user?.id;

    if (!finalUserId) {
      console.error("❌ No user ID found. User object:", user);
      showToast.error("You must be logged in to create an order. Please log in and try again.");
      return;
    }

    console.log("✅ Using User ID for createdBy:", finalUserId);

    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(finalUserId);
    if (!isValidMongoId) {
      console.warn("⚠️ User ID may not be a valid MongoDB ID:", finalUserId);
    }

    for (const [index, garment] of garments.entries()) {
      if (!garment.name || !garment.category || !garment.item) {
        showToast.error(`Garment #${index + 1} is incomplete`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare order data with multiple payments
      const orderData = {
        customer: formData.customer,
        deliveryDate: formData.deliveryDate,
        specialNotes: formData.specialNotes || "",
        // 👇 Include all payments with enhanced fields
        payments: payments.map(payment => ({
          amount: Number(payment.amount),
          type: payment.type,
          method: payment.method,
          referenceNumber: payment.referenceNumber || "",
          date: payment.date || new Date().toISOString().split('T')[0],
          time: payment.time || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          notes: payment.notes || ""
        })),
        // Keep advancePayment for backward compatibility
        advancePayment: payments.length > 0 ? {
          amount: totalPayments,
          method: payments[0]?.method || "cash",
          date: new Date().toISOString(),
        } : {
          amount: 0,
          method: "cash",
          date: new Date().toISOString(),
        },
        priceSummary: {
          totalMin: Number(priceSummary.totalMin),
          totalMax: Number(priceSummary.totalMax),
        },
        balanceAmount: Number(balanceAmount.min),
        createdBy: finalUserId,
        status: "draft",
        orderDate: new Date().toISOString(),
        garments: [],
      };

      if (!orderData.createdBy) {
        throw new Error("createdBy is undefined in final order data!");
      }

      console.log("========== FINAL ORDER DATA ==========");
      console.log("📦 createdBy value:", orderData.createdBy);
      console.log("📦 Payments:", payments);
      console.log("📦 Total Payments:", totalPayments);
      console.log("📦 Full order data:", JSON.stringify(orderData, null, 2));
      console.log("======================================");

      const result = await dispatch(createOrder(orderData)).unwrap();
      logDebug('Order created successfully', result);
      
      const orderId = result.order?._id || result._id;

      // Create garments with images
      for (const garment of garments) {
        logDebug(`Creating garment`, garment);
        
        const garmentFormData = new FormData();
        
        garmentFormData.append("name", garment.name);
        garmentFormData.append("category", garment.category);
        garmentFormData.append("item", garment.item);
        garmentFormData.append("measurementTemplate", garment.measurementTemplate || "");
        garmentFormData.append("measurementSource", garment.measurementSource || "template");
        garmentFormData.append("measurements", JSON.stringify(garment.measurements || []));
        garmentFormData.append("additionalInfo", garment.additionalInfo || "");
        garmentFormData.append("estimatedDelivery", garment.estimatedDelivery);
        garmentFormData.append("priority", garment.priority || "normal");
        
        const priceRange = {
          min: Number(garment.priceRange?.min) || 0,
          max: Number(garment.priceRange?.max) || 0
        };
        garmentFormData.append("priceRange", JSON.stringify(priceRange));
        
        garmentFormData.append("orderId", orderId);
        garmentFormData.append("createdBy", finalUserId);

        if (garment.referenceImages && garment.referenceImages.length > 0) {
          console.log(`📸 Adding ${garment.referenceImages.length} reference images`);
          for (const img of garment.referenceImages) {
            if (img instanceof File) {
              garmentFormData.append("referenceImages", img);
              console.log(`   ✅ Added: ${img.name}`);
            }
          }
        }
        
        if (garment.customerImages && garment.customerImages.length > 0) {
          console.log(`📸 Adding ${garment.customerImages.length} customer images`);
          for (const img of garment.customerImages) {
            if (img instanceof File) {
              garmentFormData.append("customerImages", img);
              console.log(`   ✅ Added: ${img.name}`);
            }
          }
        }
        
        if (garment.customerClothImages && garment.customerClothImages.length > 0) {
          console.log(`📸 Adding ${garment.customerClothImages.length} cloth images`);
          for (const img of garment.customerClothImages) {
            if (img instanceof File) {
              garmentFormData.append("customerClothImages", img);
              console.log(`   ✅ Added: ${img.name}`);
            }
          }
        }

        console.log("🔍 Garment FormData contents:");
        let imageCount = 0;
        for (let [key, value] of garmentFormData.entries()) {
          if (value instanceof File) {
            imageCount++;
            console.log(`   📸 ${key}: ${value.name} (${value.size} bytes)`);
          } else {
            console.log(`   📝 ${key}: ${value?.substring?.(0, 50) || value}`);
          }
        }
        console.log(`📊 Total images in this garment: ${imageCount}`);

        await dispatch(createGarment({ orderId, garmentData: garmentFormData })).unwrap();
      }

      showToast.success("Order created successfully! 🎉");
      navigate(`${basePath}/orders`);
    } catch (error) {
      console.error('❌ Full error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = typeof error === 'string' 
        ? error 
        : (error.response?.data?.message || error.message || "Failed to create order");
      
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug Panel
  const DebugPanel = () => {
    if (!DEBUG || process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="bg-gray-900 text-green-400 p-4 rounded-2xl font-mono text-sm mb-4 overflow-auto max-h-96">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">🔍 Debug Info</span>
          <button 
            onClick={() => console.clear()} 
            className="text-xs bg-gray-700 px-2 py-1 rounded"
          >
            Clear Console
          </button>
        </div>
        <div className="space-y-1">
          <div>Customer ID: {formData.customer || '❌ Not selected'}</div>
          <div>Customer Display: {selectedCustomerDisplay || 'None'}</div>
          <div>Search Term: "{searchTerm}"</div>
          <div>Garments: {garments.length}</div>
          <div>Payments: {payments.length}</div>
          <div>Total Payments: ₹{totalPayments}</div>
          <div>Garments with Images: {
            garments.filter(g => 
              (g.referenceImages?.length > 0) || 
              (g.customerImages?.length > 0) || 
              (g.customerClothImages?.length > 0)
            ).length
          }</div>
          <div>Delivery Date: {formData.deliveryDate || 'Not set'}</div>
          <div>Customers State: {customers ? '✅ Exists' : '❌ Missing'}</div>
          <div>Customers is Array: {Array.isArray(customers) ? '✅ Yes' : '❌ No'}</div>
          <div>Customers Length: {customers?.length || 0}</div>
          <div>Filtered Customers: {filteredCustomers.length}</div>
          <div>Base Path: {basePath}</div>
          <div className="text-yellow-400 font-bold">
            User Object: {user ? JSON.stringify(user).substring(0, 100) + '...' : '❌ No user'}
          </div>
          <div className="text-green-400 font-bold">
            User ID: {userId || '❌ Not found'} {userId && ( /^[0-9a-fA-F]{24}$/.test(userId) ? '✅ Valid' : '⚠️ Invalid format' )}
          </div>
          <div>User Role: {userRole || 'N/A'}</div>
          <div>Price Summary: Min ₹{priceSummary.totalMin} - Max ₹{priceSummary.totalMax}</div>
          <div>Balance Amount: Min ₹{balanceAmount.min} - Max ₹{balanceAmount.max}</div>
          {passedCustomer && (
            <div className="text-green-400 font-bold">
              ✅ Auto-filled from Customer Page: {passedCustomer.firstName} {passedCustomer.lastName}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 p-6">
      <DebugPanel />

      {/* ✅ Add Payment Modal - Reusable Component */}
      <AddPaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setEditingPayment(null);
        }}
        onSave={handleSavePayment}
        orderTotal={priceSummary.totalMax}
        orderId="temp" // Will be replaced after order creation
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
                        
                        let displayName = fullName;
                        if (customer.salutation && !fullName.includes(customer.salutation)) {
                          displayName = `${customer.salutation} ${fullName}`.trim();
                        }
                        
                        return (
                          <button
                            key={customer._id}
                            type="button"
                            onClick={() => handleCustomerSelect(customer)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0"
                          >
                            <p className="font-medium text-slate-800">{displayName}</p>
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

          {/* Garments Section */}
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
                {garments.map((garment, index) => (
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
                          <div>
                            <p className="text-xs text-slate-400">Category/Item</p>
                            <p className="font-medium">{garment.category} / {garment.item}</p>
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
                ))}
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
                    {new Date(Math.min(...garments.map(g => new Date(g.estimatedDelivery)))).toLocaleDateString()} - {new Date(Math.max(...garments.map(g => new Date(g.estimatedDelivery)))).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* 👇 Enhanced Payments Section */}
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
                                payment.type === 'full' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {payment.type === 'full' ? 'Full' : 'Advance'}
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

      {/* Garment Form Modal */}
      {showGarmentModal && (
        <GarmentForm
          onClose={() => setShowGarmentModal(false)}
          onSave={handleSaveGarment}
          editingGarment={editingGarment}
        />
      )}
    </div>
  );
}