// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   X,
//   Upload,
//   Trash2,
//   ChevronDown,
//   Calendar,
//   AlertCircle,
//   Image as ImageIcon,
//   User,
//   Camera,
//   Scissors,
//   Save,
//   BookmarkPlus,
//   Eye
// } from "lucide-react";
// import { fetchAllCategories } from "../../../features/category/categorySlice";
// import { fetchItems } from "../../../features/item/itemSlice";
// import { fetchAllSizeFields } from "../../../features/sizeField/sizeFieldSlice";
// import { fetchAllTemplates } from "../../../features/sizeTemplate/sizeTemplateSlice";
// import { fetchAllFabrics } from "../../../features/fabric/fabricSlice";
// import { 
//   saveMeasurementTemplate,
//   fetchCustomerTemplates 
// } from "../../../features/customer/customerSlice";
// import showToast from "../../../utils/toast";

// export default function GarmentForm({ onClose, onSave, editingGarment, customerId }) {
//   const dispatch = useDispatch();
  
//   const { categories } = useSelector((state) => state.category);
//   const { items } = useSelector((state) => state.item);
//   const { fields } = useSelector((state) => state.sizeField);
//   const { templates } = useSelector((state) => state.sizeTemplate);
//   const { fabrics } = useSelector((state) => state.fabric);
//   const { user } = useSelector((state) => state.auth);
//   const { currentCustomer, customerTemplates, templatesLoading } = useSelector((state) => state.customer);

//   // ✅ Get user role for permissions
//   const userRole = user?.role;
//   const isAdmin = userRole === "ADMIN";
//   const isStoreKeeper = userRole === "STORE_KEEPER";
//   const canEdit = isAdmin || isStoreKeeper;

//   // ✅ Determine which customer ID to use (prop takes priority)
//   const effectiveCustomerId = customerId || currentCustomer?._id;

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     item: "",
//     measurementTemplate: "",
//     measurementSource: "template",
//     measurements: [],
//     studioImages: [],
//     customerProvidedImages: [],
//     customerClothImages: [],
//     additionalInfo: "",
//     estimatedDelivery: "",
//     priority: "normal",
//     priceRange: {
//       min: "",
//       max: "",
//     },
//     fabricSource: "customer",
//     selectedFabric: "",
//     fabricMeters: "",
//     fabricPrice: 0,
//   });

//   const [selectedFields, setSelectedFields] = useState({});
//   const [manualMeasurements, setManualMeasurements] = useState({});
//   const [previewImages, setPreviewImages] = useState({
//     studio: [],
//     customerProvided: [],
//     customerCloth: [],
//   });
//   const [loading, setLoading] = useState(false);
  
//   // State for save template modal
//   const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
//   const [templateName, setTemplateName] = useState("");
//   const [selectedCustomerTemplate, setSelectedCustomerTemplate] = useState("");

//   // ==================== LOAD DATA ON MOUNT ====================
//   useEffect(() => {
//     dispatch(fetchAllCategories());
//     dispatch(fetchAllSizeFields());
//     dispatch(fetchAllTemplates({ page: 1, search: "" }));
//     dispatch(fetchAllFabrics());
//   }, [dispatch]);

//   // ✅ Load customer templates when effectiveCustomerId changes
//   useEffect(() => {
//     if (effectiveCustomerId) {
//       console.log(`📋 Fetching templates for customer: ${effectiveCustomerId}`);
//       dispatch(fetchCustomerTemplates(effectiveCustomerId));
//     }
//   }, [dispatch, effectiveCustomerId]);

//   // Load items when category changes
//   useEffect(() => {
//     if (formData.category) {
//       dispatch(fetchItems(formData.category));
//     }
//   }, [dispatch, formData.category]);

//   // Auto-fill price range when item is selected
//   useEffect(() => {
//     if (formData.item) {
//       const selectedItem = items?.find(item => item._id === formData.item);
//       if (selectedItem?.priceRange) {
//         setFormData(prev => ({
//           ...prev,
//           priceRange: {
//             min: selectedItem.priceRange.min || "",
//             max: selectedItem.priceRange.max || "",
//           }
//         }));
//       }
//     }
//   }, [formData.item, items]);

//   // Calculate fabric price
//   useEffect(() => {
//     if (formData.fabricSource === "shop" && formData.selectedFabric && formData.fabricMeters) {
//       const selectedFabric = fabrics?.find(f => f._id === formData.selectedFabric);
//       if (selectedFabric) {
//         const pricePerMeter = selectedFabric.pricePerMeter || 0;
//         const meters = parseFloat(formData.fabricMeters) || 0;
//         const fabricPrice = pricePerMeter * meters;
        
//         setFormData(prev => ({
//           ...prev,
//           fabricPrice: fabricPrice
//         }));
//       }
//     } else if (formData.fabricSource === "customer") {
//       setFormData(prev => ({
//         ...prev,
//         fabricPrice: 0,
//         selectedFabric: "",
//         fabricMeters: ""
//       }));
//     }
//   }, [formData.fabricSource, formData.selectedFabric, formData.fabricMeters, fabrics]);

//   // Load template measurements
//   useEffect(() => {
//     if (formData.measurementTemplate && formData.measurementSource === "template") {
//       const template = templates?.find(t => t._id === formData.measurementTemplate);
//       if (template) {
//         const measurements = template.sizeFields.map(field => ({
//           name: field.name,
//           value: "",
//           unit: "inches",
//         }));
//         setFormData(prev => ({ ...prev, measurements }));
        
//         const selected = {};
//         template.sizeFields.forEach(field => {
//           selected[field.name] = true;
//         });
//         setSelectedFields(selected);
//       }
//     }
//   }, [formData.measurementTemplate, templates]);

//   // ✅ Load customer saved template when selected
//   useEffect(() => {
//     if (formData.measurementSource === "customer" && selectedCustomerTemplate) {
//       const template = customerTemplates?.find(t => t._id === selectedCustomerTemplate);
//       if (template) {
//         const measurements = [];
//         const manual = {};
        
//         // Handle both Map object and regular object
//         if (template.measurements instanceof Map) {
//           template.measurements.forEach((value, key) => {
//             measurements.push({
//               name: key,
//               value: value,
//               unit: "inches"
//             });
//             manual[key] = value;
//           });
//         } else {
//           // Regular object
//           Object.entries(template.measurements).forEach(([key, value]) => {
//             measurements.push({
//               name: key,
//               value: value,
//               unit: "inches"
//             });
//             manual[key] = value;
//           });
//         }
        
//         setFormData(prev => ({
//           ...prev,
//           measurements: measurements
//         }));
        
//         setManualMeasurements(manual);
        
//         showToast.success(`✅ Loaded template: ${template.name}`);
//       }
//     }
//   }, [selectedCustomerTemplate, customerTemplates]);

//   // Load editing data
//   useEffect(() => {
//     if (editingGarment) {
//       setFormData({
//         name: editingGarment.name || "",
//         category: editingGarment.category?._id || editingGarment.category || "",
//         item: editingGarment.item?._id || editingGarment.item || "",
//         measurementTemplate: editingGarment.measurementTemplate?._id || editingGarment.measurementTemplate || "",
//         measurementSource: editingGarment.measurementSource || "template",
//         measurements: editingGarment.measurements || [],
//         studioImages: editingGarment.referenceImages || [],
//         customerProvidedImages: editingGarment.customerImages || [],
//         customerClothImages: editingGarment.customerClothImages || [],
//         additionalInfo: editingGarment.additionalInfo || "",
//         estimatedDelivery: editingGarment.estimatedDelivery?.split("T")[0] || "",
//         priority: editingGarment.priority || "normal",
//         priceRange: editingGarment.priceRange || { min: "", max: "" },
//         fabricSource: editingGarment.fabricSource || "customer",
//         selectedFabric: editingGarment.selectedFabric || "",
//         fabricMeters: editingGarment.fabricMeters || "",
//         fabricPrice: editingGarment.fabricPrice || 0,
//       });

//       // Set preview for existing images
//       const studioPreviews = (editingGarment.referenceImages || []).map(img => ({
//         preview: img.url || img,
//         file: null,
//         isExisting: true,
//         url: img.url,
//         key: img.key
//       }));
      
//       const customerPreviews = (editingGarment.customerImages || []).map(img => ({
//         preview: img.url || img,
//         file: null,
//         isExisting: true,
//         url: img.url,
//         key: img.key
//       }));

//       const clothPreviews = (editingGarment.customerClothImages || []).map(img => ({
//         preview: img.url || img,
//         file: null,
//         isExisting: true,
//         url: img.url,
//         key: img.key
//       }));

//       setPreviewImages({
//         studio: studioPreviews,
//         customerProvided: customerPreviews,
//         customerCloth: clothPreviews,
//       });

//       // Set selected fields for measurements
//       if (editingGarment.measurements) {
//         const selected = {};
//         editingGarment.measurements.forEach(m => {
//           selected[m.name] = true;
//         });
//         setSelectedFields(selected);
//       }

//       // Set manual measurements if source is customer
//       if (editingGarment.measurementSource === "customer" && editingGarment.measurements) {
//         const manual = {};
//         editingGarment.measurements.forEach(m => {
//           manual[m.name] = m.value;
//         });
//         setManualMeasurements(manual);
//       }
//     }
//   }, [editingGarment]);

//   // ==================== IMAGE HANDLERS ====================
//   const handleImageChange = (e, type) => {
//     const files = Array.from(e.target.files);
    
//     // Validate file size (max 5MB each)
//     const invalidFiles = files.filter(f => f.size > 5 * 1024 * 1024);
//     if (invalidFiles.length > 0) {
//       showToast.error("Some images exceed 5MB limit");
//       return;
//     }

//     // Validate file types
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
//     const invalidTypes = files.filter(f => !validTypes.includes(f.type));
//     if (invalidTypes.length > 0) {
//       showToast.error("Please upload only JPG, PNG or WEBP images");
//       return;
//     }

//     // Create preview URLs
//     const newPreviews = files.map(file => ({
//       file,
//       preview: URL.createObjectURL(file),
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       isExisting: false,
//     }));

//     setPreviewImages(prev => ({
//       ...prev,
//       [type]: [...prev[type], ...newPreviews],
//     }));

//     // Store actual files in formData
//     let imageField;
//     switch(type) {
//       case "studio":
//         imageField = "studioImages";
//         break;
//       case "customerProvided":
//         imageField = "customerProvidedImages";
//         break;
//       case "customerCloth":
//         imageField = "customerClothImages";
//         break;
//       default:
//         return;
//     }
    
//     const existingFiles = formData[imageField] || [];
    
//     setFormData(prev => ({
//       ...prev,
//       [imageField]: [
//         ...existingFiles,
//         ...files,
//       ],
//     }));
//   };

//   const removeImage = (index, type) => {
//     // Clean up preview URL
//     const imageToRemove = previewImages[type][index];
//     if (imageToRemove.preview && imageToRemove.preview.startsWith('blob:')) {
//       URL.revokeObjectURL(imageToRemove.preview);
//     }

//     setPreviewImages(prev => ({
//       ...prev,
//       [type]: prev[type].filter((_, i) => i !== index),
//     }));

//     let imageField;
//     switch(type) {
//       case "studio":
//         imageField = "studioImages";
//         break;
//       case "customerProvided":
//         imageField = "customerProvidedImages";
//         break;
//       case "customerCloth":
//         imageField = "customerClothImages";
//         break;
//       default:
//         return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       [imageField]: prev[imageField].filter((_, i) => i !== index),
//     }));
//   };

//   // ==================== MEASUREMENT HANDLERS ====================
//   const handleMeasurementToggle = (field) => {
//     setSelectedFields(prev => ({
//       ...prev,
//       [field.name]: !prev[field.name],
//     }));

//     if (!selectedFields[field.name]) {
//       setFormData(prev => ({
//         ...prev,
//         measurements: [
//           ...prev.measurements,
//           { name: field.name, value: "", unit: field.unit || "inches" },
//         ],
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         measurements: prev.measurements.filter(m => m.name !== field.name),
//       }));
//     }
//   };

//   const handleMeasurementChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       measurements: prev.measurements.map(m =>
//         m.name === name ? { ...m, value: parseFloat(value) || "" } : m
//       ),
//     }));
//   };

//   const handleManualMeasurementChange = (name, value) => {
//     setManualMeasurements(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ==================== TEMPLATE HANDLERS ====================
//   const handleSaveAsTemplate = () => {
//     if (!effectiveCustomerId) {
//       showToast.error("No customer selected to save template");
//       return;
//     }

//     // Get current measurements based on source
//     let currentMeasurements = {};
    
//     if (formData.measurementSource === "template") {
//       formData.measurements.forEach(m => {
//         if (m.value) {
//           currentMeasurements[m.name] = parseFloat(m.value);
//         }
//       });
//     } else {
//       currentMeasurements = manualMeasurements;
//     }

//     // Filter out empty values
//     currentMeasurements = Object.fromEntries(
//       Object.entries(currentMeasurements).filter(([_, value]) => value && value > 0)
//     );

//     if (Object.keys(currentMeasurements).length === 0) {
//       showToast.error("No measurements entered to save");
//       return;
//     }

//     setShowSaveTemplateModal(true);
//   };

//   const confirmSaveTemplate = async () => {
//     if (!templateName.trim()) {
//       showToast.error("Please enter a template name");
//       return;
//     }

//     if (!effectiveCustomerId) {
//       showToast.error("Customer ID missing");
//       setShowSaveTemplateModal(false);
//       return;
//     }

//     // Get current measurements
//     let currentMeasurements = {};
    
//     if (formData.measurementSource === "template") {
//       formData.measurements.forEach(m => {
//         if (m.value) {
//           currentMeasurements[m.name] = parseFloat(m.value);
//         }
//       });
//     } else {
//       currentMeasurements = manualMeasurements;
//     }

//     // Filter out empty values
//     currentMeasurements = Object.fromEntries(
//       Object.entries(currentMeasurements).filter(([_, value]) => value && value > 0)
//     );

//     const templateData = {
//       templateName: templateName.trim(),
//       measurements: currentMeasurements,
//       garmentReference: editingGarment?._id || null,
//       notes: `Saved from ${formData.name} garment`
//     };

//     try {
//       await dispatch(saveMeasurementTemplate({
//         customerId: effectiveCustomerId,
//         templateData
//       })).unwrap();
      
//       setShowSaveTemplateModal(false);
//       setTemplateName("");
//       showToast.success(`✅ Template "${templateName}" saved successfully!`);
      
//       // Refresh templates list
//       dispatch(fetchCustomerTemplates(effectiveCustomerId));
//     } catch (error) {
//       console.error("❌ Error saving template:", error);
//     }
//   };

//   // ==================== PRICE CALCULATION ====================
//   const getTotalPrices = () => {
//     const itemMin = parseFloat(formData.priceRange.min) || 0;
//     const itemMax = parseFloat(formData.priceRange.max) || 0;
//     const fabricPrice = formData.fabricPrice || 0;
    
//     return {
//       totalMin: itemMin + fabricPrice,
//       totalMax: itemMax + fabricPrice,
//     };
//   };

//   // ==================== SUBMIT HANDLER ====================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validation
//     if (!formData.name) {
//       showToast.error("Garment name is required");
//       setLoading(false);
//       return;
//     }

//     if (!formData.category) {
//       showToast.error("Please select a category");
//       setLoading(false);
//       return;
//     }

//     if (!formData.item) {
//       showToast.error("Please select an item");
//       setLoading(false);
//       return;
//     }

//     if (!formData.estimatedDelivery) {
//       showToast.error("Please select estimated delivery date");
//       setLoading(false);
//       return;
//     }

//     if (!formData.priceRange.min || !formData.priceRange.max) {
//       showToast.error("Please enter price range");
//       setLoading(false);
//       return;
//     }

//     if (parseInt(formData.priceRange.min) > parseInt(formData.priceRange.max)) {
//       showToast.error("Minimum price cannot be greater than maximum price");
//       setLoading(false);
//       return;
//     }

//     if (formData.fabricSource === "shop") {
//       if (!formData.selectedFabric) {
//         showToast.error("Please select a fabric");
//         setLoading(false);
//         return;
//       }
//       if (!formData.fabricMeters || parseFloat(formData.fabricMeters) <= 0) {
//         showToast.error("Please enter valid fabric meters");
//         setLoading(false);
//         return;
//       }
//     }

//     if (formData.measurementSource === "template" && formData.measurements.length === 0) {
//       showToast.error("Please select at least one measurement");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Prepare final measurements
//       let finalMeasurements = formData.measurements;
//       if (formData.measurementSource === "customer") {
//         finalMeasurements = Object.entries(manualMeasurements)
//           .filter(([_, value]) => value)
//           .map(([name, value]) => ({
//             name,
//             value: parseFloat(value),
//             unit: "inches",
//           }));
//       }

//       // Create FormData
//       const formDataToSend = new FormData();

//       // Add text fields
//       formDataToSend.append("name", formData.name);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("item", formData.item);
//       formDataToSend.append("measurementTemplate", formData.measurementTemplate || "");
//       formDataToSend.append("measurementSource", formData.measurementSource);
//       formDataToSend.append("measurements", JSON.stringify(finalMeasurements));
//       formDataToSend.append("additionalInfo", formData.additionalInfo || "");
//       formDataToSend.append("estimatedDelivery", formData.estimatedDelivery);
//       formDataToSend.append("priority", formData.priority);
//       formDataToSend.append("priceRange", JSON.stringify(formData.priceRange));

//       // Add fabric data
//       formDataToSend.append("fabricSource", formData.fabricSource);
//       if (formData.fabricSource === "shop") {
//         formDataToSend.append("selectedFabric", formData.selectedFabric);
//         formDataToSend.append("fabricMeters", formData.fabricMeters);
//         formDataToSend.append("fabricPrice", formData.fabricPrice);
//       } else {
//         formDataToSend.append("fabricPrice", "0");
//       }

//       // Add images
//       if (formData.studioImages && formData.studioImages.length > 0) {
//         for (const file of formData.studioImages) {
//           if (file instanceof File) {
//             formDataToSend.append("referenceImages", file);
//           }
//         }
//       }

//       if (formData.customerProvidedImages && formData.customerProvidedImages.length > 0) {
//         for (const file of formData.customerProvidedImages) {
//           if (file instanceof File) {
//             formDataToSend.append("customerImages", file);
//           }
//         }
//       }

//       if (formData.customerClothImages && formData.customerClothImages.length > 0) {
//         for (const file of formData.customerClothImages) {
//           if (file instanceof File) {
//             formDataToSend.append("customerClothImages", file);
//           }
//         }
//       }

//       // Clean up blob URLs
//       Object.values(previewImages).flat().forEach(img => {
//         if (img.preview && img.preview.startsWith('blob:')) {
//           URL.revokeObjectURL(img.preview);
//         }
//       });

//       // Call onSave with FormData
//       onSave(formDataToSend);

//     } catch (error) {
//       console.error("❌ Error preparing form data:", error);
//       showToast.error("Failed to prepare garment data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Group size fields by category
//   const groupedFields = fields?.reduce((acc, field) => {
//     if (!acc[field.category]) acc[field.category] = [];
//     acc[field.category].push(field);
//     return acc;
//   }, {});

//   const categoryTitles = {
//     upper: "Upper Body Measurements",
//     lower: "Lower Body Measurements",
//     full: "Full Body Measurements",
//     other: "Other Measurements",
//   };

//   const totals = getTotalPrices();

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
//       <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
//           <h2 className="text-xl font-black text-white">
//             {editingGarment ? "Edit Garment" : "Add New Garment"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/20 rounded-lg transition-all"
//           >
//             <X size={20} className="text-white" />
//           </button>
//         </div>

//         {/* Form - Scrollable */}
//         <div className="flex-1 overflow-y-auto p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <h3 className="font-black text-slate-800 mb-4">Basic Information</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Garment Name */}
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Garment Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     placeholder="e.g., Men's Formal Shirt"
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     required
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => setFormData({ 
//                       ...formData, 
//                       category: e.target.value,
//                       item: ""
//                     })}
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories?.map((cat) => (
//                       <option key={cat._id} value={cat._id}>{cat.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Item */}
//                 <div>
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Item <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.item}
//                     onChange={(e) => setFormData({ ...formData, item: e.target.value })}
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     required
//                     disabled={!formData.category}
//                   >
//                     <option value="">Select Item</option>
//                     {items?.map((item) => (
//                       <option key={item._id} value={item._id}>
//                         {item.name} {item.priceRange ? `(₹${item.priceRange.min} - ₹${item.priceRange.max})` : ''}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Priority */}
//                 <div>
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Priority
//                   </label>
//                   <select
//                     value={formData.priority}
//                     onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                   >
//                     <option value="normal">Normal</option>
//                     <option value="high">High</option>
//                     <option value="low">Low</option>
//                   </select>
//                 </div>

//                 {/* Estimated Delivery */}
//                 <div>
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Estimated Delivery <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <Calendar className="absolute left-4 top-3.5 text-slate-400" size={18} />
//                     <input
//                       type="date"
//                       value={formData.estimatedDelivery}
//                       onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
//                       min={new Date().toISOString().split("T")[0]}
//                       className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Fabric Section */}
//             <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-l-blue-500">
//               <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
//                 <Scissors size={20} className="text-blue-600" />
//                 Fabric Details
//               </h3>

//               <div className="flex gap-4 mb-4">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="fabricSource"
//                     value="customer"
//                     checked={formData.fabricSource === "customer"}
//                     onChange={(e) => setFormData({ 
//                       ...formData, 
//                       fabricSource: e.target.value,
//                       selectedFabric: "",
//                       fabricMeters: "",
//                       fabricPrice: 0
//                     })}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Customer Provided (Free)</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="fabricSource"
//                     value="shop"
//                     checked={formData.fabricSource === "shop"}
//                     onChange={(e) => setFormData({ 
//                       ...formData, 
//                       fabricSource: e.target.value 
//                     })}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Shop Provided (Chargeable)</span>
//                 </label>
//               </div>

//               {formData.fabricSource === "shop" && (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Select Fabric <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={formData.selectedFabric}
//                       onChange={(e) => setFormData({ ...formData, selectedFabric: e.target.value })}
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     >
//                       <option value="">Choose Fabric</option>
//                       {fabrics?.map((fabric) => (
//                         <option key={fabric._id} value={fabric._id}>
//                           {fabric.name} - {fabric.color} (₹{fabric.pricePerMeter}/m)
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Meters Required <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.fabricMeters}
//                       onChange={(e) => setFormData({ ...formData, fabricMeters: e.target.value })}
//                       placeholder="e.g., 2.5"
//                       step="0.1"
//                       min="0"
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Fabric Price
//                     </label>
//                     <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-bold">
//                       ₹{formData.fabricPrice.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Price Range & Total Display */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <h3 className="font-black text-slate-800 mb-4">Pricing</h3>
              
//               <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                 <p className="text-xs text-blue-600 font-bold mb-1">Item Price (Auto-filled from selected item)</p>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <span className="text-sm text-slate-600">Min Price:</span>
//                     <span className="ml-2 font-bold text-blue-700">₹{formData.priceRange.min || 0}</span>
//                   </div>
//                   <div>
//                     <span className="text-sm text-slate-600">Max Price:</span>
//                     <span className="ml-2 font-bold text-blue-700">₹{formData.priceRange.max || 0}</span>
//                   </div>
//                 </div>
//               </div>

//               {formData.fabricSource === "shop" && formData.fabricPrice > 0 && (
//                 <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
//                   <p className="text-xs text-green-600 font-bold mb-1">Fabric Price</p>
//                   <div>
//                     <span className="text-sm text-slate-600">Fabric Cost:</span>
//                     <span className="ml-2 font-bold text-green-700">₹{formData.fabricPrice.toFixed(2)}</span>
//                   </div>
//                 </div>
//               )}

//               <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
//                 <p className="text-xs text-purple-600 font-bold mb-2">TOTAL GARMENT PRICE</p>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <span className="text-sm text-slate-600">Min Total:</span>
//                     <span className="ml-2 text-lg font-black text-purple-700">₹{totals.totalMin}</span>
//                   </div>
//                   <div>
//                     <span className="text-sm text-slate-600">Max Total:</span>
//                     <span className="ml-2 text-lg font-black text-purple-700">₹{totals.totalMax}</span>
//                   </div>
//                 </div>
//                 <p className="text-xs text-purple-500 mt-2">
//                   * Final bill will include: Tailoring (₹{formData.priceRange.min} - ₹{formData.priceRange.max}) 
//                   {formData.fabricSource === "shop" && formData.fabricPrice > 0 ? ` + Fabric (₹${formData.fabricPrice})` : ''}
//                 </p>
//               </div>

//               {/* Hidden price inputs */}
//               <div className="hidden">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Minimum Price (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.priceRange.min}
//                       onChange={(e) => setFormData({
//                         ...formData,
//                         priceRange: { ...formData.priceRange, min: e.target.value }
//                       })}
//                       min="0"
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Maximum Price (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.priceRange.max}
//                       onChange={(e) => setFormData({
//                         ...formData,
//                         priceRange: { ...formData.priceRange, max: e.target.value }
//                       })}
//                       min="0"
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Measurement Section */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-black text-slate-800">Measurements</h3>
                
//                 {effectiveCustomerId && (
//                   <button
//                     type="button"
//                     onClick={handleSaveAsTemplate}
//                     className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-all"
//                   >
//                     <BookmarkPlus size={16} />
//                     Save as Template
//                   </button>
//                 )}
//               </div>

//               <div className="flex gap-4 mb-4 flex-wrap">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="measurementSource"
//                     value="template"
//                     checked={formData.measurementSource === "template"}
//                     onChange={(e) => {
//                       setFormData({ ...formData, measurementSource: e.target.value });
//                       setSelectedCustomerTemplate("");
//                     }}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Use Template</span>
//                 </label>
                
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="measurementSource"
//                     value="customer"
//                     checked={formData.measurementSource === "customer"}
//                     onChange={(e) => {
//                       setFormData({ ...formData, measurementSource: e.target.value });
//                     }}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Customer Saved Templates</span>
//                 </label>
                
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="measurementSource"
//                     value="manual"
//                     checked={formData.measurementSource === "manual"}
//                     onChange={(e) => {
//                       setFormData({ ...formData, measurementSource: e.target.value });
//                       setSelectedCustomerTemplate("");
//                     }}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Manual Entry</span>
//                 </label>
//               </div>

//               {/* Customer Templates Dropdown */}
//               {formData.measurementSource === "customer" && (
//                 <div className="mb-4">
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Select Saved Template
//                   </label>
//                   {!effectiveCustomerId ? (
//                     <p className="text-sm text-amber-600 italic p-3 bg-amber-50 rounded-lg">
//                       Please select a customer first to view saved templates
//                     </p>
//                   ) : templatesLoading ? (
//                     <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
//                       <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
//                       <span className="text-sm text-slate-600">Loading templates...</span>
//                     </div>
//                   ) : customerTemplates?.length > 0 ? (
//                     <select
//                       value={selectedCustomerTemplate}
//                       onChange={(e) => setSelectedCustomerTemplate(e.target.value)}
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     >
//                       <option value="">-- Select a template --</option>
//                       {customerTemplates.map((template) => (
//                         <option key={template._id} value={template._id}>
//                           {template.name} (Used {template.usageCount || 1} times)
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     <p className="text-sm text-slate-500 italic p-3 bg-slate-100 rounded-lg">
//                       No saved templates yet. Create one using "Save as Template" button above.
//                     </p>
//                   )}
//                 </div>
//               )}

//               {formData.measurementSource === "template" && (
//                 <>
//                   <div className="mb-4">
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Measurement Template
//                     </label>
//                     <select
//                       value={formData.measurementTemplate}
//                       onChange={(e) => setFormData({ ...formData, measurementTemplate: e.target.value })}
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     >
//                       <option value="">Select Template</option>
//                       {templates?.map((template) => (
//                         <option key={template._id} value={template._id}>{template.name}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {formData.measurementTemplate && (
//                     <div className="space-y-4">
//                       {Object.entries(groupedFields || {}).map(([category, categoryFields]) => (
//                         <div key={category}>
//                           <h4 className="font-bold text-slate-700 mb-2">
//                             {categoryTitles[category] || category}
//                           </h4>
//                           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                             {categoryFields.map((field) => (
//                               <label
//                                 key={field._id}
//                                 className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
//                                   selectedFields[field.name]
//                                     ? "border-blue-500 bg-blue-50"
//                                     : "border-slate-200 hover:border-blue-200"
//                                 }`}
//                               >
//                                 <input
//                                   type="checkbox"
//                                   className="hidden"
//                                   checked={selectedFields[field.name] || false}
//                                   onChange={() => handleMeasurementToggle(field)}
//                                 />
//                                 <span className="text-sm">{field.displayName}</span>
//                               </label>
//                             ))}
//                           </div>
//                         </div>
//                       ))}

//                       {formData.measurements.length > 0 && (
//                         <div className="mt-4 space-y-3">
//                           <h4 className="font-bold text-slate-700">Enter Values</h4>
//                           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                             {formData.measurements.map((measurement) => (
//                               <div key={measurement.name}>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1">
//                                   {measurement.name}
//                                 </label>
//                                 <input
//                                   type="number"
//                                   value={measurement.value}
//                                   onChange={(e) => handleMeasurementChange(measurement.name, e.target.value)}
//                                   placeholder="inches"
//                                   step="0.1"
//                                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </>
//               )}

//               {formData.measurementSource === "customer" && !selectedCustomerTemplate && (
//                 <div className="space-y-3">
//                   <p className="text-sm text-slate-600">Select a template from the dropdown above</p>
//                 </div>
//               )}

//               {formData.measurementSource === "customer" && selectedCustomerTemplate && (
//                 <div className="space-y-3">
//                   <p className="text-sm text-green-600 font-medium flex items-center gap-2">
//                     <span className="w-2 h-2 bg-green-600 rounded-full"></span>
//                     Template loaded - you can edit values if needed
//                   </p>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {formData.measurements.map((measurement) => (
//                       <div key={measurement.name}>
//                         <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">
//                           {measurement.name}
//                         </label>
//                         <input
//                           type="number"
//                           value={measurement.value}
//                           onChange={(e) => handleMeasurementChange(measurement.name, e.target.value)}
//                           step="0.1"
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {formData.measurementSource === "manual" && (
//                 <div className="space-y-3">
//                   <p className="text-sm text-slate-600">Enter measurements manually</p>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {fields?.map((field) => (
//                       <div key={field._id}>
//                         <label className="block text-xs font-medium text-slate-600 mb-1">
//                           {field.displayName}
//                         </label>
//                         <input
//                           type="number"
//                           value={manualMeasurements[field.name] || ""}
//                           onChange={(e) => handleManualMeasurementChange(field.name, e.target.value)}
//                           placeholder={field.unit}
//                           step="0.1"
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* IMAGES SECTION */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
//                 <Camera size={20} className="text-blue-600" />
//                 Garment Images
//               </h3>

//               {/* Studio/Reference Images */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
//                     <ImageIcon size={16} className="text-indigo-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-slate-800">Studio Reference Images</h4>
//                     <p className="text-xs text-slate-500">Designer images, style references, inspiration</p>
//                   </div>
//                 </div>
                
//                 <div className="border-2 border-dashed border-slate-300 rounded-xl p-4">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     {previewImages.studio.map((img, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={img.preview}
//                           alt={`Studio ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg"
//                         />
//                         {!img.isExisting && (
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index, "studio")}
//                             className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <Trash2 size={12} />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <label className="border-2 border-dashed border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
//                       <Upload size={24} className="text-slate-400 mb-1" />
//                       <span className="text-xs text-slate-500">Upload</span>
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageChange(e, "studio")}
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-slate-400">Max 5MB per image. JPG, PNG, WEBP only.</p>
//                 </div>
//               </div>

//               {/* Customer Provided Images (Digital) */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                     <User size={16} className="text-green-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-slate-800">Customer Digital Images</h4>
//                     <p className="text-xs text-slate-500">Photos sent by customer via WhatsApp/email</p>
//                   </div>
//                 </div>

//                 <div className="border-2 border-dashed border-slate-300 rounded-xl p-4">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     {previewImages.customerProvided.map((img, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={img.preview}
//                           alt={`Customer Digital ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg"
//                         />
//                         {!img.isExisting && (
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index, "customerProvided")}
//                             className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <Trash2 size={12} />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <label className="border-2 border-dashed border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
//                       <Upload size={24} className="text-slate-400 mb-1" />
//                       <span className="text-xs text-slate-500">Upload</span>
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageChange(e, "customerProvided")}
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-slate-400">Max 5MB per image. JPG, PNG, WEBP only.</p>
//                 </div>
//               </div>

//               {/* Customer Physical Cloth Images */}
//               <div>
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
//                     <Scissors size={16} className="text-orange-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-slate-800">Customer's Reference Cloth</h4>
//                     <p className="text-xs text-slate-500">Photos of physical cloth/design given by customer - for color, fabric, and design reference</p>
//                   </div>
//                 </div>

//                 <div className="border-2 border-dashed border-orange-200 bg-orange-50/30 rounded-xl p-4">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     {previewImages.customerCloth.map((img, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={img.preview}
//                           alt={`Customer Cloth ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg border-2 border-orange-200"
//                         />
//                         {!img.isExisting && (
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index, "customerCloth")}
//                             className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <Trash2 size={12} />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <label className="border-2 border-dashed border-orange-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 transition-all">
//                       <Upload size={24} className="text-orange-400 mb-1" />
//                       <span className="text-xs text-orange-600 font-medium">Upload Cloth Photo</span>
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageChange(e, "customerCloth")}
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-orange-600">
//                     <span className="font-bold">Important:</span> Upload photos of the actual cloth/design given by customer. 
//                     This helps in matching color, fabric texture, and design details.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Additional Info */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                 Additional Information
//               </label>
//               <textarea
//                 value={formData.additionalInfo}
//                 onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
//                 rows="3"
//                 placeholder="Any special instructions or notes about this garment..."
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
//               />
//             </div>

//             {/* Form Actions */}
//             <div className="flex gap-3 pt-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all ${
//                   loading ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {loading ? 'Processing...' : (editingGarment ? "Update Garment" : "Add Garment")}
//               </button>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-black hover:bg-slate-300 transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Save Template Modal */}
//       {showSaveTemplateModal && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
//             <div className="p-6">
//               <h3 className="text-xl font-black text-slate-800 mb-2">Save as Template</h3>
//               <p className="text-sm text-slate-500 mb-4">
//                 Save these measurements as a template for future use
//               </p>

//               <div className="mb-4">
//                 <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                   Template Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={templateName}
//                   onChange={(e) => setTemplateName(e.target.value)}
//                   placeholder="e.g., Father Shirt Size, Brother Kurta"
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//                   autoFocus
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={confirmSaveTemplate}
//                   className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black transition-all"
//                 >
//                   Save Template
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowSaveTemplateModal(false);
//                     setTemplateName("");
//                   }}
//                   className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-black transition-all"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   X,
//   Upload,
//   Trash2,
//   ChevronDown,
//   Calendar,
//   AlertCircle,
//   Image as ImageIcon,
//   User,
//   Camera,
//   Scissors,
//   Save,
//   BookmarkPlus,
//   Eye
// } from "lucide-react";
// import { fetchAllCategories } from "../../../features/category/categorySlice";
// import { fetchItems } from "../../../features/item/itemSlice";
// import { fetchAllSizeFields } from "../../../features/sizeField/sizeFieldSlice";
// import { fetchAllTemplates } from "../../../features/sizeTemplate/sizeTemplateSlice";
// import { fetchAllFabrics } from "../../../features/fabric/fabricSlice";
// import { 
//   saveMeasurementTemplate,
//   fetchCustomerTemplates 
// } from "../../../features/customer/customerSlice";
// import showToast from "../../../utils/toast";

// export default function GarmentForm({ onClose, onSave, editingGarment, customerId }) {
//   const dispatch = useDispatch();
  
//   const { categories } = useSelector((state) => state.category);
//   const { items } = useSelector((state) => state.item);
//   const { fields } = useSelector((state) => state.sizeField);
//   const { templates } = useSelector((state) => state.sizeTemplate);
//   const { fabrics } = useSelector((state) => state.fabric);
//   const { user } = useSelector((state) => state.auth);
//   const { currentCustomer, customerTemplates, templatesLoading } = useSelector((state) => state.customer);

//   // ✅ Get user role for permissions
//   const userRole = user?.role;
//   const isAdmin = userRole === "ADMIN";
//   const isStoreKeeper = userRole === "STORE_KEEPER";
//   const canEdit = isAdmin || isStoreKeeper;

//   // ✅ Determine which customer ID to use (prop takes priority)
//   const effectiveCustomerId = customerId || currentCustomer?._id;

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     item: "",
//     measurementTemplate: "",
//     measurementSource: "template",
//     measurements: [],
//     studioImages: [],
//     customerProvidedImages: [],
//     customerClothImages: [],
//     additionalInfo: "",
//     estimatedDelivery: "",
//     priority: "normal",
//     priceRange: {
//       min: "",
//       max: "",
//     },
//     fabricSource: "customer",
//     selectedFabric: "",
//     fabricMeters: "",
//     fabricPrice: 0,
    
//     // ✅ New fields for storing names
//     categoryName: "",
//     itemName: "",
//   });

//   const [selectedFields, setSelectedFields] = useState({});
//   const [manualMeasurements, setManualMeasurements] = useState({});
//   const [previewImages, setPreviewImages] = useState({
//     studio: [],
//     customerProvided: [],
//     customerCloth: [],
//   });
//   const [loading, setLoading] = useState(false);
  
//   // State for save template modal
//   const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
//   const [templateName, setTemplateName] = useState("");
//   const [selectedCustomerTemplate, setSelectedCustomerTemplate] = useState("");

//   // ==================== LOAD DATA ON MOUNT ====================
//   useEffect(() => {
//     dispatch(fetchAllCategories());
//     dispatch(fetchAllSizeFields());
//     dispatch(fetchAllTemplates({ page: 1, search: "" }));
//     dispatch(fetchAllFabrics());
//   }, [dispatch]);

//   // ✅ Load customer templates when effectiveCustomerId changes
//   useEffect(() => {
//     if (effectiveCustomerId) {
//       console.log(`📋 Fetching templates for customer: ${effectiveCustomerId}`);
//       dispatch(fetchCustomerTemplates(effectiveCustomerId));
//     }
//   }, [dispatch, effectiveCustomerId]);

//   // Load items when category changes
//   useEffect(() => {
//     if (formData.category) {
//       dispatch(fetchItems(formData.category));
//     }
//   }, [dispatch, formData.category]);

//   // ✅ Auto-fill category name when category changes
//   useEffect(() => {
//     if (formData.category && categories) {
//       const selectedCategory = categories.find(cat => cat._id === formData.category);
//       if (selectedCategory) {
//         setFormData(prev => ({
//           ...prev,
//           categoryName: selectedCategory.name || selectedCategory.categoryName || ""
//         }));
//       }
//     }
//   }, [formData.category, categories]);

//   // ✅ Auto-fill item name and price range when item is selected
//   useEffect(() => {
//     if (formData.item && items) {
//       const selectedItem = items.find(item => item._id === formData.item);
//       if (selectedItem) {
//         setFormData(prev => ({
//           ...prev,
//           itemName: selectedItem.name || selectedItem.itemName || "",
//           priceRange: {
//             min: selectedItem.priceRange?.min || "",
//             max: selectedItem.priceRange?.max || "",
//           }
//         }));
//       }
//     }
//   }, [formData.item, items]);

//   // Calculate fabric price
//   useEffect(() => {
//     if (formData.fabricSource === "shop" && formData.selectedFabric && formData.fabricMeters) {
//       const selectedFabric = fabrics?.find(f => f._id === formData.selectedFabric);
//       if (selectedFabric) {
//         const pricePerMeter = selectedFabric.pricePerMeter || 0;
//         const meters = parseFloat(formData.fabricMeters) || 0;
//         const fabricPrice = pricePerMeter * meters;
        
//         setFormData(prev => ({
//           ...prev,
//           fabricPrice: fabricPrice
//         }));
//       }
//     } else if (formData.fabricSource === "customer") {
//       setFormData(prev => ({
//         ...prev,
//         fabricPrice: 0,
//         selectedFabric: "",
//         fabricMeters: ""
//       }));
//     }
//   }, [formData.fabricSource, formData.selectedFabric, formData.fabricMeters, fabrics]);

//   // Load template measurements
//   useEffect(() => {
//     if (formData.measurementTemplate && formData.measurementSource === "template") {
//       const template = templates?.find(t => t._id === formData.measurementTemplate);
//       if (template) {
//         const measurements = template.sizeFields.map(field => ({
//           name: field.name,
//           value: "",
//           unit: "inches",
//         }));
//         setFormData(prev => ({ ...prev, measurements }));
        
//         const selected = {};
//         template.sizeFields.forEach(field => {
//           selected[field.name] = true;
//         });
//         setSelectedFields(selected);
//       }
//     }
//   }, [formData.measurementTemplate, templates]);

//   // ✅ Load customer saved template when selected
//   useEffect(() => {
//     if (formData.measurementSource === "customer" && selectedCustomerTemplate) {
//       const template = customerTemplates?.find(t => t._id === selectedCustomerTemplate);
//       if (template) {
//         const measurements = [];
//         const manual = {};
        
//         // Handle both Map object and regular object
//         if (template.measurements instanceof Map) {
//           template.measurements.forEach((value, key) => {
//             measurements.push({
//               name: key,
//               value: value,
//               unit: "inches"
//             });
//             manual[key] = value;
//           });
//         } else {
//           // Regular object
//           Object.entries(template.measurements).forEach(([key, value]) => {
//             measurements.push({
//               name: key,
//               value: value,
//               unit: "inches"
//             });
//             manual[key] = value;
//           });
//         }
        
//         setFormData(prev => ({
//           ...prev,
//           measurements: measurements
//         }));
        
//         setManualMeasurements(manual);
        
//         showToast.success(`✅ Loaded template: ${template.name}`);
//       }
//     }
//   }, [selectedCustomerTemplate, customerTemplates]);

//   // ✅ Load editing data with category and item names
//   useEffect(() => {
//     if (editingGarment) {
//       setFormData({
//         name: editingGarment.name || "",
//         category: editingGarment.category?._id || editingGarment.category || "",
//         item: editingGarment.item?._id || editingGarment.item || "",
//         categoryName: editingGarment.categoryName || editingGarment.category?.name || "",
//         itemName: editingGarment.itemName || editingGarment.item?.name || "",
//         measurementTemplate: editingGarment.measurementTemplate?._id || editingGarment.measurementTemplate || "",
//         measurementSource: editingGarment.measurementSource || "template",
//         measurements: editingGarment.measurements || [],
//         studioImages: editingGarment.referenceImages || [],
//         customerProvidedImages: editingGarment.customerImages || [],
//         customerClothImages: editingGarment.customerClothImages || [],
//         additionalInfo: editingGarment.additionalInfo || "",
//         estimatedDelivery: editingGarment.estimatedDelivery?.split("T")[0] || "",
//         priority: editingGarment.priority || "normal",
//         priceRange: editingGarment.priceRange || { min: "", max: "" },
//         fabricSource: editingGarment.fabricSource || "customer",
//         selectedFabric: editingGarment.selectedFabric || "",
//         fabricMeters: editingGarment.fabricMeters || "",
//         fabricPrice: editingGarment.fabricPrice || 0,
//       });

//       // Set preview for existing images
//       const studioPreviews = (editingGarment.referenceImages || []).map(img => ({
//         preview: img.url || img,
//         file: null,
//         isExisting: true,
//         url: img.url,
//         key: img.key
//       }));
      
//       const customerPreviews = (editingGarment.customerImages || []).map(img => ({
//         preview: img.url || img,
//         file: null,
//         isExisting: true,
//         url: img.url,
//         key: img.key
//       }));

//       const clothPreviews = (editingGarment.customerClothImages || []).map(img => ({
//         preview: img.url || img,
//         file: null,
//         isExisting: true,
//         url: img.url,
//         key: img.key
//       }));

//       setPreviewImages({
//         studio: studioPreviews,
//         customerProvided: customerPreviews,
//         customerCloth: clothPreviews,
//       });

//       // Set selected fields for measurements
//       if (editingGarment.measurements) {
//         const selected = {};
//         editingGarment.measurements.forEach(m => {
//           selected[m.name] = true;
//         });
//         setSelectedFields(selected);
//       }

//       // Set manual measurements if source is customer
//       if (editingGarment.measurementSource === "customer" && editingGarment.measurements) {
//         const manual = {};
//         editingGarment.measurements.forEach(m => {
//           manual[m.name] = m.value;
//         });
//         setManualMeasurements(manual);
//       }
//     }
//   }, [editingGarment]);

//   // ==================== IMAGE HANDLERS ====================
//   const handleImageChange = (e, type) => {
//     const files = Array.from(e.target.files);
    
//     // Validate file size (max 5MB each)
//     const invalidFiles = files.filter(f => f.size > 5 * 1024 * 1024);
//     if (invalidFiles.length > 0) {
//       showToast.error("Some images exceed 5MB limit");
//       return;
//     }

//     // Validate file types
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
//     const invalidTypes = files.filter(f => !validTypes.includes(f.type));
//     if (invalidTypes.length > 0) {
//       showToast.error("Please upload only JPG, PNG or WEBP images");
//       return;
//     }

//     // Create preview URLs
//     const newPreviews = files.map(file => ({
//       file,
//       preview: URL.createObjectURL(file),
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       isExisting: false,
//     }));

//     setPreviewImages(prev => ({
//       ...prev,
//       [type]: [...prev[type], ...newPreviews],
//     }));

//     // Store actual files in formData
//     let imageField;
//     switch(type) {
//       case "studio":
//         imageField = "studioImages";
//         break;
//       case "customerProvided":
//         imageField = "customerProvidedImages";
//         break;
//       case "customerCloth":
//         imageField = "customerClothImages";
//         break;
//       default:
//         return;
//     }
    
//     const existingFiles = formData[imageField] || [];
    
//     setFormData(prev => ({
//       ...prev,
//       [imageField]: [
//         ...existingFiles,
//         ...files,
//       ],
//     }));
//   };

//   const removeImage = (index, type) => {
//     // Clean up preview URL
//     const imageToRemove = previewImages[type][index];
//     if (imageToRemove.preview && imageToRemove.preview.startsWith('blob:')) {
//       URL.revokeObjectURL(imageToRemove.preview);
//     }

//     setPreviewImages(prev => ({
//       ...prev,
//       [type]: prev[type].filter((_, i) => i !== index),
//     }));

//     let imageField;
//     switch(type) {
//       case "studio":
//         imageField = "studioImages";
//         break;
//       case "customerProvided":
//         imageField = "customerProvidedImages";
//         break;
//       case "customerCloth":
//         imageField = "customerClothImages";
//         break;
//       default:
//         return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       [imageField]: prev[imageField].filter((_, i) => i !== index),
//     }));
//   };

//   // ==================== MEASUREMENT HANDLERS ====================
//   const handleMeasurementToggle = (field) => {
//     setSelectedFields(prev => ({
//       ...prev,
//       [field.name]: !prev[field.name],
//     }));

//     if (!selectedFields[field.name]) {
//       setFormData(prev => ({
//         ...prev,
//         measurements: [
//           ...prev.measurements,
//           { name: field.name, value: "", unit: field.unit || "inches" },
//         ],
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         measurements: prev.measurements.filter(m => m.name !== field.name),
//       }));
//     }
//   };

//   const handleMeasurementChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       measurements: prev.measurements.map(m =>
//         m.name === name ? { ...m, value: parseFloat(value) || "" } : m
//       ),
//     }));
//   };

//   const handleManualMeasurementChange = (name, value) => {
//     setManualMeasurements(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ==================== TEMPLATE HANDLERS ====================
//   const handleSaveAsTemplate = () => {
//     if (!effectiveCustomerId) {
//       showToast.error("No customer selected to save template");
//       return;
//     }

//     // Get current measurements based on source
//     let currentMeasurements = {};
    
//     if (formData.measurementSource === "template") {
//       formData.measurements.forEach(m => {
//         if (m.value) {
//           currentMeasurements[m.name] = parseFloat(m.value);
//         }
//       });
//     } else {
//       currentMeasurements = manualMeasurements;
//     }

//     // Filter out empty values
//     currentMeasurements = Object.fromEntries(
//       Object.entries(currentMeasurements).filter(([_, value]) => value && value > 0)
//     );

//     if (Object.keys(currentMeasurements).length === 0) {
//       showToast.error("No measurements entered to save");
//       return;
//     }

//     setShowSaveTemplateModal(true);
//   };

//   const confirmSaveTemplate = async () => {
//     if (!templateName.trim()) {
//       showToast.error("Please enter a template name");
//       return;
//     }

//     if (!effectiveCustomerId) {
//       showToast.error("Customer ID missing");
//       setShowSaveTemplateModal(false);
//       return;
//     }

//     // Get current measurements
//     let currentMeasurements = {};
    
//     if (formData.measurementSource === "template") {
//       formData.measurements.forEach(m => {
//         if (m.value) {
//           currentMeasurements[m.name] = parseFloat(m.value);
//         }
//       });
//     } else {
//       currentMeasurements = manualMeasurements;
//     }

//     // Filter out empty values
//     currentMeasurements = Object.fromEntries(
//       Object.entries(currentMeasurements).filter(([_, value]) => value && value > 0)
//     );

//     const templateData = {
//       templateName: templateName.trim(),
//       measurements: currentMeasurements,
//       garmentReference: editingGarment?._id || null,
//       notes: `Saved from ${formData.name} garment`
//     };

//     try {
//       await dispatch(saveMeasurementTemplate({
//         customerId: effectiveCustomerId,
//         templateData
//       })).unwrap();
      
//       setShowSaveTemplateModal(false);
//       setTemplateName("");
//       showToast.success(`✅ Template "${templateName}" saved successfully!`);
      
//       // Refresh templates list
//       dispatch(fetchCustomerTemplates(effectiveCustomerId));
//     } catch (error) {
//       console.error("❌ Error saving template:", error);
//     }
//   };

//   // ==================== PRICE CALCULATION ====================
//   const getTotalPrices = () => {
//     const itemMin = parseFloat(formData.priceRange.min) || 0;
//     const itemMax = parseFloat(formData.priceRange.max) || 0;
//     const fabricPrice = formData.fabricPrice || 0;
    
//     return {
//       totalMin: itemMin + fabricPrice,
//       totalMax: itemMax + fabricPrice,
//     };
//   };

//   // ==================== SUBMIT HANDLER ====================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validation
//     if (!formData.name) {
//       showToast.error("Garment name is required");
//       setLoading(false);
//       return;
//     }

//     if (!formData.category) {
//       showToast.error("Please select a category");
//       setLoading(false);
//       return;
//     }

//     if (!formData.item) {
//       showToast.error("Please select an item");
//       setLoading(false);
//       return;
//     }

//     if (!formData.estimatedDelivery) {
//       showToast.error("Please select estimated delivery date");
//       setLoading(false);
//       return;
//     }

//     if (!formData.priceRange.min || !formData.priceRange.max) {
//       showToast.error("Please enter price range");
//       setLoading(false);
//       return;
//     }

//     if (parseInt(formData.priceRange.min) > parseInt(formData.priceRange.max)) {
//       showToast.error("Minimum price cannot be greater than maximum price");
//       setLoading(false);
//       return;
//     }

//     if (formData.fabricSource === "shop") {
//       if (!formData.selectedFabric) {
//         showToast.error("Please select a fabric");
//         setLoading(false);
//         return;
//       }
//       if (!formData.fabricMeters || parseFloat(formData.fabricMeters) <= 0) {
//         showToast.error("Please enter valid fabric meters");
//         setLoading(false);
//         return;
//       }
//     }

//     if (formData.measurementSource === "template" && formData.measurements.length === 0) {
//       showToast.error("Please select at least one measurement");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Prepare final measurements
//       let finalMeasurements = formData.measurements;
//       if (formData.measurementSource === "customer") {
//         finalMeasurements = Object.entries(manualMeasurements)
//           .filter(([_, value]) => value)
//           .map(([name, value]) => ({
//             name,
//             value: parseFloat(value),
//             unit: "inches",
//           }));
//       }

//       // Create FormData
//       const formDataToSend = new FormData();

//       // Add text fields (including categoryName and itemName)
//       formDataToSend.append("name", formData.name);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("item", formData.item);
//       formDataToSend.append("categoryName", formData.categoryName || "");
//       formDataToSend.append("itemName", formData.itemName || "");
//       formDataToSend.append("measurementTemplate", formData.measurementTemplate || "");
//       formDataToSend.append("measurementSource", formData.measurementSource);
//       formDataToSend.append("measurements", JSON.stringify(finalMeasurements));
//       formDataToSend.append("additionalInfo", formData.additionalInfo || "");
//       formDataToSend.append("estimatedDelivery", formData.estimatedDelivery);
//       formDataToSend.append("priority", formData.priority);
//       formDataToSend.append("priceRange", JSON.stringify(formData.priceRange));

//       // Add fabric data
//       formDataToSend.append("fabricSource", formData.fabricSource);
//       if (formData.fabricSource === "shop") {
//         formDataToSend.append("selectedFabric", formData.selectedFabric);
//         formDataToSend.append("fabricMeters", formData.fabricMeters);
//         formDataToSend.append("fabricPrice", formData.fabricPrice);
//       } else {
//         formDataToSend.append("fabricPrice", "0");
//       }

//       // Add images
//       if (formData.studioImages && formData.studioImages.length > 0) {
//         for (const file of formData.studioImages) {
//           if (file instanceof File) {
//             formDataToSend.append("referenceImages", file);
//           }
//         }
//       }

//       if (formData.customerProvidedImages && formData.customerProvidedImages.length > 0) {
//         for (const file of formData.customerProvidedImages) {
//           if (file instanceof File) {
//             formDataToSend.append("customerImages", file);
//           }
//         }
//       }

//       if (formData.customerClothImages && formData.customerClothImages.length > 0) {
//         for (const file of formData.customerClothImages) {
//           if (file instanceof File) {
//             formDataToSend.append("customerClothImages", file);
//           }
//         }
//       }

//       // Clean up blob URLs
//       Object.values(previewImages).flat().forEach(img => {
//         if (img.preview && img.preview.startsWith('blob:')) {
//           URL.revokeObjectURL(img.preview);
//         }
//       });

//       // Call onSave with FormData
//       onSave(formDataToSend);

//     } catch (error) {
//       console.error("❌ Error preparing form data:", error);
//       showToast.error("Failed to prepare garment data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Group size fields by category
//   const groupedFields = fields?.reduce((acc, field) => {
//     if (!acc[field.category]) acc[field.category] = [];
//     acc[field.category].push(field);
//     return acc;
//   }, {});

//   const categoryTitles = {
//     upper: "Upper Body Measurements",
//     lower: "Lower Body Measurements",
//     full: "Full Body Measurements",
//     other: "Other Measurements",
//   };

//   const totals = getTotalPrices();

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
//       <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
//           <h2 className="text-xl font-black text-white">
//             {editingGarment ? "Edit Garment" : "Add New Garment"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/20 rounded-lg transition-all"
//           >
//             <X size={20} className="text-white" />
//           </button>
//         </div>

//         {/* Form - Scrollable */}
//         <div className="flex-1 overflow-y-auto p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <h3 className="font-black text-slate-800 mb-4">Basic Information</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Garment Name */}
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Garment Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     placeholder="e.g., Men's Formal Shirt"
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     required
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => setFormData({ 
//                       ...formData, 
//                       category: e.target.value,
//                       item: "",
//                       itemName: ""
//                     })}
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories?.map((cat) => (
//                       <option key={cat._id} value={cat._id}>{cat.name}</option>
//                     ))}
//                   </select>
                  
//                   {/* ✅ Display selected category name */}
//                   {formData.categoryName && (
//                     <p className="text-xs text-green-600 mt-1">
//                       Selected: {formData.categoryName}
//                     </p>
//                   )}
//                 </div>

//                 {/* Item */}
//                 <div>
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Item <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.item}
//                     onChange={(e) => setFormData({ ...formData, item: e.target.value })}
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     required
//                     disabled={!formData.category}
//                   >
//                     <option value="">Select Item</option>
//                     {items?.map((item) => (
//                       <option key={item._id} value={item._id}>
//                         {item.name} {item.priceRange ? `(₹${item.priceRange.min} - ₹${item.priceRange.max})` : ''}
//                       </option>
//                     ))}
//                   </select>
                  
//                   {/* ✅ Display selected item name */}
//                   {formData.itemName && (
//                     <p className="text-xs text-green-600 mt-1">
//                       Selected: {formData.itemName}
//                     </p>
//                   )}
//                 </div>

//                 {/* Priority */}
//                 <div>
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Priority
//                   </label>
//                   <select
//                     value={formData.priority}
//                     onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
//                     className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                   >
//                     <option value="normal">Normal</option>
//                     <option value="high">High</option>
//                     <option value="low">Low</option>
//                   </select>
//                 </div>

//                 {/* Estimated Delivery */}
//                 <div>
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Estimated Delivery <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <Calendar className="absolute left-4 top-3.5 text-slate-400" size={18} />
//                     <input
//                       type="date"
//                       value={formData.estimatedDelivery}
//                       onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
//                       min={new Date().toISOString().split("T")[0]}
//                       className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Fabric Section */}
//             <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-l-blue-500">
//               <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
//                 <Scissors size={20} className="text-blue-600" />
//                 Fabric Details
//               </h3>

//               <div className="flex gap-4 mb-4">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="fabricSource"
//                     value="customer"
//                     checked={formData.fabricSource === "customer"}
//                     onChange={(e) => setFormData({ 
//                       ...formData, 
//                       fabricSource: e.target.value,
//                       selectedFabric: "",
//                       fabricMeters: "",
//                       fabricPrice: 0
//                     })}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Customer Provided (Free)</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="fabricSource"
//                     value="shop"
//                     checked={formData.fabricSource === "shop"}
//                     onChange={(e) => setFormData({ 
//                       ...formData, 
//                       fabricSource: e.target.value 
//                     })}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Shop Provided (Chargeable)</span>
//                 </label>
//               </div>

//               {formData.fabricSource === "shop" && (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Select Fabric <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={formData.selectedFabric}
//                       onChange={(e) => setFormData({ ...formData, selectedFabric: e.target.value })}
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     >
//                       <option value="">Choose Fabric</option>
//                       {fabrics?.map((fabric) => (
//                         <option key={fabric._id} value={fabric._id}>
//                           {fabric.name} - {fabric.color} (₹{fabric.pricePerMeter}/m)
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Meters Required <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.fabricMeters}
//                       onChange={(e) => setFormData({ ...formData, fabricMeters: e.target.value })}
//                       placeholder="e.g., 2.5"
//                       step="0.1"
//                       min="0"
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Fabric Price
//                     </label>
//                     <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-bold">
//                       ₹{formData.fabricPrice.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Price Range & Total Display */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <h3 className="font-black text-slate-800 mb-4">Pricing</h3>
              
//               <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                 <p className="text-xs text-blue-600 font-bold mb-1">Item Price (Auto-filled from selected item)</p>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <span className="text-sm text-slate-600">Min Price:</span>
//                     <span className="ml-2 font-bold text-blue-700">₹{formData.priceRange.min || 0}</span>
//                   </div>
//                   <div>
//                     <span className="text-sm text-slate-600">Max Price:</span>
//                     <span className="ml-2 font-bold text-blue-700">₹{formData.priceRange.max || 0}</span>
//                   </div>
//                 </div>
//               </div>

//               {formData.fabricSource === "shop" && formData.fabricPrice > 0 && (
//                 <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
//                   <p className="text-xs text-green-600 font-bold mb-1">Fabric Price</p>
//                   <div>
//                     <span className="text-sm text-slate-600">Fabric Cost:</span>
//                     <span className="ml-2 font-bold text-green-700">₹{formData.fabricPrice.toFixed(2)}</span>
//                   </div>
//                 </div>
//               )}

//               <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
//                 <p className="text-xs text-purple-600 font-bold mb-2">TOTAL GARMENT PRICE</p>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <span className="text-sm text-slate-600">Min Total:</span>
//                     <span className="ml-2 text-lg font-black text-purple-700">₹{totals.totalMin}</span>
//                   </div>
//                   <div>
//                     <span className="text-sm text-slate-600">Max Total:</span>
//                     <span className="ml-2 text-lg font-black text-purple-700">₹{totals.totalMax}</span>
//                   </div>
//                 </div>
//                 <p className="text-xs text-purple-500 mt-2">
//                   * Final bill will include: Tailoring (₹{formData.priceRange.min} - ₹{formData.priceRange.max}) 
//                   {formData.fabricSource === "shop" && formData.fabricPrice > 0 ? ` + Fabric (₹${formData.fabricPrice})` : ''}
//                 </p>
//               </div>

//               {/* Hidden price inputs */}
//               <div className="hidden">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Minimum Price (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.priceRange.min}
//                       onChange={(e) => setFormData({
//                         ...formData,
//                         priceRange: { ...formData.priceRange, min: e.target.value }
//                       })}
//                       min="0"
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Maximum Price (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.priceRange.max}
//                       onChange={(e) => setFormData({
//                         ...formData,
//                         priceRange: { ...formData.priceRange, max: e.target.value }
//                       })}
//                       min="0"
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Measurement Section */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-black text-slate-800">Measurements</h3>
                
//                 {effectiveCustomerId && (
//                   <button
//                     type="button"
//                     onClick={handleSaveAsTemplate}
//                     className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-all"
//                   >
//                     <BookmarkPlus size={16} />
//                     Save as Template
//                   </button>
//                 )}
//               </div>

//               <div className="flex gap-4 mb-4 flex-wrap">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="measurementSource"
//                     value="template"
//                     checked={formData.measurementSource === "template"}
//                     onChange={(e) => {
//                       setFormData({ ...formData, measurementSource: e.target.value });
//                       setSelectedCustomerTemplate("");
//                     }}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Use Template</span>
//                 </label>
                
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="measurementSource"
//                     value="customer"
//                     checked={formData.measurementSource === "customer"}
//                     onChange={(e) => {
//                       setFormData({ ...formData, measurementSource: e.target.value });
//                     }}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Customer Saved Templates</span>
//                 </label>
                
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="measurementSource"
//                     value="manual"
//                     checked={formData.measurementSource === "manual"}
//                     onChange={(e) => {
//                       setFormData({ ...formData, measurementSource: e.target.value });
//                       setSelectedCustomerTemplate("");
//                     }}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <span className="text-sm font-medium">Manual Entry</span>
//                 </label>
//               </div>

//               {/* Customer Templates Dropdown */}
//               {formData.measurementSource === "customer" && (
//                 <div className="mb-4">
//                   <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                     Select Saved Template
//                   </label>
//                   {!effectiveCustomerId ? (
//                     <p className="text-sm text-amber-600 italic p-3 bg-amber-50 rounded-lg">
//                       Please select a customer first to view saved templates
//                     </p>
//                   ) : templatesLoading ? (
//                     <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
//                       <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
//                       <span className="text-sm text-slate-600">Loading templates...</span>
//                     </div>
//                   ) : customerTemplates?.length > 0 ? (
//                     <select
//                       value={selectedCustomerTemplate}
//                       onChange={(e) => setSelectedCustomerTemplate(e.target.value)}
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     >
//                       <option value="">-- Select a template --</option>
//                       {customerTemplates.map((template) => (
//                         <option key={template._id} value={template._id}>
//                           {template.name} (Used {template.usageCount || 1} times)
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     <p className="text-sm text-slate-500 italic p-3 bg-slate-100 rounded-lg">
//                       No saved templates yet. Create one using "Save as Template" button above.
//                     </p>
//                   )}
//                 </div>
//               )}

//               {formData.measurementSource === "template" && (
//                 <>
//                   <div className="mb-4">
//                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                       Measurement Template
//                     </label>
//                     <select
//                       value={formData.measurementTemplate}
//                       onChange={(e) => setFormData({ ...formData, measurementTemplate: e.target.value })}
//                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                     >
//                       <option value="">Select Template</option>
//                       {templates?.map((template) => (
//                         <option key={template._id} value={template._id}>{template.name}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {formData.measurementTemplate && (
//                     <div className="space-y-4">
//                       {Object.entries(groupedFields || {}).map(([category, categoryFields]) => (
//                         <div key={category}>
//                           <h4 className="font-bold text-slate-700 mb-2">
//                             {categoryTitles[category] || category}
//                           </h4>
//                           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                             {categoryFields.map((field) => (
//                               <label
//                                 key={field._id}
//                                 className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
//                                   selectedFields[field.name]
//                                     ? "border-blue-500 bg-blue-50"
//                                     : "border-slate-200 hover:border-blue-200"
//                                 }`}
//                               >
//                                 <input
//                                   type="checkbox"
//                                   className="hidden"
//                                   checked={selectedFields[field.name] || false}
//                                   onChange={() => handleMeasurementToggle(field)}
//                                 />
//                                 <span className="text-sm">{field.displayName}</span>
//                               </label>
//                             ))}
//                           </div>
//                         </div>
//                       ))}

//                       {formData.measurements.length > 0 && (
//                         <div className="mt-4 space-y-3">
//                           <h4 className="font-bold text-slate-700">Enter Values</h4>
//                           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                             {formData.measurements.map((measurement) => (
//                               <div key={measurement.name}>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1">
//                                   {measurement.name}
//                                 </label>
//                                 <input
//                                   type="number"
//                                   value={measurement.value}
//                                   onChange={(e) => handleMeasurementChange(measurement.name, e.target.value)}
//                                   placeholder="inches"
//                                   step="0.1"
//                                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </>
//               )}

//               {formData.measurementSource === "customer" && !selectedCustomerTemplate && (
//                 <div className="space-y-3">
//                   <p className="text-sm text-slate-600">Select a template from the dropdown above</p>
//                 </div>
//               )}

//               {formData.measurementSource === "customer" && selectedCustomerTemplate && (
//                 <div className="space-y-3">
//                   <p className="text-sm text-green-600 font-medium flex items-center gap-2">
//                     <span className="w-2 h-2 bg-green-600 rounded-full"></span>
//                     Template loaded - you can edit values if needed
//                   </p>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {formData.measurements.map((measurement) => (
//                       <div key={measurement.name}>
//                         <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">
//                           {measurement.name}
//                         </label>
//                         <input
//                           type="number"
//                           value={measurement.value}
//                           onChange={(e) => handleMeasurementChange(measurement.name, e.target.value)}
//                           step="0.1"
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {formData.measurementSource === "manual" && (
//                 <div className="space-y-3">
//                   <p className="text-sm text-slate-600">Enter measurements manually</p>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {fields?.map((field) => (
//                       <div key={field._id}>
//                         <label className="block text-xs font-medium text-slate-600 mb-1">
//                           {field.displayName}
//                         </label>
//                         <input
//                           type="number"
//                           value={manualMeasurements[field.name] || ""}
//                           onChange={(e) => handleManualMeasurementChange(field.name, e.target.value)}
//                           placeholder={field.unit}
//                           step="0.1"
//                           className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* IMAGES SECTION */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
//                 <Camera size={20} className="text-blue-600" />
//                 Garment Images
//               </h3>

//               {/* Studio/Reference Images */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
//                     <ImageIcon size={16} className="text-indigo-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-slate-800">Studio Reference Images</h4>
//                     <p className="text-xs text-slate-500">Designer images, style references, inspiration</p>
//                   </div>
//                 </div>
                
//                 <div className="border-2 border-dashed border-slate-300 rounded-xl p-4">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     {previewImages.studio.map((img, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={img.preview}
//                           alt={`Studio ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg"
//                         />
//                         {!img.isExisting && (
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index, "studio")}
//                             className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <Trash2 size={12} />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <label className="border-2 border-dashed border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
//                       <Upload size={24} className="text-slate-400 mb-1" />
//                       <span className="text-xs text-slate-500">Upload</span>
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageChange(e, "studio")}
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-slate-400">Max 5MB per image. JPG, PNG, WEBP only.</p>
//                 </div>
//               </div>

//               {/* Customer Provided Images (Digital) */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                     <User size={16} className="text-green-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-slate-800">Customer Digital Images</h4>
//                     <p className="text-xs text-slate-500">Photos sent by customer via WhatsApp/email</p>
//                   </div>
//                 </div>

//                 <div className="border-2 border-dashed border-slate-300 rounded-xl p-4">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     {previewImages.customerProvided.map((img, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={img.preview}
//                           alt={`Customer Digital ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg"
//                         />
//                         {!img.isExisting && (
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index, "customerProvided")}
//                             className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <Trash2 size={12} />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <label className="border-2 border-dashed border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
//                       <Upload size={24} className="text-slate-400 mb-1" />
//                       <span className="text-xs text-slate-500">Upload</span>
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageChange(e, "customerProvided")}
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-slate-400">Max 5MB per image. JPG, PNG, WEBP only.</p>
//                 </div>
//               </div>

//               {/* Customer Physical Cloth Images */}
//               <div>
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
//                     <Scissors size={16} className="text-orange-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-slate-800">Customer's Reference Cloth</h4>
//                     <p className="text-xs text-slate-500">Photos of physical cloth/design given by customer - for color, fabric, and design reference</p>
//                   </div>
//                 </div>

//                 <div className="border-2 border-dashed border-orange-200 bg-orange-50/30 rounded-xl p-4">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     {previewImages.customerCloth.map((img, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={img.preview}
//                           alt={`Customer Cloth ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg border-2 border-orange-200"
//                         />
//                         {!img.isExisting && (
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index, "customerCloth")}
//                             className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <Trash2 size={12} />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <label className="border-2 border-dashed border-orange-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 transition-all">
//                       <Upload size={24} className="text-orange-400 mb-1" />
//                       <span className="text-xs text-orange-600 font-medium">Upload Cloth Photo</span>
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageChange(e, "customerCloth")}
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-orange-600">
//                     <span className="font-bold">Important:</span> Upload photos of the actual cloth/design given by customer. 
//                     This helps in matching color, fabric texture, and design details.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Additional Info */}
//             <div className="bg-slate-50 rounded-xl p-4">
//               <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                 Additional Information
//               </label>
//               <textarea
//                 value={formData.additionalInfo}
//                 onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
//                 rows="3"
//                 placeholder="Any special instructions or notes about this garment..."
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
//               />
//             </div>

//             {/* Form Actions */}
//             <div className="flex gap-3 pt-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all ${
//                   loading ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {loading ? 'Processing...' : (editingGarment ? "Update Garment" : "Add Garment")}
//               </button>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-black hover:bg-slate-300 transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Save Template Modal */}
//       {showSaveTemplateModal && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
//             <div className="p-6">
//               <h3 className="text-xl font-black text-slate-800 mb-2">Save as Template</h3>
//               <p className="text-sm text-slate-500 mb-4">
//                 Save these measurements as a template for future use
//               </p>

//               <div className="mb-4">
//                 <label className="block text-xs font-black uppercase text-slate-500 mb-2">
//                   Template Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={templateName}
//                   onChange={(e) => setTemplateName(e.target.value)}
//                   placeholder="e.g., Father Shirt Size, Brother Kurta"
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//                   autoFocus
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={confirmSaveTemplate}
//                   className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black transition-all"
//                 >
//                   Save Template
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowSaveTemplateModal(false);
//                     setTemplateName("");
//                   }}
//                   className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-black transition-all"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Upload,
  Trash2,
  ChevronDown,
  Calendar,
  AlertCircle,
  Image as ImageIcon,
  User,
  Camera,
  Scissors,
  Save,
  BookmarkPlus,
  Eye
} from "lucide-react";
import { fetchAllCategories } from "../../../features/category/categorySlice";
import { fetchItems } from "../../../features/item/itemSlice";
import { fetchAllSizeFields } from "../../../features/sizeField/sizeFieldSlice";
import { fetchAllTemplates } from "../../../features/sizeTemplate/sizeTemplateSlice";
import { fetchAllFabrics } from "../../../features/fabric/fabricSlice";
import { 
  saveMeasurementTemplate,
  fetchCustomerTemplates 
} from "../../../features/customer/customerSlice";
// 📅 NEW: Import calendar functions and selectors
import { 
  fetchCustomerOrderDates, 
  selectCustomerOrderDates, 
  selectGarmentCalendarLoading 
} from "../../../features/garment/garmentSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import showToast from "../../../utils/toast";

export default function GarmentForm({ onClose, onSave, editingGarment, customerId }) {
  const dispatch = useDispatch();
  
  const { categories } = useSelector((state) => state.category);
  const { items } = useSelector((state) => state.item);
  const { fields } = useSelector((state) => state.sizeField);
  const { templates } = useSelector((state) => state.sizeTemplate);
  const { fabrics } = useSelector((state) => state.fabric);
  const { user } = useSelector((state) => state.auth);
  const { currentCustomer, customerTemplates, templatesLoading } = useSelector((state) => state.customer);

  // 📅 NEW: Calendar state from Redux
  const customerOrderDates = useSelector(selectCustomerOrderDates);
  const calendarLoading = useSelector(selectGarmentCalendarLoading);

  // ✅ Get user role for permissions
  const userRole = user?.role;
  const isAdmin = userRole === "ADMIN";
  const isStoreKeeper = userRole === "STORE_KEEPER";
  const canEdit = isAdmin || isStoreKeeper;

  // ✅ Determine which customer ID to use (prop takes priority)
  const effectiveCustomerId = customerId || currentCustomer?._id;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    item: "",
    measurementTemplate: "",
    measurementSource: "template",
    measurements: [],
    studioImages: [],
    customerProvidedImages: [],
    customerClothImages: [],
    additionalInfo: "",
    estimatedDelivery: "",
    priority: "normal",
    priceRange: {
      min: "",
      max: "",
    },
    fabricSource: "customer",
    selectedFabric: "",
    fabricMeters: "",
    fabricPrice: 0,
    
    // ✅ New fields for storing names
    categoryName: "",
    itemName: "",
  });

  const [selectedFields, setSelectedFields] = useState({});
  const [manualMeasurements, setManualMeasurements] = useState({});
  const [previewImages, setPreviewImages] = useState({
    studio: [],
    customerProvided: [],
    customerCloth: [],
  });
  const [loading, setLoading] = useState(false);
  
  // 📅 NEW: Calendar state
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);
  
  // State for save template modal
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [selectedCustomerTemplate, setSelectedCustomerTemplate] = useState("");

  // ==================== LOAD DATA ON MOUNT ====================
  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllSizeFields());
    dispatch(fetchAllTemplates({ page: 1, search: "" }));
    dispatch(fetchAllFabrics());
  }, [dispatch]);

  // ✅ Load customer templates when effectiveCustomerId changes
  useEffect(() => {
    if (effectiveCustomerId) {
      console.log(`📋 Fetching templates for customer: ${effectiveCustomerId}`);
      dispatch(fetchCustomerTemplates(effectiveCustomerId));
    }
  }, [dispatch, effectiveCustomerId]);

  // 📅 NEW: Fetch customer order dates when month changes
  useEffect(() => {
    if (effectiveCustomerId) {
      const month = currentMonth.getMonth();
      const year = currentMonth.getFullYear();
      
      console.log(`📅 Fetching order dates for customer: ${effectiveCustomerId}, month: ${month}, year: ${year}`);
      dispatch(fetchCustomerOrderDates({ customerId: effectiveCustomerId, month, year }));
    }
  }, [dispatch, effectiveCustomerId, currentMonth]);

  // 📅 NEW: Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load items when category changes
  useEffect(() => {
    if (formData.category) {
      dispatch(fetchItems(formData.category));
    }
  }, [dispatch, formData.category]);

  // ✅ Auto-fill category name when category changes
  useEffect(() => {
    if (formData.category && categories) {
      const selectedCategory = categories.find(cat => cat._id === formData.category);
      if (selectedCategory) {
        setFormData(prev => ({
          ...prev,
          categoryName: selectedCategory.name || selectedCategory.categoryName || ""
        }));
      }
    }
  }, [formData.category, categories]);

  // ✅ Auto-fill item name and price range when item is selected
  useEffect(() => {
    if (formData.item && items) {
      const selectedItem = items.find(item => item._id === formData.item);
      if (selectedItem) {
        setFormData(prev => ({
          ...prev,
          itemName: selectedItem.name || selectedItem.itemName || "",
          priceRange: {
            min: selectedItem.priceRange?.min || "",
            max: selectedItem.priceRange?.max || "",
          }
        }));
      }
    }
  }, [formData.item, items]);

  // Calculate fabric price
  useEffect(() => {
    if (formData.fabricSource === "shop" && formData.selectedFabric && formData.fabricMeters) {
      const selectedFabric = fabrics?.find(f => f._id === formData.selectedFabric);
      if (selectedFabric) {
        const pricePerMeter = selectedFabric.pricePerMeter || 0;
        const meters = parseFloat(formData.fabricMeters) || 0;
        const fabricPrice = pricePerMeter * meters;
        
        setFormData(prev => ({
          ...prev,
          fabricPrice: fabricPrice
        }));
      }
    } else if (formData.fabricSource === "customer") {
      setFormData(prev => ({
        ...prev,
        fabricPrice: 0,
        selectedFabric: "",
        fabricMeters: ""
      }));
    }
  }, [formData.fabricSource, formData.selectedFabric, formData.fabricMeters, fabrics]);

  // Load template measurements
  useEffect(() => {
    if (formData.measurementTemplate && formData.measurementSource === "template") {
      const template = templates?.find(t => t._id === formData.measurementTemplate);
      if (template) {
        const measurements = template.sizeFields.map(field => ({
          name: field.name,
          value: "",
          unit: "inches",
        }));
        setFormData(prev => ({ ...prev, measurements }));
        
        const selected = {};
        template.sizeFields.forEach(field => {
          selected[field.name] = true;
        });
        setSelectedFields(selected);
      }
    }
  }, [formData.measurementTemplate, templates]);

  // ✅ Load customer saved template when selected
  useEffect(() => {
    if (formData.measurementSource === "customer" && selectedCustomerTemplate) {
      const template = customerTemplates?.find(t => t._id === selectedCustomerTemplate);
      if (template) {
        const measurements = [];
        const manual = {};
        
        // Handle both Map object and regular object
        if (template.measurements instanceof Map) {
          template.measurements.forEach((value, key) => {
            measurements.push({
              name: key,
              value: value,
              unit: "inches"
            });
            manual[key] = value;
          });
        } else {
          // Regular object
          Object.entries(template.measurements).forEach(([key, value]) => {
            measurements.push({
              name: key,
              value: value,
              unit: "inches"
            });
            manual[key] = value;
          });
        }
        
        setFormData(prev => ({
          ...prev,
          measurements: measurements
        }));
        
        setManualMeasurements(manual);
        
        showToast.success(`✅ Loaded template: ${template.name}`);
      }
    }
  }, [selectedCustomerTemplate, customerTemplates]);

  // ✅ Load editing data with category and item names
  useEffect(() => {
    if (editingGarment) {
      setFormData({
        name: editingGarment.name || "",
        category: editingGarment.category?._id || editingGarment.category || "",
        item: editingGarment.item?._id || editingGarment.item || "",
        categoryName: editingGarment.categoryName || editingGarment.category?.name || "",
        itemName: editingGarment.itemName || editingGarment.item?.name || "",
        measurementTemplate: editingGarment.measurementTemplate?._id || editingGarment.measurementTemplate || "",
        measurementSource: editingGarment.measurementSource || "template",
        measurements: editingGarment.measurements || [],
        studioImages: editingGarment.referenceImages || [],
        customerProvidedImages: editingGarment.customerImages || [],
        customerClothImages: editingGarment.customerClothImages || [],
        additionalInfo: editingGarment.additionalInfo || "",
        estimatedDelivery: editingGarment.estimatedDelivery?.split("T")[0] || "",
        priority: editingGarment.priority || "normal",
        priceRange: editingGarment.priceRange || { min: "", max: "" },
        fabricSource: editingGarment.fabricSource || "customer",
        selectedFabric: editingGarment.selectedFabric || "",
        fabricMeters: editingGarment.fabricMeters || "",
        fabricPrice: editingGarment.fabricPrice || 0,
      });

      // Set preview for existing images
      const studioPreviews = (editingGarment.referenceImages || []).map(img => ({
        preview: img.url || img,
        file: null,
        isExisting: true,
        url: img.url,
        key: img.key
      }));
      
      const customerPreviews = (editingGarment.customerImages || []).map(img => ({
        preview: img.url || img,
        file: null,
        isExisting: true,
        url: img.url,
        key: img.key
      }));

      const clothPreviews = (editingGarment.customerClothImages || []).map(img => ({
        preview: img.url || img,
        file: null,
        isExisting: true,
        url: img.url,
        key: img.key
      }));

      setPreviewImages({
        studio: studioPreviews,
        customerProvided: customerPreviews,
        customerCloth: clothPreviews,
      });

      // Set selected fields for measurements
      if (editingGarment.measurements) {
        const selected = {};
        editingGarment.measurements.forEach(m => {
          selected[m.name] = true;
        });
        setSelectedFields(selected);
      }

      // Set manual measurements if source is customer
      if (editingGarment.measurementSource === "customer" && editingGarment.measurements) {
        const manual = {};
        editingGarment.measurements.forEach(m => {
          manual[m.name] = m.value;
        });
        setManualMeasurements(manual);
      }
    }
  }, [editingGarment]);

  // ==================== IMAGE HANDLERS ====================
  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    
    // Validate file size (max 5MB each)
    const invalidFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      showToast.error("Some images exceed 5MB limit");
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const invalidTypes = files.filter(f => !validTypes.includes(f.type));
    if (invalidTypes.length > 0) {
      showToast.error("Please upload only JPG, PNG or WEBP images");
      return;
    }

    // Create preview URLs
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      isExisting: false,
    }));

    setPreviewImages(prev => ({
      ...prev,
      [type]: [...prev[type], ...newPreviews],
    }));

    // Store actual files in formData
    let imageField;
    switch(type) {
      case "studio":
        imageField = "studioImages";
        break;
      case "customerProvided":
        imageField = "customerProvidedImages";
        break;
      case "customerCloth":
        imageField = "customerClothImages";
        break;
      default:
        return;
    }
    
    const existingFiles = formData[imageField] || [];
    
    setFormData(prev => ({
      ...prev,
      [imageField]: [
        ...existingFiles,
        ...files,
      ],
    }));
  };

  const removeImage = (index, type) => {
    // Clean up preview URL
    const imageToRemove = previewImages[type][index];
    if (imageToRemove.preview && imageToRemove.preview.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setPreviewImages(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

    let imageField;
    switch(type) {
      case "studio":
        imageField = "studioImages";
        break;
      case "customerProvided":
        imageField = "customerProvidedImages";
        break;
      case "customerCloth":
        imageField = "customerClothImages";
        break;
      default:
        return;
    }

    setFormData(prev => ({
      ...prev,
      [imageField]: prev[imageField].filter((_, i) => i !== index),
    }));
  };

  // ==================== MEASUREMENT HANDLERS ====================
  const handleMeasurementToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field.name]: !prev[field.name],
    }));

    if (!selectedFields[field.name]) {
      setFormData(prev => ({
        ...prev,
        measurements: [
          ...prev.measurements,
          { name: field.name, value: "", unit: field.unit || "inches" },
        ],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        measurements: prev.measurements.filter(m => m.name !== field.name),
      }));
    }
  };

  const handleMeasurementChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      measurements: prev.measurements.map(m =>
        m.name === name ? { ...m, value: parseFloat(value) || "" } : m
      ),
    }));
  };

  const handleManualMeasurementChange = (name, value) => {
    setManualMeasurements(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================== TEMPLATE HANDLERS ====================
  const handleSaveAsTemplate = () => {
    if (!effectiveCustomerId) {
      showToast.error("No customer selected to save template");
      return;
    }

    // Get current measurements based on source
    let currentMeasurements = {};
    
    if (formData.measurementSource === "template") {
      formData.measurements.forEach(m => {
        if (m.value) {
          currentMeasurements[m.name] = parseFloat(m.value);
        }
      });
    } else {
      currentMeasurements = manualMeasurements;
    }

    // Filter out empty values
    currentMeasurements = Object.fromEntries(
      Object.entries(currentMeasurements).filter(([_, value]) => value && value > 0)
    );

    if (Object.keys(currentMeasurements).length === 0) {
      showToast.error("No measurements entered to save");
      return;
    }

    setShowSaveTemplateModal(true);
  };

  const confirmSaveTemplate = async () => {
    if (!templateName.trim()) {
      showToast.error("Please enter a template name");
      return;
    }

    if (!effectiveCustomerId) {
      showToast.error("Customer ID missing");
      setShowSaveTemplateModal(false);
      return;
    }

    // Get current measurements
    let currentMeasurements = {};
    
    if (formData.measurementSource === "template") {
      formData.measurements.forEach(m => {
        if (m.value) {
          currentMeasurements[m.name] = parseFloat(m.value);
        }
      });
    } else {
      currentMeasurements = manualMeasurements;
    }

    // Filter out empty values
    currentMeasurements = Object.fromEntries(
      Object.entries(currentMeasurements).filter(([_, value]) => value && value > 0)
    );

    const templateData = {
      templateName: templateName.trim(),
      measurements: currentMeasurements,
      garmentReference: editingGarment?._id || null,
      notes: `Saved from ${formData.name} garment`
    };

    try {
      await dispatch(saveMeasurementTemplate({
        customerId: effectiveCustomerId,
        templateData
      })).unwrap();
      
      setShowSaveTemplateModal(false);
      setTemplateName("");
      showToast.success(`✅ Template "${templateName}" saved successfully!`);
      
      // Refresh templates list
      dispatch(fetchCustomerTemplates(effectiveCustomerId));
    } catch (error) {
      console.error("❌ Error saving template:", error);
    }
  };

  // ==================== PRICE CALCULATION ====================
  const getTotalPrices = () => {
    const itemMin = parseFloat(formData.priceRange.min) || 0;
    const itemMax = parseFloat(formData.priceRange.max) || 0;
    const fabricPrice = formData.fabricPrice || 0;
    
    return {
      totalMin: itemMin + fabricPrice,
      totalMax: itemMax + fabricPrice,
    };
  };

  // 📅 NEW: Handle date selection from calendar
  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    
    const dateStr = date.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      estimatedDelivery: dateStr
    }));
    
    console.log('📅 Date selected:', dateStr);
  }, []);

  // 📅 NEW: Handle month change in calendar
  const handleMonthChange = useCallback((date) => {
    setCurrentMonth(date);
  }, []);

  // 📅 NEW: Format date for display
  const formatDisplayDate = useCallback((date) => {
    if (!date) return "Select estimated delivery date";
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // 📅 NEW: Green dot render function for customer's order dates
  const renderDayContents = useCallback((day, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const hasCustomerOrders = customerOrderDates.includes(dateStr);
    
    return (
      <div className="relative">
        <div>{day}</div>
        {hasCustomerOrders && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
    );
  }, [customerOrderDates]);

  // ==================== SUBMIT HANDLER ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.name) {
      showToast.error("Garment name is required");
      setLoading(false);
      return;
    }

    if (!formData.category) {
      showToast.error("Please select a category");
      setLoading(false);
      return;
    }

    if (!formData.item) {
      showToast.error("Please select an item");
      setLoading(false);
      return;
    }

    if (!formData.estimatedDelivery) {
      showToast.error("Please select estimated delivery date");
      setLoading(false);
      return;
    }

    if (!formData.priceRange.min || !formData.priceRange.max) {
      showToast.error("Please enter price range");
      setLoading(false);
      return;
    }

    if (parseInt(formData.priceRange.min) > parseInt(formData.priceRange.max)) {
      showToast.error("Minimum price cannot be greater than maximum price");
      setLoading(false);
      return;
    }

    if (formData.fabricSource === "shop") {
      if (!formData.selectedFabric) {
        showToast.error("Please select a fabric");
        setLoading(false);
        return;
      }
      if (!formData.fabricMeters || parseFloat(formData.fabricMeters) <= 0) {
        showToast.error("Please enter valid fabric meters");
        setLoading(false);
        return;
      }
    }

    if (formData.measurementSource === "template" && formData.measurements.length === 0) {
      showToast.error("Please select at least one measurement");
      setLoading(false);
      return;
    }

    try {
      // Prepare final measurements
      let finalMeasurements = formData.measurements;
      if (formData.measurementSource === "customer") {
        finalMeasurements = Object.entries(manualMeasurements)
          .filter(([_, value]) => value)
          .map(([name, value]) => ({
            name,
            value: parseFloat(value),
            unit: "inches",
          }));
      }

      // Create FormData
      const formDataToSend = new FormData();

      // Add text fields (including categoryName and itemName)
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("item", formData.item);
      formDataToSend.append("categoryName", formData.categoryName || "");
      formDataToSend.append("itemName", formData.itemName || "");
      formDataToSend.append("measurementTemplate", formData.measurementTemplate || "");
      formDataToSend.append("measurementSource", formData.measurementSource);
      formDataToSend.append("measurements", JSON.stringify(finalMeasurements));
      formDataToSend.append("additionalInfo", formData.additionalInfo || "");
      formDataToSend.append("estimatedDelivery", formData.estimatedDelivery);
      formDataToSend.append("priority", formData.priority);
      formDataToSend.append("priceRange", JSON.stringify(formData.priceRange));

      // Add fabric data
      formDataToSend.append("fabricSource", formData.fabricSource);
      if (formData.fabricSource === "shop") {
        formDataToSend.append("selectedFabric", formData.selectedFabric);
        formDataToSend.append("fabricMeters", formData.fabricMeters);
        formDataToSend.append("fabricPrice", formData.fabricPrice);
      } else {
        formDataToSend.append("fabricPrice", "0");
      }

      // Add images
      if (formData.studioImages && formData.studioImages.length > 0) {
        for (const file of formData.studioImages) {
          if (file instanceof File) {
            formDataToSend.append("referenceImages", file);
          }
        }
      }

      if (formData.customerProvidedImages && formData.customerProvidedImages.length > 0) {
        for (const file of formData.customerProvidedImages) {
          if (file instanceof File) {
            formDataToSend.append("customerImages", file);
          }
        }
      }

      if (formData.customerClothImages && formData.customerClothImages.length > 0) {
        for (const file of formData.customerClothImages) {
          if (file instanceof File) {
            formDataToSend.append("customerClothImages", file);
          }
        }
      }

      // Clean up blob URLs
      Object.values(previewImages).flat().forEach(img => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });

      // Call onSave with FormData
      onSave(formDataToSend);

    } catch (error) {
      console.error("❌ Error preparing form data:", error);
      showToast.error("Failed to prepare garment data");
    } finally {
      setLoading(false);
    }
  };

  // Group size fields by category
  const groupedFields = fields?.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {});

  const categoryTitles = {
    upper: "Upper Body Measurements",
    lower: "Lower Body Measurements",
    full: "Full Body Measurements",
    other: "Other Measurements",
  };

  const totals = getTotalPrices();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-xl font-black text-white">
            {editingGarment ? "Edit Garment" : "Add New Garment"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-black text-slate-800 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Garment Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                    Garment Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Men's Formal Shirt"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      category: e.target.value,
                      item: "",
                      itemName: ""
                    })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  
                  {/* ✅ Display selected category name */}
                  {formData.categoryName && (
                    <p className="text-xs text-green-600 mt-1">
                      Selected: {formData.categoryName}
                    </p>
                  )}
                </div>

                {/* Item */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                    Item <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.item}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                    disabled={!formData.category}
                  >
                    <option value="">Select Item</option>
                    {items?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} {item.priceRange ? `(₹${item.priceRange.min} - ₹${item.priceRange.max})` : ''}
                      </option>
                    ))}
                  </select>
                  
                  {/* ✅ Display selected item name */}
                  {formData.itemName && (
                    <p className="text-xs text-green-600 mt-1">
                      Selected: {formData.itemName}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* 📅 UPDATED: Estimated Delivery with Calendar */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                    Estimated Delivery <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={calendarRef}>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left"
                    >
                      <Calendar size={18} className="text-slate-400" />
                      <span className={formData.estimatedDelivery ? "text-slate-800" : "text-slate-400"}>
                        {formatDisplayDate(formData.estimatedDelivery)}
                      </span>
                      {calendarLoading && (
                        <div className="ml-auto w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </button>

                    {showCalendar && (
                      <div className="absolute z-20 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4">
                        <DatePicker
                          inline
                          selected={selectedDate}
                          onChange={handleDateSelect}
                          onMonthChange={handleMonthChange}
                          minDate={new Date()}
                          renderDayContents={renderDayContents}
                          calendarClassName="!border-0"
                        />
                        
                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-slate-600">Customer has orders</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-transparent border border-slate-300 rounded-full"></div>
                            <span className="text-slate-600">No orders</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Green dots show dates where this customer already has orders
                  </p>
                </div>
              </div>
            </div>

            {/* Fabric Section */}
            <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-l-blue-500">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                <Scissors size={20} className="text-blue-600" />
                Fabric Details
              </h3>

              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fabricSource"
                    value="customer"
                    checked={formData.fabricSource === "customer"}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      fabricSource: e.target.value,
                      selectedFabric: "",
                      fabricMeters: "",
                      fabricPrice: 0
                    })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Customer Provided (Free)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fabricSource"
                    value="shop"
                    checked={formData.fabricSource === "shop"}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      fabricSource: e.target.value 
                    })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Shop Provided (Chargeable)</span>
                </label>
              </div>

              {formData.fabricSource === "shop" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                      Select Fabric <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.selectedFabric}
                      onChange={(e) => setFormData({ ...formData, selectedFabric: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">Choose Fabric</option>
                      {fabrics?.map((fabric) => (
                        <option key={fabric._id} value={fabric._id}>
                          {fabric.name} - {fabric.color} (₹{fabric.pricePerMeter}/m)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                      Meters Required <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.fabricMeters}
                      onChange={(e) => setFormData({ ...formData, fabricMeters: e.target.value })}
                      placeholder="e.g., 2.5"
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                      Fabric Price
                    </label>
                    <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-bold">
                      ₹{formData.fabricPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Range & Total Display */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-black text-slate-800 mb-4">Pricing</h3>
              
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-bold mb-1">Item Price (Auto-filled from selected item)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-slate-600">Min Price:</span>
                    <span className="ml-2 font-bold text-blue-700">₹{formData.priceRange.min || 0}</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Max Price:</span>
                    <span className="ml-2 font-bold text-blue-700">₹{formData.priceRange.max || 0}</span>
                  </div>
                </div>
              </div>

              {formData.fabricSource === "shop" && formData.fabricPrice > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 font-bold mb-1">Fabric Price</p>
                  <div>
                    <span className="text-sm text-slate-600">Fabric Cost:</span>
                    <span className="ml-2 font-bold text-green-700">₹{formData.fabricPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
                <p className="text-xs text-purple-600 font-bold mb-2">TOTAL GARMENT PRICE</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-slate-600">Min Total:</span>
                    <span className="ml-2 text-lg font-black text-purple-700">₹{totals.totalMin}</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Max Total:</span>
                    <span className="ml-2 text-lg font-black text-purple-700">₹{totals.totalMax}</span>
                  </div>
                </div>
                <p className="text-xs text-purple-500 mt-2">
                  * Final bill will include: Tailoring (₹{formData.priceRange.min} - ₹{formData.priceRange.max}) 
                  {formData.fabricSource === "shop" && formData.fabricPrice > 0 ? ` + Fabric (₹${formData.fabricPrice})` : ''}
                </p>
              </div>

              {/* Hidden price inputs */}
              <div className="hidden">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                      Minimum Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.priceRange.min}
                      onChange={(e) => setFormData({
                        ...formData,
                        priceRange: { ...formData.priceRange, min: e.target.value }
                      })}
                      min="0"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                      Maximum Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.priceRange.max}
                      onChange={(e) => setFormData({
                        ...formData,
                        priceRange: { ...formData.priceRange, max: e.target.value }
                      })}
                      min="0"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Measurement Section */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-800">Measurements</h3>
                
                {effectiveCustomerId && (
                  <button
                    type="button"
                    onClick={handleSaveAsTemplate}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-all"
                  >
                    <BookmarkPlus size={16} />
                    Save as Template
                  </button>
                )}
              </div>

              <div className="flex gap-4 mb-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="measurementSource"
                    value="template"
                    checked={formData.measurementSource === "template"}
                    onChange={(e) => {
                      setFormData({ ...formData, measurementSource: e.target.value });
                      setSelectedCustomerTemplate("");
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Use Template</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="measurementSource"
                    value="customer"
                    checked={formData.measurementSource === "customer"}
                    onChange={(e) => {
                      setFormData({ ...formData, measurementSource: e.target.value });
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Customer Saved Templates</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="measurementSource"
                    value="manual"
                    checked={formData.measurementSource === "manual"}
                    onChange={(e) => {
                      setFormData({ ...formData, measurementSource: e.target.value });
                      setSelectedCustomerTemplate("");
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Manual Entry</span>
                </label>
              </div>

              {/* Customer Templates Dropdown */}
              {formData.measurementSource === "customer" && (
                <div className="mb-4">
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                    Select Saved Template
                  </label>
                  {!effectiveCustomerId ? (
                    <p className="text-sm text-amber-600 italic p-3 bg-amber-50 rounded-lg">
                      Please select a customer first to view saved templates
                    </p>
                  ) : templatesLoading ? (
                    <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-600">Loading templates...</span>
                    </div>
                  ) : customerTemplates?.length > 0 ? (
                    <select
                      value={selectedCustomerTemplate}
                      onChange={(e) => setSelectedCustomerTemplate(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">-- Select a template --</option>
                      {customerTemplates.map((template) => (
                        <option key={template._id} value={template._id}>
                          {template.name} (Used {template.usageCount || 1} times)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-slate-500 italic p-3 bg-slate-100 rounded-lg">
                      No saved templates yet. Create one using "Save as Template" button above.
                    </p>
                  )}
                </div>
              )}

              {formData.measurementSource === "template" && (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                      Measurement Template
                    </label>
                    <select
                      value={formData.measurementTemplate}
                      onChange={(e) => setFormData({ ...formData, measurementTemplate: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">Select Template</option>
                      {templates?.map((template) => (
                        <option key={template._id} value={template._id}>{template.name}</option>
                      ))}
                    </select>
                  </div>

                  {formData.measurementTemplate && (
                    <div className="space-y-4">
                      {Object.entries(groupedFields || {}).map(([category, categoryFields]) => (
                        <div key={category}>
                          <h4 className="font-bold text-slate-700 mb-2">
                            {categoryTitles[category] || category}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {categoryFields.map((field) => (
                              <label
                                key={field._id}
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                  selectedFields[field.name]
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200 hover:border-blue-200"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={selectedFields[field.name] || false}
                                  onChange={() => handleMeasurementToggle(field)}
                                />
                                <span className="text-sm">{field.displayName}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      {formData.measurements.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="font-bold text-slate-700">Enter Values</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {formData.measurements.map((measurement) => (
                              <div key={measurement.name}>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  {measurement.name}
                                </label>
                                <input
                                  type="number"
                                  value={measurement.value}
                                  onChange={(e) => handleMeasurementChange(measurement.name, e.target.value)}
                                  placeholder="inches"
                                  step="0.1"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {formData.measurementSource === "customer" && !selectedCustomerTemplate && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Select a template from the dropdown above</p>
                </div>
              )}

              {formData.measurementSource === "customer" && selectedCustomerTemplate && (
                <div className="space-y-3">
                  <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Template loaded - you can edit values if needed
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.measurements.map((measurement) => (
                      <div key={measurement.name}>
                        <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">
                          {measurement.name}
                        </label>
                        <input
                          type="number"
                          value={measurement.value}
                          onChange={(e) => handleMeasurementChange(measurement.name, e.target.value)}
                          step="0.1"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.measurementSource === "manual" && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Enter measurements manually</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fields?.map((field) => (
                      <div key={field._id}>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          {field.displayName}
                        </label>
                        <input
                          type="number"
                          value={manualMeasurements[field.name] || ""}
                          onChange={(e) => handleManualMeasurementChange(field.name, e.target.value)}
                          placeholder={field.unit}
                          step="0.1"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* IMAGES SECTION */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                <Camera size={20} className="text-blue-600" />
                Garment Images
              </h3>

              {/* Studio/Reference Images */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <ImageIcon size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Studio Reference Images</h4>
                    <p className="text-xs text-slate-500">Designer images, style references, inspiration</p>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {previewImages.studio.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Studio ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {!img.isExisting && (
                          <button
                            type="button"
                            onClick={() => removeImage(index, "studio")}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <label className="border-2 border-dashed border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                      <Upload size={24} className="text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500">Upload</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, "studio")}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400">Max 5MB per image. JPG, PNG, WEBP only.</p>
                </div>
              </div>

              {/* Customer Provided Images (Digital) */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <User size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Customer Digital Images</h4>
                    <p className="text-xs text-slate-500">Photos sent by customer via WhatsApp/email</p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {previewImages.customerProvided.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Customer Digital ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {!img.isExisting && (
                          <button
                            type="button"
                            onClick={() => removeImage(index, "customerProvided")}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <label className="border-2 border-dashed border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                      <Upload size={24} className="text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500">Upload</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, "customerProvided")}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400">Max 5MB per image. JPG, PNG, WEBP only.</p>
                </div>
              </div>

              {/* Customer Physical Cloth Images */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Scissors size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Customer's Reference Cloth</h4>
                    <p className="text-xs text-slate-500">Photos of physical cloth/design given by customer - for color, fabric, and design reference</p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-orange-200 bg-orange-50/30 rounded-xl p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {previewImages.customerCloth.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Customer Cloth ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-orange-200"
                        />
                        {!img.isExisting && (
                          <button
                            type="button"
                            onClick={() => removeImage(index, "customerCloth")}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <label className="border-2 border-dashed border-orange-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 transition-all">
                      <Upload size={24} className="text-orange-400 mb-1" />
                      <span className="text-xs text-orange-600 font-medium">Upload Cloth Photo</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, "customerCloth")}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-orange-600">
                    <span className="font-bold">Important:</span> Upload photos of the actual cloth/design given by customer. 
                    This helps in matching color, fabric texture, and design details.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-slate-50 rounded-xl p-4">
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                Additional Information
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                rows="3"
                placeholder="Any special instructions or notes about this garment..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Processing...' : (editingGarment ? "Update Garment" : "Add Garment")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-black hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-800 mb-2">Save as Template</h3>
              <p className="text-sm text-slate-500 mb-4">
                Save these measurements as a template for future use
              </p>

              <div className="mb-4">
                <label className="block text-xs font-black uppercase text-slate-500 mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Father Shirt Size, Brother Kurta"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmSaveTemplate}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black transition-all"
                >
                  Save Template
                </button>
                <button
                  onClick={() => {
                    setShowSaveTemplateModal(false);
                    setTemplateName("");
                  }}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-black transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}