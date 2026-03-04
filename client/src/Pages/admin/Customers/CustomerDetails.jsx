import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  User, Phone, Mail, MapPin, Calendar, ShoppingBag, 
  ChevronLeft, PlusCircle, AlertCircle, Edit, Trash2, 
  Save, X, Hash, MessageCircle, FileText, Star, Cake,
  IndianRupee, CreditCard, TrendingUp, Eye, Ruler, 
  Receipt, Clock, Download, Filter, Banknote, Smartphone, 
  Landmark, Package, ChevronLeft as ChevronLeftIcon,
  ChevronRight
} from "lucide-react";
import { 
  fetchCustomerById, 
  updateCustomer, 
  deleteCustomer,
  fetchCustomerPayments,
  fetchCustomerOrders 
} from "../../../features/customer/customerSlice";
import showToast from "../../../utils/toast";
import { exportPaymentsToExcel } from "../../../utils/exportHelpers"; // We'll create this

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // ✅ FIXED: State selectors with fallbacks
  const { currentCustomer, customerPayments, customerOrders, loading } = useSelector((state) => {
    console.log("🔍 Customer state:", state.customer);
    return {
      currentCustomer: state.customer?.currentCustomer || null,
      customerPayments: state.customer?.customerPayments || [],
      customerOrders: state.customer?.customerOrders || [],
      loading: state.customer?.loading || false
    };
  });
  
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const itemsPerPage = 5;
  
  const [formData, setFormData] = useState({
    salutation: "Mr.",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    notes: ""
  });

  // Get base path based on user role
  const rolePath = user?.role === "ADMIN" ? "/admin" : 
                   user?.role === "STORE_KEEPER" ? "/storekeeper" : 
                   "/cuttingmaster";

  // Check if user can perform CRUD operations
  const canEdit = user?.role === "ADMIN" || user?.role === "STORE_KEEPER";
  const canDelete = user?.role === "ADMIN" || user?.role === "STORE_KEEPER";

  // Fetch customer data on mount
  useEffect(() => {
    if (id) {
      console.log("🔍 Fetching customer details for ID:", id);
      dispatch(fetchCustomerById(id));
      dispatch(fetchCustomerPayments(id));
      dispatch(fetchCustomerOrders(id));
    }
  }, [id, dispatch]);

  // Load customer data into form
  useEffect(() => {
    if (currentCustomer) {
      setFormData({
        salutation: currentCustomer.salutation || "Mr.",
        firstName: currentCustomer.firstName || "",
        lastName: currentCustomer.lastName || "",
        dateOfBirth: currentCustomer.dateOfBirth ? currentCustomer.dateOfBirth.split('T')[0] : "",
        phone: currentCustomer.phone || "",
        whatsappNumber: currentCustomer.whatsappNumber || "",
        email: currentCustomer.email || "",
        addressLine1: currentCustomer.addressLine1 || "",
        addressLine2: currentCustomer.addressLine2 || "",
        city: currentCustomer.city || "",
        state: currentCustomer.state || "",
        pincode: currentCustomer.pincode || "",
        notes: currentCustomer.notes || ""
      });
    }
  }, [currentCustomer]);

  // ✅ FIXED: Payment statistics with correct field names (type and method)
  const paymentStats = {
    totalPaid: customerPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    totalPayments: customerPayments?.length || 0,
    lastPayment: customerPayments?.length > 0 ? customerPayments[customerPayments.length - 1] : null, // ✅ Fixed: Show latest, not oldest
    advancePayments: customerPayments?.filter(p => p.type === 'advance').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    fullPayments: customerPayments?.filter(p => p.type === 'full').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    partialPayments: customerPayments?.filter(p => p.type === 'partial').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    extraPayments: customerPayments?.filter(p => p.type === 'extra').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    finalSettlementPayments: customerPayments?.filter(p => p.type === 'final-settlement').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    byMethod: {
      cash: customerPayments?.filter(p => p.method === 'cash').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      upi: customerPayments?.filter(p => p.method === 'upi').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      card: customerPayments?.filter(p => p.method === 'card').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      'bank-transfer': customerPayments?.filter(p => p.method === 'bank-transfer').reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    }
  };

  // ✅ FIXED: Filter payments using correct field name 'type'
  const filteredPayments = customerPayments?.filter(p => {
    if (paymentFilter === "all") return true;
    if (paymentFilter === "final") return p.type === "final-settlement";
    return p.type === paymentFilter;
  }) || [];

  // ✅ Pagination for payments
  const totalPaymentPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paymentStartIndex = (currentPage - 1) * itemsPerPage;
  const paymentEndIndex = paymentStartIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(paymentStartIndex, paymentEndIndex);

  // ✅ Pagination for orders
  const totalOrderPages = Math.ceil((customerOrders?.length || 0) / itemsPerPage);
  const orderStartIndex = (ordersPage - 1) * itemsPerPage;
  const orderEndIndex = orderStartIndex + itemsPerPage;
  const currentOrders = customerOrders?.slice(orderStartIndex, orderEndIndex) || [];

  // Handle Back
  const handleBack = () => {
    navigate(`${rolePath}/customers`);
  };

  // Handle Create Order
  const handleCreateOrder = () => {
    const customerData = {
      _id: currentCustomer._id,
      customerId: currentCustomer.customerId,
      salutation: currentCustomer.salutation,
      firstName: currentCustomer.firstName,
      lastName: currentCustomer.lastName,
      phone: currentCustomer.phone,
      email: currentCustomer.email
    };
    
    navigate(`${rolePath}/orders/new`, { 
      state: { customer: customerData }
    });
  };

  // Handle View Order
  const handleViewOrder = (orderId) => {
    navigate(`${rolePath}/orders/${orderId}`);
  };

  // Handle View Payment
  const handleViewPayment = (paymentId) => {
    navigate(`${rolePath}/payments/${paymentId}`);
  };

  // Handle View Measurements
  const handleViewMeasurements = () => {
    navigate(`${rolePath}/customer-size/${currentCustomer._id}`);
  };

  // ✅ Handle Export
  const handleExportPayments = () => {
    const customerInfo = {
      customerId: currentCustomer?.customerId,
      name: customerFullName()
    };
    exportPaymentsToExcel(customerPayments, customerInfo);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (currentCustomer) {
      setFormData({
        salutation: currentCustomer.salutation || "Mr.",
        firstName: currentCustomer.firstName || "",
        lastName: currentCustomer.lastName || "",
        dateOfBirth: currentCustomer.dateOfBirth ? currentCustomer.dateOfBirth.split('T')[0] : "",
        phone: currentCustomer.phone || "",
        whatsappNumber: currentCustomer.whatsappNumber || "",
        email: currentCustomer.email || "",
        addressLine1: currentCustomer.addressLine1 || "",
        addressLine2: currentCustomer.addressLine2 || "",
        city: currentCustomer.city || "",
        state: currentCustomer.state || "",
        pincode: currentCustomer.pincode || "",
        notes: currentCustomer.notes || ""
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone" || name === "whatsappNumber" || name === "pincode") {
      const numericValue = value.replace(/\D/g, '');
      const maxLength = name === "pincode" ? 6 : 10;
      const truncated = numericValue.slice(0, maxLength);
      setFormData(prev => ({ ...prev, [name]: truncated }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        salutation: formData.salutation,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth || undefined,
        phone: formData.phone,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        notes: formData.notes
      };

      await dispatch(updateCustomer({ id, customerData: updateData })).unwrap();
      showToast.success("Customer updated successfully! ✅");
      setIsEditing(false);
      dispatch(fetchCustomerById(id));
    } catch (error) {
      showToast.error(error.message || "Failed to update customer");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCustomer(id)).unwrap();
      showToast.success("Customer deleted successfully! 🗑️");
      setShowDeleteModal(false);
      navigate(`${rolePath}/customers`);
    } catch (error) {
      showToast.error(error.message || "Failed to delete customer");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    });
    return `${formattedDate} at ${timeString || '00:00'}`;
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isVIP = currentCustomer?.notes?.toLowerCase().includes('vip');

  const customerFullName = () => {
    if (!currentCustomer) return 'Customer';
    
    let name = '';
    if (currentCustomer.firstName || currentCustomer.lastName) {
      const firstName = currentCustomer.firstName || '';
      const lastName = currentCustomer.lastName || '';
      name = `${firstName} ${lastName}`.trim();
    }
    
    if (currentCustomer.salutation && name) {
      return `${currentCustomer.salutation} ${name}`.trim();
    }
    return name || 'Customer';
  };

  const age = calculateAge(currentCustomer?.dateOfBirth);

  if (loading && !currentCustomer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading customer details...</p>
      </div>
    );
  }

  if (!currentCustomer && !loading) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">Customer Not Found</h2>
        <p className="text-slate-500 mb-6">The customer you're looking for doesn't exist.</p>
        <button
          onClick={handleBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Back Button and Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to Customers</span>
        </button>
        
        <div className="flex items-center gap-3">
          {canEdit && !isEditing && (
            <>
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
              >
                <Edit size={18} />
                Edit
              </button>
              {canDelete && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              )}
            </>
          )}
          
          <button
            onClick={handleCreateOrder}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-500/30 transition-all hover:scale-105"
          >
            <PlusCircle size={18} />
            New Order
          </button>

          <button
            onClick={handleViewMeasurements}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
          >
            <Ruler size={18} />
            Measurements
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isEditing ? (
          /* EDIT MODE */
          <div className="p-8">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Edit Customer</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Salutation</label>
                  <select
                    name="salutation"
                    value={formData.salutation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    maxLength="10"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength="6"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW MODE */
          <div className="p-8">
            {/* VIP Badge */}
            {isVIP && (
              <div className="mb-4">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                  <Star size={12} />
                  VIP CUSTOMER
                </span>
              </div>
            )}

            {/* Header with Avatar and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <span className="text-4xl font-black">
                  {customerFullName().charAt(0) || 'C'}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-slate-800">{customerFullName()}</h1>
                </div>
                
                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg w-fit">
                  <Hash size={16} />
                  <span className="font-mono font-bold">{currentCustomer.customerId}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IndianRupee size={20} className="text-blue-600" />
                  </div>
                  <p className="text-xs text-blue-600 font-bold uppercase">Total Paid</p>
                </div>
                <p className="text-2xl font-black text-blue-700">{formatCurrency(paymentStats.totalPaid)}</p>
                <p className="text-xs text-blue-500 mt-1">{paymentStats.totalPayments} payments</p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard size={20} className="text-green-600" />
                  </div>
                  <p className="text-xs text-green-600 font-bold uppercase">Last Payment</p>
                </div>
                <p className="text-2xl font-black text-green-700">
                  {paymentStats.lastPayment ? formatCurrency(paymentStats.lastPayment.amount) : '₹0'}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  {paymentStats.lastPayment ? formatDateTime(paymentStats.lastPayment.paymentDate, paymentStats.lastPayment.paymentTime) : 'No payments'}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={20} className="text-purple-600" />
                  </div>
                  <p className="text-xs text-purple-600 font-bold uppercase">Total Orders</p>
                </div>
                <p className="text-2xl font-black text-purple-700">{customerOrders?.length || 0}</p>
                <p className="text-xs text-purple-500 mt-1">
                  {customerOrders?.filter(o => o.status === 'delivered').length || 0} completed
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp size={20} className="text-orange-600" />
                  </div>
                  <p className="text-xs text-orange-600 font-bold uppercase">Payment Methods</p>
                </div>
                <div className="space-y-1">
                  {Object.entries(paymentStats.byMethod).map(([method, amount]) => (
                    amount > 0 && (
                      <div key={method} className="flex justify-between text-xs">
                        <span className="text-slate-600 capitalize">{method}:</span>
                        <span className="font-bold text-orange-700">{formatCurrency(amount)}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200 mb-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 px-1 font-bold text-sm uppercase tracking-wider transition-all ${
                    activeTab === "overview" 
                      ? "text-blue-600 border-b-2 border-blue-600" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <User size={16} className="inline mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`pb-3 px-1 font-bold text-sm uppercase tracking-wider transition-all ${
                    activeTab === "payments" 
                      ? "text-blue-600 border-b-2 border-blue-600" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <IndianRupee size={16} className="inline mr-2" />
                  Payments ({customerPayments?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-3 px-1 font-bold text-sm uppercase tracking-wider transition-all ${
                    activeTab === "orders" 
                      ? "text-blue-600 border-b-2 border-blue-600" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <ShoppingBag size={16} className="inline mr-2" />
                  Orders ({customerOrders?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("measurements")}
                  className={`pb-3 px-1 font-bold text-sm uppercase tracking-wider transition-all ${
                    activeTab === "measurements" 
                      ? "text-blue-600 border-b-2 border-blue-600" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Ruler size={16} className="inline mr-2" />
                  Measurements
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div>
                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Phone size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-bold uppercase">Phone</p>
                        <p className="text-xl font-bold text-slate-800">{currentCustomer.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <MessageCircle size={24} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-bold uppercase">WhatsApp</p>
                        <p className="text-xl font-bold text-slate-800">{currentCustomer.whatsappNumber || currentCustomer.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Mail size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-600 font-bold uppercase">Email</p>
                        <p className="text-xl font-bold text-slate-800 break-all">{currentCustomer.email || '—'}</p>
                      </div>
                    </div>

                    {currentCustomer.dateOfBirth && (
                      <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                          <Cake size={24} className="text-pink-600" />
                        </div>
                        <div>
                          <p className="text-xs text-pink-600 font-bold uppercase">Date of Birth</p>
                          <p className="text-xl font-bold text-slate-800">
                            {formatDisplayDate(currentCustomer.dateOfBirth)}
                            {age && <span className="text-sm font-normal text-slate-500 ml-2">({age} years)</span>}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Address Section */}
                  {(currentCustomer.addressLine1 || currentCustomer.city) && (
                    <div className="mb-8">
                      <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        <MapPin size={20} className="text-blue-600" />
                        Address
                      </h2>
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <p className="text-slate-700 font-medium">{currentCustomer.addressLine1}</p>
                        {currentCustomer.addressLine2 && <p className="text-slate-600 mt-1">{currentCustomer.addressLine2}</p>}
                        {(currentCustomer.city || currentCustomer.state || currentCustomer.pincode) && (
                          <p className="text-slate-600 mt-1">
                            {[currentCustomer.city, currentCustomer.state, currentCustomer.pincode].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes Section */}
                  {currentCustomer.notes && (
                    <div className="mb-8">
                      <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        Notes
                      </h2>
                      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                        <p className="text-amber-800 italic">"{currentCustomer.notes}"</p>
                      </div>
                    </div>
                  )}

                  {/* Customer Since */}
                  <div className="text-sm text-slate-400 border-t border-slate-100 pt-6">
                    <p>Customer since: {formatDate(currentCustomer.createdAt)}</p>
                    {currentCustomer.updatedAt !== currentCustomer.createdAt && (
                      <p className="mt-1">Last updated: {formatDate(currentCustomer.updatedAt)}</p>
                    )}
                  </div>
                </div>
              )}

              {/* PAYMENTS TAB - FIXED */}
              {activeTab === "payments" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                      <button
                        onClick={() => setPaymentFilter("all")}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          paymentFilter === "all" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setPaymentFilter("advance")}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          paymentFilter === "advance" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Advance
                      </button>
                      <button
                        onClick={() => setPaymentFilter("full")}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          paymentFilter === "full" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Full
                      </button>
                      <button
                        onClick={() => setPaymentFilter("partial")}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          paymentFilter === "partial" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Partial
                      </button>
                      <button
                        onClick={() => setPaymentFilter("extra")}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          paymentFilter === "extra" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Extra
                      </button>
                      <button
                        onClick={() => setPaymentFilter("final")}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          paymentFilter === "final" 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Final
                      </button>
                    </div>
                    <button 
                      onClick={handleExportPayments}
                      className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
                    >
                      <Download size={16} />
                      Export
                    </button>
                  </div>

                  {filteredPayments.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl">
                      <IndianRupee size={48} className="text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-400 font-black text-lg">No Payments Found</p>
                      <p className="text-slate-300 mt-2">This customer hasn't made any payments yet.</p>
                      <button
                        onClick={handleCreateOrder}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
                      >
                        Create Order
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {currentPayments.map((payment) => (
                          <div
                            key={payment._id}
                            className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => handleViewPayment(payment._id)}
                          >
                            {/* Header - Amount & Type */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-black text-2xl text-green-600">
                                  {formatCurrency(payment.amount)}
                                </span>
                                <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                                  payment.type === 'full' ? 'bg-green-100 text-green-700' :
                                  payment.type === 'advance' ? 'bg-blue-100 text-blue-700' :
                                  payment.type === 'partial' ? 'bg-orange-100 text-orange-700' :
                                  payment.type === 'extra' ? 'bg-purple-100 text-purple-700' :
                                  payment.type === 'final-settlement' ? 'bg-indigo-100 text-indigo-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {payment.type === 'final-settlement' ? 'FINAL' : payment.type.toUpperCase()}
                                </span>
                              </div>

                              {/* Order ID */}
                              {payment.order && (
                                <div className="bg-indigo-50 px-3 py-1.5 rounded-lg">
                                  <span className="text-xs font-bold text-indigo-600">Order:</span>
                                  <span className="ml-2 font-mono font-bold text-indigo-700">
                                    {payment.order?.orderId || payment.order}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                              {/* Date & Time */}
                              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                                <Calendar size={14} className="text-blue-500" />
                                <div>
                                  <p className="text-xs text-slate-400">Date & Time</p>
                                  <p className="text-xs font-medium">
                                    {formatDateTime(payment.paymentDate, payment.paymentTime)}
                                  </p>
                                </div>
                              </div>

                              {/* Payment Method */}
                              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                                {payment.method === 'cash' && <Banknote size={14} className="text-green-600" />}
                                {payment.method === 'upi' && <Smartphone size={14} className="text-blue-600" />}
                                {payment.method === 'card' && <CreditCard size={14} className="text-orange-600" />}
                                {payment.method === 'bank-transfer' && <Landmark size={14} className="text-purple-600" />}
                                <div>
                                  <p className="text-xs text-slate-400">Method</p>
                                  <p className="text-xs font-medium capitalize">{payment.method}</p>
                                </div>
                              </div>

                              {/* Reference Number */}
                              {payment.referenceNumber && (
                                <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-lg">
                                  <Hash size={14} className="text-purple-500" />
                                  <div>
                                    <p className="text-xs text-purple-400">Reference</p>
                                    <p className="text-xs font-mono font-medium text-purple-700">
                                      {payment.referenceNumber}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Received By */}
                              {payment.receivedBy && (
                                <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                                  <User size={14} className="text-blue-500" />
                                  <div>
                                    <p className="text-xs text-blue-400">Received By</p>
                                    <p className="text-xs font-medium">
                                      {payment.receivedBy?.name || payment.receivedBy}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Notes */}
                            {payment.notes && (
                              <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                                <p className="text-xs text-amber-600 italic">"{payment.notes}"</p>
                              </div>
                            )}

                            {/* View Button */}
                            <div className="mt-3 flex justify-end">
                              <button className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1">
                                <Eye size={14} />
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPaymentPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                          <p className="text-xs text-slate-500">
                            Showing {paymentStartIndex + 1} to {Math.min(paymentEndIndex, filteredPayments.length)} of {filteredPayments.length} payments
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50 flex items-center gap-1"
                            >
                              <ChevronLeftIcon size={14} />
                              Prev
                            </button>
                            <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                              {currentPage} / {totalPaymentPages}
                            </span>
                            <button
                              onClick={() => setCurrentPage(p => Math.min(totalPaymentPages, p + 1))}
                              disabled={currentPage === totalPaymentPages}
                              className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50 flex items-center gap-1"
                            >
                              Next
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div>
                  {customerOrders?.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl">
                      <ShoppingBag size={48} className="text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-400 font-black text-lg">No Orders Found</p>
                      <p className="text-slate-300 mt-2">This customer hasn't placed any orders yet.</p>
                      <button
                        onClick={handleCreateOrder}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
                      >
                        Create First Order
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {currentOrders.map((order) => (
                          <div
                            key={order._id}
                            className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => handleViewOrder(order._id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-mono font-bold text-indigo-600">
                                    {order.orderId}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                    order.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                                    order.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-purple-100 text-purple-700'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-slate-600">
                                      Order: {formatDate(order.orderDate)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-slate-600">
                                      Delivery: {formatDate(order.deliveryDate)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <IndianRupee size={14} className="text-slate-400" />
                                    <span className="text-slate-600">
                                      ₹{order.priceSummary?.totalMin?.toLocaleString()} - ₹{order.priceSummary?.totalMax?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                
                                {order.paymentSummary && (
                                  <div className="mt-2 flex items-center gap-3">
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                                      Paid: ₹{order.paymentSummary.totalPaid?.toLocaleString()}
                                    </span>
                                    <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
                                      Balance: ₹{order.balanceAmount?.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination for Orders */}
                      {totalOrderPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                          <p className="text-xs text-slate-500">
                            Showing {orderStartIndex + 1} to {Math.min(orderEndIndex, customerOrders.length)} of {customerOrders.length} orders
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                              disabled={ordersPage === 1}
                              className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50 flex items-center gap-1"
                            >
                              <ChevronLeftIcon size={14} />
                              Prev
                            </button>
                            <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                              {ordersPage} / {totalOrderPages}
                            </span>
                            <button
                              onClick={() => setOrdersPage(p => Math.min(totalOrderPages, p + 1))}
                              disabled={ordersPage === totalOrderPages}
                              className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50 flex items-center gap-1"
                            >
                              Next
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* MEASUREMENTS TAB */}
              {activeTab === "measurements" && (
                <div>
                  <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <Ruler size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-black text-lg">Measurement Profiles</p>
                    <p className="text-slate-300 mt-2">View and manage customer measurements</p>
                    <button
                      onClick={handleViewMeasurements}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2"
                    >
                      <Ruler size={18} />
                      Go to Measurements
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-center text-slate-800 mb-2">Delete Customer</h2>
              <p className="text-center text-slate-500 mb-6">
                Are you sure you want to delete <span className="font-black text-slate-700">{customerFullName()}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}