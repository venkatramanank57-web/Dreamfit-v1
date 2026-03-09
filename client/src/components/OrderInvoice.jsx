



// import React, { forwardRef, useImperativeHandle, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import pdfBg from "../assets/Pdfbg.png";
// import logo from "../assets/logo.png";

// const OrderInvoice = forwardRef(({ order, garments = [] }, ref) => {
//   const invoiceRef = useRef();

//   useImperativeHandle(ref, () => ({
//     handleDownload: async () => {
//       try {
//         const element = invoiceRef.current;
//         if (!element) return;

//         const canvas = await html2canvas(element, {
//           scale: 3,
//           useCORS: true,
//           backgroundColor: "#ffffff",
//         });

//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");

//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//         pdf.save(`Dreamfit_Invoice_${order?.orderId || "Order"}.pdf`);
//       } catch (error) {
//         console.error("PDF Error:", error);
//         alert("Failed to generate PDF");
//       }
//     },
//   }));

//   if (!order) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB");
//   };

//   // Calculate garment totals with range concept
//   const calculateGarmentTotal = (garment) => {
//     const qty = garment.quantity || 1;
//     const min = garment.priceRange?.min || 0;
//     const max = garment.priceRange?.max || 0;
//     return {
//       min: min * qty,
//       max: max * qty
//     };
//   };

//   // Calculate overall totals
//   const subtotalMin = garments.reduce((sum, g) => sum + (g.priceRange?.min || 0) * (g.quantity || 1), 0);
//   const subtotalMax = garments.reduce((sum, g) => sum + (g.priceRange?.max || 0) * (g.quantity || 1), 0);
//   const advance = order.advancePayment?.amount || 0;
//   const balanceMin = Math.max(0, subtotalMin - advance);
//   const balanceMax = Math.max(0, subtotalMax - advance);

//   // Generate Garment ID if not present
//   const getGarmentId = (garment, index) => {
//     if (garment.garmentId) return garment.garmentId;
    
//     // Generate ID based on garment name
//     const prefix = garment.name?.substring(0, 2).toUpperCase() || "G";
//     const num = String(index + 1).padStart(4, '0');
//     return `#${prefix}${num}`;
//   };

//   return (
//     <div
//       ref={invoiceRef}
//       style={{
//         width: "210mm",
//         minHeight: "297mm",
//         margin: "0 auto",
//         backgroundColor: "#ffffff",
//         fontFamily: "'Arial', 'Helvetica', sans-serif",
//         color: "#334155",
//         position: "relative",
//         boxSizing: "border-box",
//         lineHeight: "1.5",
//       }}
//     >
//       {/* Background Pattern */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           backgroundImage: `url(${logo})`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           opacity: 0.05,
//           zIndex: 1,
//         }}
//       />

//       {/* Main Content */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 10,
//           padding: "40px 35px",
//         }}
//       >
//         {/* ===== HEADER SECTION ===== */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "30px",
//             borderBottom: "3px solid #be185d",
//             paddingBottom: "20px",
//           }}
//         >
//           {/* Logo */}
//           <div>
//             <img
//               src={pdfBg}
//               alt="Dreamfit Couture"
//               style={{
//                 maxWidth: "220px",
//                 maxHeight: "80px",
//                 objectFit: "contain",
//               }}
//             />
//           </div>

//           {/* Title */}
//           <div>
//             <h1
//               style={{
//                 color: "#be185d",
//                 fontSize: "28px",
//                 fontWeight: "900",
//                 margin: 0,
//                 textAlign: "right",
//                 letterSpacing: "1px",
//               }}
//             >
//               INVOICE & RECEIPT
//             </h1>
//             <p
//               style={{
//                 color: "#64748b",
//                 fontSize: "14px",
//                 margin: "5px 0 0 0",
//                 textAlign: "right",
//               }}
//             >
//               Advance Payment Received
//             </p>
//           </div>
//         </div>

//         {/* ===== ORDER ID & DATE - RIGHT ALIGNED ===== */}
//         <div style={{ textAlign: "right", marginBottom: "20px" }}>
//           <p
//             style={{
//               fontSize: "18px",
//               fontWeight: "800",
//               margin: "0 0 5px 0",
//               color: "#1e293b",
//             }}
//           >
//             Order ID: #{order.orderId || "28022026-001"}
//           </p>
//           <p
//             style={{
//               fontSize: "15px",
//               color: "#64748b",
//               margin: 0,
//             }}
//           >
//             Date: {formatDate(order.orderDate) || "02/03/2026"}
//           </p>
//         </div>

//         {/* ===== CUSTOMER DETAILS - RIGHT ALIGNED ===== */}
//         <div
//           style={{
//             textAlign: "right",
//             marginBottom: "35px",
//             backgroundColor: "#fdf2f8",
//             padding: "20px 25px",
//             borderRadius: "12px",
//             borderRight: "6px solid #be185d",
//             width: "fit-content",
//             marginLeft: "auto",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "20px",
//               fontWeight: "800",
//               margin: "0 0 8px 0",
//               color: "#be185d",
//             }}
//           >
//             {order.customer?.name || "Verkatraman K"}
//           </p>
//           <p style={{ fontSize: "15px", margin: "5px 0", color: "#475569" }}>
//             📞 {order.customer?.phone || "+91 90000 12345"}
//           </p>
//           <p style={{ fontSize: "14px", margin: "5px 0", color: "#64748b" }}>
//             📧 {order.customer?.email || "customer@email.com"}
//           </p>
//           <p
//             style={{
//               fontSize: "14px",
//               margin: "8px 0 0 0",
//               color: "#475569",
//               maxWidth: "400px",
//             }}
//           >
//             {order.customer?.addressLine1 || "No. 15, Anna Nagar East,"}
//             <br />
//             {order.customer?.addressLine2
//               ? order.customer?.addressLine2 + ","
//               : ""}
//             {order.customer?.city || "Chennai"},{" "}
//             {order.customer?.state || "Tamil Nadu"} –{" "}
//             {order.customer?.pincode || "600102"}
//           </p>
//         </div>

//         {/* ===== GARMENTS SUMMARY TABLE ===== */}
//         <h3
//           style={{
//             color: "#be185d",
//             fontSize: "20px",
//             fontWeight: "800",
//             margin: "0 0 15px 0",
//             borderBottom: "2px solid #be185d",
//             paddingBottom: "8px",
//           }}
//         >
//           GARMENTS SUMMARY
//         </h3>

//         <div
//           style={{
//             border: "2px solid #fbcfe8",
//             borderRadius: "12px",
//             overflow: "hidden",
//             marginBottom: "30px",
//             boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
//           }}
//         >
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             {/* Table Header */}
//             <thead>
//               <tr style={{ backgroundColor: "#be185d", color: "#ffffff" }}>
//                 <th
//                   style={{
//                     padding: "14px 12px",
//                     textAlign: "left",
//                     fontSize: "14px",
//                     fontWeight: "700",
//                   }}
//                 >
//                   Garment ID
//                 </th>
//                 <th
//                   style={{
//                     padding: "14px 12px",
//                     textAlign: "left",
//                     fontSize: "14px",
//                     fontWeight: "700",
//                   }}
//                 >
//                   Garments
//                 </th>
//                 <th
//                   style={{
//                     padding: "14px 12px",
//                     textAlign: "center",
//                     fontSize: "14px",
//                     fontWeight: "700",
//                   }}
//                 >
//                   Qty
//                 </th>
//                 <th
//                   style={{
//                     padding: "14px 12px",
//                     textAlign: "center",
//                     fontSize: "14px",
//                     fontWeight: "700",
//                   }}
//                 >
//                   Prize Range (₹)
//                 </th>
//                 <th
//                   style={{
//                     padding: "14px 12px",
//                     textAlign: "center",
//                     fontSize: "14px",
//                     fontWeight: "700",
//                   }}
//                 >
//                   Total Range (₹)
//                 </th>
//               </tr>
//             </thead>

//             {/* Table Body */}
//             <tbody>
//               {garments.length > 0 ? (
//                 garments.map((garment, index) => {
//                   const garmentTotal = calculateGarmentTotal(garment);
//                   return (
//                     <tr
//                       key={index}
//                       style={{
//                         borderBottom: "1px solid #fbcfe8",
//                         backgroundColor: index % 2 === 0 ? "#ffffff" : "#fef9f9",
//                       }}
//                     >
//                       {/* Garment ID */}
//                       <td
//                         style={{
//                           padding: "14px 12px",
//                           verticalAlign: "middle",
//                         }}
//                       >
//                         <span
//                           style={{
//                             backgroundColor: "#fdf2f8",
//                             color: "#be185d",
//                             padding: "5px 10px",
//                             borderRadius: "20px",
//                             fontSize: "13px",
//                             fontWeight: "700",
//                             display: "inline-block",
//                           }}
//                         >
//                           {getGarmentId(garment, index)}
//                         </span>
//                       </td>

//                       {/* Garment Name & Details */}
//                       <td
//                         style={{
//                           padding: "14px 12px",
//                           verticalAlign: "middle",
//                         }}
//                       >
//                         <div style={{ fontWeight: "700", fontSize: "15px" }}>
//                           {garment.name || "Slim Fit Shirt"}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: "12px",
//                             color: "#64748b",
//                             marginTop: "3px",
//                           }}
//                         >
//                           {garment.fabric ||
//                             garment.category?.name ||
//                             "White Cotton"}
//                         </div>
//                       </td>

//                       {/* Quantity */}
//                       <td
//                         style={{
//                           padding: "14px 12px",
//                           textAlign: "center",
//                           verticalAlign: "middle",
//                           fontSize: "16px",
//                           fontWeight: "600",
//                         }}
//                       >
//                         {garment.quantity || 1}
//                       </td>

//                       {/* Prize Range */}
//                       <td
//                         style={{
//                           padding: "14px 12px",
//                           textAlign: "center",
//                           verticalAlign: "middle",
//                           fontWeight: "600",
//                         }}
//                       >
//                         ₹{garment.priceRange?.min || 2000} – ₹
//                         {garment.priceRange?.max || 2500}
//                       </td>

//                       {/* Total Range */}
//                       <td
//                         style={{
//                           padding: "14px 12px",
//                           textAlign: "center",
//                           verticalAlign: "middle",
//                           fontWeight: "700",
//                           color: "#be185d",
//                           fontSize: "15px",
//                         }}
//                       >
//                         ₹{garmentTotal.min} – ₹{garmentTotal.max}
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 /* Default data if no garments provided */
//                 <>
//                   <tr style={{ borderBottom: "1px solid #fbcfe8" }}>
//                     <td style={{ padding: "14px 12px" }}>
//                       <span
//                         style={{
//                           backgroundColor: "#fdf2f8",
//                           color: "#be185d",
//                           padding: "5px 10px",
//                           borderRadius: "20px",
//                           fontSize: "13px",
//                           fontWeight: "700",
//                         }}
//                       >
//                         #GSSF2501
//                       </span>
//                     </td>
//                     <td style={{ padding: "14px 12px" }}>
//                       <div style={{ fontWeight: "700" }}>Slim Fit Shirt</div>
//                       <div style={{ fontSize: "12px", color: "#64748b" }}>
//                         White Cotton
//                       </div>
//                     </td>
//                     <td style={{ padding: "14px 12px", textAlign: "center" }}>
//                       1
//                     </td>
//                     <td style={{ padding: "14px 12px", textAlign: "center" }}>
//                       ₹2,000 – ₹2,500
//                     </td>
//                     <td
//                       style={{
//                         padding: "14px 12px",
//                         textAlign: "center",
//                         fontWeight: "700",
//                         color: "#be185d",
//                       }}
//                     >
//                       ₹2,000 – ₹2,500
//                     </td>
//                   </tr>
//                   <tr style={{ borderBottom: "1px solid #fbcfe8" }}>
//                     <td style={{ padding: "14px 12px" }}>
//                       <span
//                         style={{
//                           backgroundColor: "#fdf2f8",
//                           color: "#be185d",
//                           padding: "5px 10px",
//                           borderRadius: "20px",
//                           fontSize: "13px",
//                           fontWeight: "700",
//                         }}
//                       >
//                         #GFTB3002
//                       </span>
//                     </td>
//                     <td style={{ padding: "14px 12px" }}>
//                       <div style={{ fontWeight: "700" }}>Formal Trousers</div>
//                       <div style={{ fontSize: "12px", color: "#64748b" }}>
//                         Black Wool Blend
//                       </div>
//                     </td>
//                     <td style={{ padding: "14px 12px", textAlign: "center" }}>
//                       1
//                     </td>
//                     <td style={{ padding: "14px 12px", textAlign: "center" }}>
//                       ₹2,500 – ₹3,000
//                     </td>
//                     <td
//                       style={{
//                         padding: "14px 12px",
//                         textAlign: "center",
//                         fontWeight: "700",
//                         color: "#be185d",
//                       }}
//                     >
//                       ₹2,500 – ₹3,000
//                     </td>
//                   </tr>
//                 </>
//               )}
//             </tbody>

//             {/* Table Footer - Total Order Range */}
//             <tfoot>
//               <tr
//                 style={{
//                   backgroundColor: "#fdf2f8",
//                   borderTop: "2px solid #be185d",
//                 }}
//               >
//                 <td
//                   colSpan="4"
//                   style={{
//                     padding: "16px 12px",
//                     textAlign: "right",
//                     fontSize: "16px",
//                     fontWeight: "800",
//                   }}
//                 >
//                   TOTAL ORDER RANGE:
//                 </td>
//                 <td
//                   style={{
//                     padding: "16px 12px",
//                     textAlign: "center",
//                     fontSize: "18px",
//                     fontWeight: "900",
//                     color: "#be185d",
//                   }}
//                 >
//                   ₹{subtotalMin} – ₹{subtotalMax}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>

//         {/* ===== TWO COLUMN LAYOUT ===== */}
//         <div
//           style={{
//             display: "flex",
//             gap: "30px",
//             marginBottom: "40px",
//           }}
//         >
//           {/* Left Column - Payment Details */}
//           <div style={{ flex: 1 }}>
//             <h3
//               style={{
//                 color: "#be185d",
//                 fontSize: "18px",
//                 fontWeight: "800",
//                 margin: "0 0 15px 0",
//                 borderBottom: "2px solid #be185d",
//                 paddingBottom: "5px",
//               }}
//             >
//               PAYMENT DETAILS
//             </h3>
//             <div
//               style={{
//                 backgroundColor: "#f8fafc",
//                 padding: "20px",
//                 borderRadius: "10px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginBottom: "12px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <span style={{ color: "#475569" }}>Advance Received:</span>
//                 <span style={{ fontWeight: "700", color: "#059669" }}>
//                   ₹{advance}
//                 </span>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginBottom: "8px",
//                   fontSize: "15px",
//                 }}
//               >
//                 <span style={{ color: "#475569" }}>Payment Method:</span>
//                 <span style={{ fontWeight: "600" }}>
//                   {order.advancePayment?.method || "GPay/UPI"}
//                 </span>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginTop: "15px",
//                   paddingTop: "15px",
//                   borderTop: "2px dashed #cbd5e1",
//                   fontSize: "16px",
//                 }}
//               >
//                 <span style={{ fontWeight: "700", color: "#be185d" }}>
//                   Balance Range:
//                 </span>
//                 <span style={{ fontWeight: "900", color: "#be185d" }}>
//                   ₹{balanceMin} – ₹{balanceMax}
//                 </span>
//               </div>
//               <p
//                 style={{
//                   fontSize: "11px",
//                   color: "#94a3b8",
//                   marginTop: "15px",
//                   fontStyle: "italic",
//                 }}
//               >
//                 *Final price may vary based on actual measurements
//               </p>
//             </div>
//           </div>

//           {/* Right Column - Delivery Information */}
//           <div style={{ flex: 1 }}>
//             <h3
//               style={{
//                 color: "#be185d",
//                 fontSize: "18px",
//                 fontWeight: "800",
//                 margin: "0 0 15px 0",
//                 borderBottom: "2px solid #be185d",
//                 paddingBottom: "5px",
//               }}
//             >
//               DELIVERY INFORMATION
//             </h3>
//             <div
//               style={{
//                 backgroundColor: "#f8fafc",
//                 padding: "20px",
//                 borderRadius: "10px",
//               }}
//             >
//               <div style={{ marginBottom: "15px" }}>
//                 <p
//                   style={{
//                     fontSize: "13px",
//                     color: "#64748b",
//                     margin: "0 0 5px 0",
//                   }}
//                 >
//                   Estimated Delivery
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "22px",
//                     fontWeight: "900",
//                     color: "#be185d",
//                     margin: 0,
//                   }}
//                 >
//                   {formatDate(order.deliveryDate) || "12/03/2026"}
//                 </p>
//               </div>
//               <div>
//                 <p
//                   style={{
//                     fontSize: "13px",
//                     color: "#64748b",
//                     margin: "0 0 5px 0",
//                   }}
//                 >
//                   Special Instructions
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "14px",
//                     margin: 0,
//                     fontStyle: "italic",
//                   }}
//                 >
//                   "{order.specialNotes ||
//                     "Please present this invoice for trials & collection."}"
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===== STORE DETAILS & SIGNATURE ===== */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-end",
//             marginTop: "50px",
//             paddingTop: "30px",
//             borderTop: "3px double #be185d",
//           }}
//         >
//           {/* Store Details */}
//           <div>
//             <h2
//               style={{
//                 color: "#be185d",
//                 fontSize: "24px",
//                 fontWeight: "900",
//                 margin: "0 0 8px 0",
//               }}
//             >
//               🌟 DREAMFIT COUTURE
//             </h2>
//             <p
//               style={{
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 margin: "0 0 12px 0",
//                 color: "#475569",
//               }}
//             >
//               Premium Boutique & Tailoring
//             </p>
//             <p style={{ fontSize: "13px", margin: "5px 0", color: "#475569" }}>
//               📍 {import.meta.env.VITE_COMPANY_ADDRESS || "No. 42, Gandhi Street, Chennai, Tamil Nadu – 600001"}
//             </p>
//             <p style={{ fontSize: "13px", margin: "5px 0", color: "#475569" }}>
//               📞 {import.meta.env.VITE_COMPANY_PHONE || "+91 98765 43210"} | 
//               ✉️ {import.meta.env.VITE_EAMIL || "care@dreamfitcouture.com"}
//             </p>
//           </div>

//           {/* Authorized Signature */}
//           <div style={{ textAlign: "right" }}>
//             <div
//               style={{
//                 borderTop: "2px dashed #be185d",
//                 width: "250px",
//                 paddingTop: "12px",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "16px",
//                   fontWeight: "800",
//                   color: "#be185d",
//                   margin: 0,
//                 }}
//               >
//                 Authorized Signature
//               </p>
//               <p
//                 style={{
//                   fontSize: "11px",
//                   color: "#64748b",
//                   margin: "5px 0 0 0",
//                 }}
//               >
//                 (For Dreamfit Couture)
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ===== THANK YOU NOTE ===== */}
//         <div
//           style={{
//             marginTop: "40px",
//             textAlign: "center",
//             backgroundColor: "#fdf2f8",
//             padding: "20px",
//             borderRadius: "50px 50px 0 0",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "20px",
//               fontWeight: "800",
//               color: "#be185d",
//               margin: "0 0 5px 0",
//             }}
//           >
//             Thank you for your order, {order.customer?.name?.split(" ")[0] || "Verkatraman"}!
//           </p>
//           <p style={{ fontSize: "15px", color: "#475569", margin: 0 }}>
//             We look forward to styling you again soon.
//           </p>
//         </div>

//         {/* ===== FOOTER ===== */}
//         <div
//           style={{
//             marginTop: "20px",
//             textAlign: "center",
//             fontSize: "9px",
//             color: "#94a3b8",
//             borderTop: "1px solid #fbcfe8",
//             paddingTop: "15px",
//           }}
//         >
//           <p style={{ margin: 0 }}>
//             THIS IS A COMPUTER GENERATED INVOICE • VALID WITH AUTHORIZED SIGNATURE
//           </p>
//           <p style={{ margin: "5px 0 0 0" }}>
//             Invoice #: {order.orderId || "28022026-001"} • Generated on:{" "}
//             {new Date().toLocaleDateString("en-GB")}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default OrderInvoice;




// import React, { forwardRef, useImperativeHandle, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import pdfBg from "../assets/Pdfbg.png";
// import logo from "../assets/logo.png";

// const OrderInvoice = forwardRef(({ order, garments = [] }, ref) => {
//   const invoiceRef = useRef();

//   useImperativeHandle(ref, () => ({
//     handleDownload: async () => {
//       try {
//         const element = invoiceRef.current;
//         if (!element) return;

//         const canvas = await html2canvas(element, {
//           scale: 3, // High resolution for printing
//           useCORS: true,
//           backgroundColor: "#ffffff",
//         });

//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");

//         // A4 dimensions: 210mm x 297mm
//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//         pdf.save(`Dreamfit_Invoice_${order?.orderId || "Order"}.pdf`);
//       } catch (error) {
//         console.error("PDF Error:", error);
//         alert("Failed to generate PDF");
//       }
//     },
//   }));

//   if (!order) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB");
//   };

//   // Calculate garment totals based on min/max range
//   const calculateGarmentTotal = (garment) => {
//     const qty = garment.quantity || 1;
//     const min = garment.priceRange?.min || 0;
//     const max = garment.priceRange?.max || 0;
//     return {
//       min: min * qty,
//       max: max * qty
//     };
//   };

//   // Calculate overall subtotal and balance
//   const subtotalMin = garments.reduce((sum, g) => sum + (g.priceRange?.min || 0) * (g.quantity || 1), 0);
//   const subtotalMax = garments.reduce((sum, g) => sum + (g.priceRange?.max || 0) * (g.quantity || 1), 0);
//   const advance = order.advancePayment?.amount || 0;
//   const balanceMin = Math.max(0, subtotalMin - advance);
//   const balanceMax = Math.max(0, subtotalMax - advance);

//   const getGarmentId = (garment, index) => {
//     if (garment.garmentId) return garment.garmentId;
//     const prefix = garment.name?.substring(0, 2).toUpperCase() || "G";
//     const num = String(index + 1).padStart(4, '0');
//     return `#${prefix}${num}`;
//   };

//   return (
//     <div
//       ref={invoiceRef}
//       style={{
//         width: "210mm",
//         minHeight: "297mm",
//         margin: "0 auto",
//         backgroundColor: "#ffffff",
//         fontFamily: "'Arial', 'Helvetica', sans-serif",
//         color: "#334155",
//         position: "relative",
//         boxSizing: "border-box",
//         lineHeight: "1.5",
//       }}
//     >
//       {/* Watermark Logo Background */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           backgroundImage: `url(${logo})`,
//           backgroundSize: "600px",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           opacity: 0.03,
//           zIndex: 0,
//         }}
//       />

//       <div
//         style={{
//           position: "relative",
//           zIndex: 10,
//           padding: "40px 35px",
//         }}
//       >
//         {/* HEADER SECTION */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "30px",
//             borderBottom: "3px solid #be185d",
//             paddingBottom: "20px",
//           }}
//         >
//           <div>
//             <img
//               src={pdfBg}
//               alt="Dreamfit"
//               style={{
//                 maxWidth: "220px",
//                 maxHeight: "80px",
//                 objectFit: "contain",
//               }}
//             />
//           </div>

//           <div style={{ textAlign: "right" }}>
//             <h1
//               style={{
//                 color: "#be185d",
//                 fontSize: "28px",
//                 fontWeight: "900",
//                 margin: 0,
//                 letterSpacing: "1px",
//               }}
//             >
//               INVOICE & RECEIPT
//             </h1>
//             <p style={{ color: "#64748b", fontSize: "14px", margin: "5px 0 0 0" }}>
//               Advance Payment Received
//             </p>
//           </div>
//         </div>

//         {/* ORDER INFO */}
//         <div style={{ textAlign: "right", marginBottom: "20px" }}>
//           <p style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 5px 0", color: "#1e293b" }}>
//             Order ID: #{order.orderId || "DF-001"}
//           </p>
//           <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>
//             Date: {formatDate(order.orderDate)}
//           </p>
//         </div>

//         {/* CUSTOMER DETAILS BOX */}
//         <div
//           style={{
//             textAlign: "right",
//             marginBottom: "35px",
//             backgroundColor: "#fdf2f8",
//             padding: "20px 25px",
//             borderRadius: "12px",
//             borderRight: "6px solid #be185d",
//             width: "fit-content",
//             marginLeft: "auto",
//           }}
//         >
//           <p style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 8px 0", color: "#be185d" }}>
//             {order.customer?.name || "Guest Customer"}
//           </p>
//           <p style={{ fontSize: "15px", margin: "5px 0", color: "#475569" }}>
//             📞 {order.customer?.phone || "N/A"}
//           </p>
//           <p style={{ fontSize: "14px", margin: "5px 0", color: "#64748b" }}>
//             📧 {order.customer?.email || "N/A"}
//           </p>
//           <p style={{ fontSize: "14px", margin: "8px 0 0 0", color: "#475569", maxWidth: "400px" }}>
//             {order.customer?.addressLine1}
//             {order.customer?.addressLine2 && <><br />{order.customer.addressLine2}</>}
//             <br />
//             {order.customer?.city}, {order.customer?.state} – {order.customer?.pincode}
//           </p>
//         </div>

//         {/* TABLE SECTION */}
//         <h3
//           style={{
//             color: "#be185d",
//             fontSize: "20px",
//             fontWeight: "800",
//             margin: "0 0 15px 0",
//             borderBottom: "2px solid #be185d",
//             paddingBottom: "8px",
//           }}
//         >
//           GARMENTS SUMMARY
//         </h3>

//         <div
//           style={{
//             border: "2px solid #fbcfe8",
//             borderRadius: "12px",
//             overflow: "hidden",
//             marginBottom: "30px",
//           }}
//         >
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#be185d", color: "#ffffff" }}>
//                 <th style={{ padding: "14px 12px", textAlign: "left", fontSize: "14px" }}>Garment ID</th>
//                 <th style={{ padding: "14px 12px", textAlign: "left", fontSize: "14px" }}>Garments</th>
//                 <th style={{ padding: "14px 12px", textAlign: "center", fontSize: "14px" }}>Qty</th>
//                 <th style={{ padding: "14px 12px", textAlign: "center", fontSize: "14px" }}>Price Range (₹)</th>
//                 <th style={{ padding: "14px 12px", textAlign: "center", fontSize: "14px" }}>Total Range (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {garments.map((garment, index) => {
//                 const total = calculateGarmentTotal(garment);
//                 return (
//                   <tr key={index} style={{ borderBottom: "1px solid #fbcfe8", backgroundColor: index % 2 === 0 ? "#ffffff" : "#fef9f9" }}>
//                     <td style={{ padding: "14px 12px" }}>
//                       <span style={{ backgroundColor: "#fdf2f8", color: "#be185d", padding: "5px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" }}>
//                         {getGarmentId(garment, index)}
//                       </span>
//                     </td>
//                     <td style={{ padding: "14px 12px" }}>
//                       <div style={{ fontWeight: "700", fontSize: "15px" }}>{garment.name}</div>
//                       <div style={{ fontSize: "12px", color: "#64748b" }}>{garment.fabric || garment.category?.name}</div>
//                     </td>
//                     <td style={{ padding: "14px 12px", textAlign: "center", fontWeight: "600" }}>{garment.quantity}</td>
//                     <td style={{ padding: "14px 12px", textAlign: "center" }}>₹{garment.priceRange?.min} – ₹{garment.priceRange?.max}</td>
//                     <td style={{ padding: "14px 12px", textAlign: "center", fontWeight: "700", color: "#be185d" }}>
//                       ₹{total.min} – ₹{total.max}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//             <tfoot>
//               <tr style={{ backgroundColor: "#fdf2f8", borderTop: "2px solid #be185d" }}>
//                 <td colSpan="4" style={{ padding: "16px 12px", textAlign: "right", fontSize: "16px", fontWeight: "800" }}>TOTAL ORDER RANGE:</td>
//                 <td style={{ padding: "16px 12px", textAlign: "center", fontSize: "18px", fontWeight: "900", color: "#be185d" }}>
//                   ₹{subtotalMin} – ₹{subtotalMax}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>

//         {/* PAYMENT & DELIVERY COLUMNS */}
//         <div style={{ display: "flex", gap: "30px", marginBottom: "40px" }}>
//           {/* Payment */}
//           <div style={{ flex: 1 }}>
//             <h3 style={{ color: "#be185d", fontSize: "18px", fontWeight: "800", borderBottom: "2px solid #be185d", paddingBottom: "5px", marginBottom: "15px" }}>
//               PAYMENT DETAILS
//             </h3>
//             <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "10px" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
//                 <span style={{ color: "#475569" }}>Advance Received:</span>
//                 <span style={{ fontWeight: "700", color: "#059669" }}>₹{advance}</span>
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
//                 <span style={{ color: "#475569" }}>Method:</span>
//                 <span style={{ fontWeight: "600" }}>{order.advancePayment?.method || "UPI"}</span>
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", paddingTop: "15px", borderTop: "2px dashed #cbd5e1" }}>
//                 <span style={{ fontWeight: "700", color: "#be185d" }}>Balance Due:</span>
//                 <span style={{ fontWeight: "900", color: "#be185d" }}>₹{balanceMin} – ₹{balanceMax}</span>
//               </div>
//             </div>
//           </div>

//           {/* Delivery */}
//           <div style={{ flex: 1 }}>
//             <h3 style={{ color: "#be185d", fontSize: "18px", fontWeight: "800", borderBottom: "2px solid #be185d", paddingBottom: "5px", marginBottom: "15px" }}>
//               DELIVERY INFO
//             </h3>
//             <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "10px" }}>
//               <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 5px 0" }}>Estimated Delivery</p>
//               <p style={{ fontSize: "22px", fontWeight: "900", color: "#be185d", margin: "0 0 15px 0" }}>
//                 {formatDate(order.deliveryDate)}
//               </p>
//               <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 5px 0" }}>Notes</p>
//               <p style={{ fontSize: "14px", margin: 0, fontStyle: "italic" }}>
//                 "{order.specialNotes || "Handle with care."}"
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* STORE CONTACT & SIGNATURE */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-end",
//             marginTop: "50px",
//             paddingTop: "30px",
//             borderTop: "3px double #be185d",
//           }}
//         >
//           <div>
//             <h2 style={{ color: "#be185d", fontSize: "24px", fontWeight: "900", margin: "0 0 8px 0" }}>🌟 DREAMFIT COUTURE</h2>
//             <p style={{ fontSize: "13px", margin: "5px 0", color: "#475569" }}>
//               📍 {import.meta.env.VITE_COMPANY_ADDRESS || "Chennai, Tamil Nadu"}
//             </p>
//             <p style={{ fontSize: "13px", margin: "5px 0", color: "#475569" }}>
//               📞 {import.meta.env.VITE_COMPANY_PHONE} | ✉️ {import.meta.env.VITE_EAMIL}
//             </p>
//           </div>

//           <div style={{ textAlign: "right" }}>
//             <div style={{ borderTop: "2px dashed #be185d", width: "220px", paddingTop: "10px" }}>
//               <p style={{ fontSize: "16px", fontWeight: "800", color: "#be185d", margin: 0 }}>Authorized Signature</p>
//             </div>
//           </div>
//         </div>

//         {/* THANK YOU */}
//         <div style={{ marginTop: "40px", textAlign: "center", backgroundColor: "#fdf2f8", padding: "20px", borderRadius: "50px 50px 0 0" }}>
//           <p style={{ fontSize: "18px", fontWeight: "800", color: "#be185d", margin: 0 }}>
//             Thank you for choosing Dreamfit, {order.customer?.name?.split(" ")[0]}!
//           </p>
//         </div>

//         <div style={{ marginTop: "20px", textAlign: "center", fontSize: "9px", color: "#94a3b8", borderTop: "1px solid #fbcfe8", paddingTop: "10px" }}>
//           <p>COMPUTER GENERATED INVOICE • {new Date().toLocaleDateString("en-GB")}</p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default OrderInvoice;






// import React, { forwardRef, useImperativeHandle, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import pdfBg from "../assets/Pdfbg.png";
// import logo from "../assets/logo.png";

// const OrderInvoice = forwardRef(({ order, garments = [] }, ref) => {
//   const invoiceRef = useRef();

//   useImperativeHandle(ref, () => ({
//     handleDownload: async () => {
//       try {
//         const element = invoiceRef.current;
//         if (!element) return;

//         const canvas = await html2canvas(element, {
//           scale: 3,
//           useCORS: true,
//           backgroundColor: "#ffffff",
//           allowTaint: true,
//           logging: false,
//         });

//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//         pdf.save(`Dreamfit_Invoice_${order?.orderId || "Order"}.pdf`);
//       } catch (error) {
//         console.error("PDF Error:", error);
//         alert("Failed to generate PDF");
//       }
//     },
//   }));

//   if (!order) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB");
//   };

//   const calculateGarmentTotal = (garment) => {
//     const qty = garment.quantity || 1;
//     const min = garment.priceRange?.min || 0;
//     const max = garment.priceRange?.max || 0;
//     return {
//       min: min * qty,
//       max: max * qty
//     };
//   };

//   const subtotalMin = garments.reduce((sum, g) => sum + (g.priceRange?.min || 0) * (g.quantity || 1), 0);
//   const subtotalMax = garments.reduce((sum, g) => sum + (g.priceRange?.max || 0) * (g.quantity || 1), 0);
//   const advance = order.advancePayment?.amount || 0;
//   const balanceMin = Math.max(0, subtotalMin - advance);
//   const balanceMax = Math.max(0, subtotalMax - advance);

//   const getGarmentId = (garment, index) => {
//     if (garment.garmentId) return garment.garmentId;
//     const prefix = garment.name?.substring(0, 2).toUpperCase() || "G";
//     const num = String(index + 1).padStart(4, '0');
//     return `#${prefix}${num}`;
//   };

//   return (
//     <div
//       ref={invoiceRef}
//       style={{
//         width: "210mm",
//         minHeight: "297mm",
//         margin: "0 auto",
//         backgroundColor: "#ffffff",
//         fontFamily: "'Inter', 'Arial', 'Helvetica', sans-serif",
//         color: "#1e293b",
//         position: "relative",
//         boxSizing: "border-box",
//         lineHeight: "1.5",
//       }}
//     >
//       {/* Professional Watermark Background */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           backgroundImage: `url(${logo})`,
//           backgroundSize: "400px auto",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           opacity: 0.02,
//           zIndex: 1,
//         }}
//       />

//       {/* Content */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 10,
//           padding: "35px 40px",
//         }}
//       >
//         {/* HEADER with proper logo */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "25px",
//           }}
//         >
//           <img
//             src={logo}
//             alt="Dreamfit Couture"
//             style={{
//               maxWidth: "200px",
//               maxHeight: "70px",
//               objectFit: "contain",
//             }}
//           />
//           <div style={{ textAlign: "right" }}>
//             <h1
//               style={{
//                 color: "#be185d",
//                 fontSize: "26px",
//                 fontWeight: "800",
//                 margin: 0,
//                 letterSpacing: "0.5px",
//               }}
//             >
//               INVOICE & RECEIPT
//             </h1>
//             <p style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 0 0" }}>
//               Advance Payment Received
//             </p>
//           </div>
//         </div>

//         {/* Divider */}
//         <div style={{ height: "2px", background: "linear-gradient(90deg, #be185d 0%, #fbcfe8 100%)", marginBottom: "25px" }} />

//         {/* Order Info Row */}
//         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
//           <div>
//             <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 4px 0" }}>Order Number</p>
//             <p style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>#{order.orderId || "DF-001"}</p>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 4px 0" }}>Order Date</p>
//             <p style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>{formatDate(order.orderDate)}</p>
//           </div>
//         </div>

//         {/* Customer Card */}
//         <div
//           style={{
//             backgroundColor: "#f8fafc",
//             borderRadius: "16px",
//             padding: "20px",
//             marginBottom: "30px",
//             border: "1px solid #f1f5f9",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//             <div>
//               <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                 Bill To
//               </p>
//               <p style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 6px 0", color: "#0f172a" }}>
//                 {order.customer?.name || "Guest Customer"}
//               </p>
//               <p style={{ fontSize: "14px", margin: "4px 0", color: "#475569" }}>
//                 📞 {order.customer?.phone || "N/A"}
//               </p>
//               <p style={{ fontSize: "14px", margin: "4px 0", color: "#475569" }}>
//                 ✉️ {order.customer?.email || "N/A"}
//               </p>
//               <p style={{ fontSize: "13px", margin: "8px 0 0 0", color: "#64748b", maxWidth: "300px" }}>
//                 {order.customer?.addressLine1}
//                 {order.customer?.addressLine2 && <>, {order.customer.addressLine2}</>}
//                 <br />
//                 {order.customer?.city}, {order.customer?.state} {order.customer?.pincode}
//               </p>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                 Delivery Date
//               </p>
//               <p style={{ fontSize: "20px", fontWeight: "700", color: "#be185d", margin: 0 }}>
//                 {formatDate(order.deliveryDate)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Table Title */}
//         <h3
//           style={{
//             fontSize: "16px",
//             fontWeight: "700",
//             color: "#0f172a",
//             margin: "0 0 15px 0",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}
//         >
//           <span style={{ display: "inline-block", width: "4px", height: "18px", backgroundColor: "#be185d", borderRadius: "4px" }} />
//           GARMENT DETAILS
//         </h3>

//         {/* Professional Table */}
//         <div style={{ marginBottom: "30px", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#f1f5f9" }}>
//                 <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#334155" }}>ID</th>
//                 <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Garment</th>
//                 <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Qty</th>
//                 <th style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Unit Price (₹)</th>
//                 <th style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {garments.map((g, idx) => {
//                 const total = calculateGarmentTotal(g);
//                 return (
//                   <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
//                     <td style={{ padding: "14px 16px", fontSize: "13px", color: "#64748b" }}>
//                       <span style={{ fontFamily: "monospace", fontWeight: "600", color: "#475569" }}>{getGarmentId(g, idx)}</span>
//                     </td>
//                     <td style={{ padding: "14px 16px" }}>
//                       <div style={{ fontWeight: "600", color: "#0f172a" }}>{g.name}</div>
//                       <div style={{ fontSize: "12px", color: "#64748b" }}>{g.fabric || g.category?.name || "—"}</div>
//                     </td>
//                     <td style={{ padding: "14px 16px", textAlign: "center", color: "#334155" }}>{g.quantity}</td>
//                     <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "monospace" }}>
//                       {g.priceRange?.min === g.priceRange?.max ? (
//                         <>₹{g.priceRange?.min}</>
//                       ) : (
//                         <>₹{g.priceRange?.min} – ₹{g.priceRange?.max}</>
//                       )}
//                     </td>
//                     <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: "600", color: "#be185d" }}>
//                       {total.min === total.max ? (
//                         <>₹{total.min}</>
//                       ) : (
//                         <>₹{total.min} – ₹{total.max}</>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//             <tfoot>
//               <tr style={{ backgroundColor: "#f8fafc" }}>
//                 <td colSpan="4" style={{ padding: "16px", textAlign: "right", fontSize: "15px", fontWeight: "600" }}>Subtotal Range</td>
//                 <td style={{ padding: "16px", textAlign: "right", fontSize: "16px", fontWeight: "700", color: "#be185d" }}>
//                   ₹{subtotalMin} – ₹{subtotalMax}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>

//         {/* Payment + Delivery Grid */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
//           {/* Payment Card */}
//           <div style={{ backgroundColor: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
//             <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
//               <span style={{ width: "4px", height: "16px", backgroundColor: "#be185d", borderRadius: "4px" }} />
//               PAYMENT SUMMARY
//             </h4>
//             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <span style={{ color: "#475569" }}>Advance Paid</span>
//                 <span style={{ fontWeight: "600", color: "#059669" }}>₹{advance}</span>
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <span style={{ color: "#475569" }}>Payment Mode</span>
//                 <span style={{ fontWeight: "500", color: "#334155" }}>{order.advancePayment?.method || "UPI"}</span>
//               </div>
//               <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "8px 0" }} />
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <span style={{ fontWeight: "600", color: "#be185d" }}>Balance Due</span>
//                 <span style={{ fontWeight: "700", color: "#be185d", fontSize: "18px" }}>
//                   ₹{balanceMin} – ₹{balanceMax}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Delivery Card */}
//           <div style={{ backgroundColor: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
//             <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
//               <span style={{ width: "4px", height: "16px", backgroundColor: "#be185d", borderRadius: "4px" }} />
//               DELIVERY INFO
//             </h4>
//             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//               <div>
//                 <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0" }}>Estimated Delivery</p>
//                 <p style={{ fontSize: "18px", fontWeight: "700", color: "#be185d", margin: 0 }}>
//                   {formatDate(order.deliveryDate)}
//                 </p>
//               </div>
//               {order.specialNotes && (
//                 <div>
//                   <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0" }}>Special Instructions</p>
//                   <p style={{ fontSize: "13px", margin: 0, fontStyle: "italic", color: "#475569" }}>"{order.specialNotes}"</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer with Signature */}
//         <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px dashed #e2e8f0", paddingTop: "25px" }}>
//           <div>
//             <h3 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 4px 0" }}>DREAMFIT COUTURE</h3>
//             <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0" }}>
//               {import.meta.env.VITE_COMPANY_ADDRESS || "Chennai, Tamil Nadu"}
//             </p>
//             <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0" }}>
//               📞 {import.meta.env.VITE_COMPANY_PHONE || "+91 98765 43210"}  |  ✉️ {import.meta.env.VITE_EAMIL || "care@dreamfit.com"}
//             </p>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <div style={{ borderTop: "2px solid #be185d", width: "200px", paddingTop: "10px" }}>
//               <p style={{ fontSize: "14px", fontWeight: "600", color: "#be185d", margin: 0 }}>Authorized Signature</p>
//               <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>For Dreamfit Couture</p>
//             </div>
//           </div>
//         </div>

//         {/* Thank You Note */}
//         <div style={{ marginTop: "30px", textAlign: "center" }}>
//           <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
//             Thank you for your business, {order.customer?.name?.split(" ")[0] || "Valued Customer"}!
//           </p>
//           <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "12px" }}>
//             Invoice #{order.orderId || "DF-001"} • Generated on {new Date().toLocaleDateString("en-GB")}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default OrderInvoice;




// import React, { forwardRef, useImperativeHandle, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import pdfBg from "../assets/Pdfbg.png";
// import logo from "../assets/logo.png";

// const OrderInvoice = forwardRef(({ order, garments = [] }, ref) => {
//   const invoiceRef = useRef();

//   // ✅ EXPOSE BOTH handleDownload AND getInvoiceElement for printing
//   useImperativeHandle(ref, () => ({
//     handleDownload: async () => {
//       try {
//         const element = invoiceRef.current;
//         if (!element) return;

//         const canvas = await html2canvas(element, {
//           scale: 3,
//           useCORS: true,
//           backgroundColor: "#ffffff",
//           allowTaint: true,
//           logging: false,
//         });

//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//         pdf.save(`Dreamfit_Invoice_${order?.orderId || "Order"}.pdf`);
//       } catch (error) {
//         console.error("PDF Error:", error);
//         alert("Failed to generate PDF");
//       }
//     },
//     // ✅ CRITICAL: This method is needed for printing
//     getInvoiceElement: () => invoiceRef.current
//   }));

//   if (!order) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB");
//   };

//   const calculateGarmentTotal = (garment) => {
//     const qty = garment.quantity || 1;
//     const min = garment.priceRange?.min || 0;
//     const max = garment.priceRange?.max || 0;
//     return {
//       min: min * qty,
//       max: max * qty
//     };
//   };

//   const subtotalMin = garments.reduce((sum, g) => sum + (g.priceRange?.min || 0) * (g.quantity || 1), 0);
//   const subtotalMax = garments.reduce((sum, g) => sum + (g.priceRange?.max || 0) * (g.quantity || 1), 0);
//   const advance = order.advancePayment?.amount || 0;
//   const balanceMin = Math.max(0, subtotalMin - advance);
//   const balanceMax = Math.max(0, subtotalMax - advance);

//   const getGarmentId = (garment, index) => {
//     if (garment.garmentId) return garment.garmentId;
//     const prefix = garment.name?.substring(0, 2).toUpperCase() || "G";
//     const num = String(index + 1).padStart(4, '0');
//     return `#${prefix}${num}`;
//   };

//   return (
//     <div
//       ref={invoiceRef}
//       data-invoice="true"
//       style={{
//         width: "210mm",
//         minHeight: "297mm",
//         margin: "0 auto",
//         backgroundColor: "#ffffff",
//         fontFamily: "'Inter', 'Arial', 'Helvetica', sans-serif",
//         color: "#1e293b",
//         position: "relative",
//         boxSizing: "border-box",
//         lineHeight: "1.5",
//       }}
//     >
//       {/* Professional Watermark Background */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           backgroundImage: `url(${logo})`,
//           backgroundSize: "400px auto",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           opacity: 0.02,
//           zIndex: 1,
//         }}
//       />

//       {/* Content */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 10,
//           padding: "35px 40px",
//         }}
//       >
//         {/* HEADER with proper logo */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "25px",
//           }}
//         >
//           <img
//             src={logo}
//             alt="Dreamfit Couture"
//             style={{
//               maxWidth: "200px",
//               maxHeight: "70px",
//               objectFit: "contain",
//             }}
//           />
//           <div style={{ textAlign: "right" }}>
//             <h1
//               style={{
//                 color: "#be185d",
//                 fontSize: "26px",
//                 fontWeight: "800",
//                 margin: 0,
//                 letterSpacing: "0.5px",
//               }}
//             >
//               INVOICE & RECEIPT
//             </h1>
//             <p style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 0 0" }}>
//               Advance Payment Received
//             </p>
//           </div>
//         </div>

//         {/* Divider */}
//         <div style={{ height: "2px", background: "linear-gradient(90deg, #be185d 0%, #fbcfe8 100%)", marginBottom: "25px" }} />

//         {/* Order Info Row */}
//         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
//           <div>
//             <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 4px 0" }}>Order Number</p>
//             <p style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>#{order.orderId || "DF-001"}</p>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 4px 0" }}>Order Date</p>
//             <p style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>{formatDate(order.orderDate)}</p>
//           </div>
//         </div>

//         {/* Customer Card */}
//         <div
//           style={{
//             backgroundColor: "#f8fafc",
//             borderRadius: "16px",
//             padding: "20px",
//             marginBottom: "30px",
//             border: "1px solid #f1f5f9",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//             <div>
//               <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                 Bill To
//               </p>
//               <p style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 6px 0", color: "#0f172a" }}>
//                 {order.customer?.name || "Guest Customer"}
//               </p>
//               <p style={{ fontSize: "14px", margin: "4px 0", color: "#475569" }}>
//                 📞 {order.customer?.phone || "N/A"}
//               </p>
//               <p style={{ fontSize: "14px", margin: "4px 0", color: "#475569" }}>
//                 ✉️ {order.customer?.email || "N/A"}
//               </p>
//               <p style={{ fontSize: "13px", margin: "8px 0 0 0", color: "#64748b", maxWidth: "300px" }}>
//                 {order.customer?.addressLine1}
//                 {order.customer?.addressLine2 && <>, {order.customer.addressLine2}</>}
//                 <br />
//                 {order.customer?.city}, {order.customer?.state} {order.customer?.pincode}
//               </p>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                 Delivery Date
//               </p>
//               <p style={{ fontSize: "20px", fontWeight: "700", color: "#be185d", margin: 0 }}>
//                 {formatDate(order.deliveryDate)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Table Title */}
//         <h3
//           style={{
//             fontSize: "16px",
//             fontWeight: "700",
//             color: "#0f172a",
//             margin: "0 0 15px 0",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}
//         >
//           <span style={{ display: "inline-block", width: "4px", height: "18px", backgroundColor: "#be185d", borderRadius: "4px" }} />
//           GARMENT DETAILS
//         </h3>

//         {/* Professional Table */}
//         <div style={{ marginBottom: "30px", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#f1f5f9" }}>
//                 <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#334155" }}>ID</th>
//                 <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Garment</th>
//                 <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Qty</th>
//                 <th style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Unit Price (₹)</th>
//                 <th style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {garments.map((g, idx) => {
//                 const total = calculateGarmentTotal(g);
//                 return (
//                   <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
//                     <td style={{ padding: "14px 16px", fontSize: "13px", color: "#64748b" }}>
//                       <span style={{ fontFamily: "monospace", fontWeight: "600", color: "#475569" }}>{getGarmentId(g, idx)}</span>
//                     </td>
//                     <td style={{ padding: "14px 16px" }}>
//                       <div style={{ fontWeight: "600", color: "#0f172a" }}>{g.name}</div>
//                       <div style={{ fontSize: "12px", color: "#64748b" }}>{g.fabric || g.category?.name || "—"}</div>
//                     </td>
//                     <td style={{ padding: "14px 16px", textAlign: "center", color: "#334155" }}>{g.quantity}</td>
//                     <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "monospace" }}>
//                       {g.priceRange?.min === g.priceRange?.max ? (
//                         <>₹{g.priceRange?.min}</>
//                       ) : (
//                         <>₹{g.priceRange?.min} – ₹{g.priceRange?.max}</>
//                       )}
//                     </td>
//                     <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: "600", color: "#be185d" }}>
//                       {total.min === total.max ? (
//                         <>₹{total.min}</>
//                       ) : (
//                         <>₹{total.min} – ₹{total.max}</>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//             <tfoot>
//               <tr style={{ backgroundColor: "#f8fafc" }}>
//                 <td colSpan="4" style={{ padding: "16px", textAlign: "right", fontSize: "15px", fontWeight: "600" }}>Subtotal Range</td>
//                 <td style={{ padding: "16px", textAlign: "right", fontSize: "16px", fontWeight: "700", color: "#be185d" }}>
//                   ₹{subtotalMin} – ₹{subtotalMax}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>

//         {/* Payment + Delivery Grid */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
//           {/* Payment Card */}
//           <div style={{ backgroundColor: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
//             <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
//               <span style={{ width: "4px", height: "16px", backgroundColor: "#be185d", borderRadius: "4px" }} />
//               PAYMENT SUMMARY
//             </h4>
//             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <span style={{ color: "#475569" }}>Advance Paid</span>
//                 <span style={{ fontWeight: "600", color: "#059669" }}>₹{advance}</span>
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <span style={{ color: "#475569" }}>Payment Mode</span>
//                 <span style={{ fontWeight: "500", color: "#334155" }}>{order.advancePayment?.method || "UPI"}</span>
//               </div>
//               <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "8px 0" }} />
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <span style={{ fontWeight: "600", color: "#be185d" }}>Balance Due</span>
//                 <span style={{ fontWeight: "700", color: "#be185d", fontSize: "18px" }}>
//                   ₹{balanceMin} – ₹{balanceMax}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Delivery Card */}
//           <div style={{ backgroundColor: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
//             <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
//               <span style={{ width: "4px", height: "16px", backgroundColor: "#be185d", borderRadius: "4px" }} />
//               DELIVERY INFO
//             </h4>
//             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//               <div>
//                 <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0" }}>Estimated Delivery</p>
//                 <p style={{ fontSize: "18px", fontWeight: "700", color: "#be185d", margin: 0 }}>
//                   {formatDate(order.deliveryDate)}
//                 </p>
//               </div>
//               {order.specialNotes && (
//                 <div>
//                   <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0" }}>Special Instructions</p>
//                   <p style={{ fontSize: "13px", margin: 0, fontStyle: "italic", color: "#475569" }}>"{order.specialNotes}"</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer with Signature */}
//         <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px dashed #e2e8f0", paddingTop: "25px" }}>
//           <div>
//             <h3 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 4px 0" }}>DREAMFIT COUTURE</h3>
//             <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0" }}>
//               {import.meta.env.VITE_COMPANY_ADDRESS || "Chennai, Tamil Nadu"}
//             </p>
//             <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0" }}>
//               📞 {import.meta.env.VITE_COMPANY_PHONE || "+91 98765 43210"}  |  ✉️ {import.meta.env.VITE_EAMIL || "care@dreamfit.com"}
//             </p>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <div style={{ borderTop: "2px solid #be185d", width: "200px", paddingTop: "10px" }}>
//               <p style={{ fontSize: "14px", fontWeight: "600", color: "#be185d", margin: 0 }}>Authorized Signature</p>
//               <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>For Dreamfit Couture</p>
//             </div>
//           </div>
//         </div>

//         {/* Thank You Note */}
//         <div style={{ marginTop: "30px", textAlign: "center" }}>
//           <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
//             Thank you for your business, {order.customer?.name?.split(" ")[0] || "Valued Customer"}!
//           </p>
//           <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "12px" }}>
//             Invoice #{order.orderId || "DF-001"} • Generated on {new Date().toLocaleDateString("en-GB")}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default OrderInvoice;





import React, { forwardRef, useImperativeHandle, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import pdfBg from "../assets/Pdfbg.png";
import logo from "../assets/logo.png";

const OrderInvoice = forwardRef(({ order, garments = [] }, ref) => {
  const invoiceRef = useRef();

  // ✅ EXPOSE BOTH handleDownload AND getInvoiceElement for printing
  useImperativeHandle(ref, () => ({
    handleDownload: async () => {
      try {
        const element = invoiceRef.current;
        if (!element) {
          console.error("Invoice element not found");
          return;
        }

        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
          allowTaint: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        pdf.save(`Dreamfit_Invoice_${order?.orderId || "Order"}.pdf`);
      } catch (error) {
        console.error("PDF Error:", error);
        alert("Failed to generate PDF");
      }
    },
    // ✅ CRITICAL: This method is needed for printing
    getInvoiceElement: () => invoiceRef.current
  }));

  if (!order) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const calculateGarmentTotal = (garment) => {
    const qty = garment.quantity || 1;
    const min = garment.priceRange?.min || 0;
    const max = garment.priceRange?.max || 0;
    return {
      min: min * qty,
      max: max * qty
    };
  };

  const subtotalMin = garments.reduce((sum, g) => sum + (g.priceRange?.min || 0) * (g.quantity || 1), 0);
  const subtotalMax = garments.reduce((sum, g) => sum + (g.priceRange?.max || 0) * (g.quantity || 1), 0);
  const advance = order.advancePayment?.amount || 0;
  const balanceMin = Math.max(0, subtotalMin - advance);
  const balanceMax = Math.max(0, subtotalMax - advance);

  const getGarmentId = (garment, index) => {
    if (garment.garmentId) return garment.garmentId;
    const prefix = garment.name?.substring(0, 2).toUpperCase() || "G";
    const num = String(index + 1).padStart(4, '0');
    return `#${prefix}${num}`;
  };

  return (
    <div
      ref={invoiceRef}
      data-invoice="true"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', 'Arial', 'Helvetica', sans-serif",
        color: "#1e293b",
        position: "relative",
        boxSizing: "border-box",
        lineHeight: "1.5",
      }}
    >
      {/* Professional Watermark Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${logo})`,
          backgroundSize: "400px auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.02,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "35px 40px",
        }}
      >
        {/* HEADER with proper logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <img
            src={logo}
            alt="Dreamfit Couture"
            style={{
              maxWidth: "200px",
              maxHeight: "70px",
              objectFit: "contain",
            }}
          />
          <div style={{ textAlign: "right" }}>
            <h1
              style={{
                color: "#be185d",
                fontSize: "26px",
                fontWeight: "800",
                margin: 0,
                letterSpacing: "0.5px",
              }}
            >
              INVOICE & RECEIPT
            </h1>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 0 0" }}>
              Advance Payment Received
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #be185d 0%, #fbcfe8 100%)", marginBottom: "25px" }} />

        {/* Order Info Row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
          <div>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 4px 0" }}>Order Number</p>
            <p style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>#{order.orderId || "DF-001"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 4px 0" }}>Order Date</p>
            <p style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>{formatDate(order.orderDate)}</p>
          </div>
        </div>

        {/* Customer Card */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "30px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Bill To
              </p>
              <p style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 6px 0", color: "#0f172a" }}>
                {order.customer?.name || "Guest Customer"}
              </p>
              <p style={{ fontSize: "14px", margin: "4px 0", color: "#475569" }}>
                📞 {order.customer?.phone || "N/A"}
              </p>
              <p style={{ fontSize: "14px", margin: "4px 0", color: "#475569" }}>
                ✉️ {order.customer?.email || "N/A"}
              </p>
              <p style={{ fontSize: "13px", margin: "8px 0 0 0", color: "#64748b", maxWidth: "300px" }}>
                {order.customer?.addressLine1}
                {order.customer?.addressLine2 && <>, {order.customer.addressLine2}</>}
                <br />
                {order.customer?.city}, {order.customer?.state} {order.customer?.pincode}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Delivery Date
              </p>
              <p style={{ fontSize: "20px", fontWeight: "700", color: "#be185d", margin: 0 }}>
                {formatDate(order.deliveryDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Table Title */}
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#0f172a",
            margin: "0 0 15px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ display: "inline-block", width: "4px", height: "18px", backgroundColor: "#be185d", borderRadius: "4px" }} />
          GARMENT DETAILS
        </h3>

        {/* Professional Table */}
        <div style={{ marginBottom: "30px", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#334155" }}>ID</th>
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Garment</th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Qty</th>
                <th style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Unit Price (₹)</th>
                <th style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {garments.map((g, idx) => {
                const total = calculateGarmentTotal(g);
                return (
                  <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#64748b" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: "600", color: "#475569" }}>{getGarmentId(g, idx)}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: "600", color: "#0f172a" }}>{g.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{g.fabric || g.category?.name || "—"}</div>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center", color: "#334155" }}>{g.quantity}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "monospace" }}>
                      {g.priceRange?.min === g.priceRange?.max ? (
                        <>₹{g.priceRange?.min}</>
                      ) : (
                        <>₹{g.priceRange?.min} – ₹{g.priceRange?.max}</>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: "600", color: "#be185d" }}>
                      {total.min === total.max ? (
                        <>₹{total.min}</>
                      ) : (
                        <>₹{total.min} – ₹{total.max}</>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <td colSpan="4" style={{ padding: "16px", textAlign: "right", fontSize: "15px", fontWeight: "600" }}>Subtotal Range</td>
                <td style={{ padding: "16px", textAlign: "right", fontSize: "16px", fontWeight: "700", color: "#be185d" }}>
                  ₹{subtotalMin} – ₹{subtotalMax}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment + Delivery Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Payment Card */}
          <div style={{ backgroundColor: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "4px", height: "16px", backgroundColor: "#be185d", borderRadius: "4px" }} />
              PAYMENT SUMMARY
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#475569" }}>Advance Paid</span>
                <span style={{ fontWeight: "600", color: "#059669" }}>₹{advance}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#475569" }}>Payment Mode</span>
                <span style={{ fontWeight: "500", color: "#334155" }}>{order.advancePayment?.method || "UPI"}</span>
              </div>
              <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "#be185d" }}>Balance Due</span>
                <span style={{ fontWeight: "700", color: "#be185d", fontSize: "18px" }}>
                  ₹{balanceMin} – ₹{balanceMax}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div style={{ backgroundColor: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9" }}>
            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "4px", height: "16px", backgroundColor: "#be185d", borderRadius: "4px" }} />
              DELIVERY INFO
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0" }}>Estimated Delivery</p>
                <p style={{ fontSize: "18px", fontWeight: "700", color: "#be185d", margin: 0 }}>
                  {formatDate(order.deliveryDate)}
                </p>
              </div>
              {order.specialNotes && (
                <div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px 0" }}>Special Instructions</p>
                  <p style={{ fontSize: "13px", margin: 0, fontStyle: "italic", color: "#475569" }}>"{order.specialNotes}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Signature */}
        <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px dashed #e2e8f0", paddingTop: "25px" }}>
          <div>
            <h3 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 4px 0" }}>DREAMFIT COUTURE</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0" }}>
              {import.meta.env.VITE_COMPANY_ADDRESS || "Chennai, Tamil Nadu"}
            </p>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0" }}>
              📞 {import.meta.env.VITE_COMPANY_PHONE || "+91 98765 43210"}  |  ✉️ {import.meta.env.VITE_EAMIL || "care@dreamfit.com"}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ borderTop: "2px solid #be185d", width: "200px", paddingTop: "10px" }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#be185d", margin: 0 }}>Authorized Signature</p>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>For Dreamfit Couture</p>
            </div>
          </div>
        </div>

        {/* Thank You Note */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Thank you for your business, {order.customer?.name?.split(" ")[0] || "Valued Customer"}!
          </p>
          <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "12px" }}>
            Invoice #{order.orderId || "DF-001"} • Generated on {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>
      </div>
    </div>
  );
});

export default OrderInvoice;