

// // routes/notification.routes.js - COMPLETE FIXED VERSION

// import express from 'express';
// import { protect } from '../middleware/auth.middleware.js';
// import Notification from '../models/Notification.js';  // ✅ MUST HAVE!
// import {
//   getNotifications,
//   getUnreadCount,
//   markAsRead,
//   markAllAsRead,
//   deleteNotification,
//   getNotificationById,
//   createNotification
// } from '../controllers/notification.controller.js';

// const router = express.Router();

// // All routes require authentication
// router.use(protect);

// // ==================== DEBUG ROUTES (FIRST) ====================
// router.get('/debug-recipient', protect, async (req, res) => {
//   try {
//     console.log("\n🔍 ===== DEBUG RECIPIENT ROUTE =====");
//     console.log("User ID:", req.user._id);
//     console.log("User Role:", req.user.role);
    
//     // Get ALL notifications for this user
//     const allForUser = await Notification.find({ 
//       recipient: req.user._id 
//     }).sort({ createdAt: -1 }).lean();
    
//     console.log(`📊 Total notifications for user: ${allForUser.length}`);
    
//     // Get with specific model
//     const withModel = await Notification.find({ 
//       recipient: req.user._id,
//       recipientModel: 'CuttingMaster' 
//     }).lean();
    
//     // Get distinct models
//     const distinctModels = await Notification.distinct('recipientModel', {
//       recipient: req.user._id
//     });
    
//     // Check the specific test notification
//     const specific = await Notification.findById('69aa7db0dd7bce77d3b3d2bd').lean();
    
//     res.json({
//       success: true,
//       userId: req.user._id,
//       userRole: req.user.role,
//       totalForUser: allForUser.length,
//       withCorrectModel: withModel.length,
//       distinctModels,
//       specificNotification: specific,
//       allNotifications: allForUser.map(n => ({
//         id: n._id,
//         model: n.recipientModel,
//         title: n.title,
//         type: n.type,
//         createdAt: n.createdAt
//       }))
//     });
//   } catch (error) {
//     console.error("❌ Debug route error:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message,
//       stack: error.stack 
//     });
//   }
// });

// // ==================== POST ROUTE ====================
// router.post('/', protect, async (req, res) => {
//   try {
//     console.log("\n📝 ===== POST NOTIFICATION =====");
//     console.log("Request body:", req.body);
    
//     const notification = await createNotification({
//       type: req.body.type,
//       recipient: req.body.recipient || req.user._id,
//       recipientModel: req.body.recipientModel || 'User',
//       title: req.body.title,
//       message: req.body.message,
//       reference: req.body.reference || {},
//       priority: req.body.priority || 'normal'
//     });
    
//     console.log("✅ Notification created:", notification._id);
    
//     res.status(201).json({ success: true, data: notification });
//   } catch (error) {
//     console.error("❌ POST error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== GET ROUTES ====================
// router.get('/unread-count', protect, getUnreadCount);
// router.get('/', protect, getNotifications);
// router.get('/:id', protect, getNotificationById);

// // ==================== UPDATE ROUTES ====================
// router.patch('/:id/read', protect, markAsRead);
// router.patch('/mark-all-read', protect, markAllAsRead);

// // ==================== DELETE ROUTES ====================
// router.delete('/:id', protect, deleteNotification);

// export default router;

// routes/notification.routes.js - COMPLETE FIXED VERSION

import express from 'express';
import mongoose from 'mongoose';  // ✅ ADD THIS!
import { protect } from '../middleware/auth.middleware.js';
import Notification from '../models/Notification.js';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationById,
  createNotification
} from '../controllers/notification.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ==================== DEBUG ROUTES (FIRST) ====================

/**
 * @route   GET /api/notifications/debug-recipient
 * @desc    Debug route to check recipient issues
 * @access  Private
 */
router.get('/debug-recipient', async (req, res) => {
  try {
    console.log("\n🔍 ===== DEBUG RECIPIENT ROUTE =====");
    console.log("User ID:", req.user._id);
    console.log("User Role:", req.user.role);
    
    const userId = req.user._id;
    const userIdStr = userId.toString();
    
    // Try different query methods
    const [
      asObjectId,
      asString,
      withModel,
      distinctModels,
      specific
    ] = await Promise.all([
      // Find with ObjectId
      Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .lean(),
      
      // Find with string
      Notification.find({ recipient: userIdStr })
        .sort({ createdAt: -1 })
        .lean(),
      
      // Find with correct model
      Notification.find({ 
        recipient: userId,
        recipientModel: 'CuttingMaster' 
      }).lean(),
      
      // Get distinct models
      Notification.distinct('recipientModel', {
        $or: [
          { recipient: userId },
          { recipient: userIdStr }
        ]
      }),
      
      // Check specific test notification
      Notification.findById('69aa7db0dd7bce77d3b3d2bd').lean()
    ]);
    
    // Combine unique notifications
    const allNotifications = [...asObjectId, ...asString];
    const uniqueNotifications = Array.from(
      new Map(allNotifications.map(n => [n._id.toString(), n])).values()
    );
    
    console.log(`📊 Found ${uniqueNotifications.length} unique notifications`);
    
    res.json({
      success: true,
      debug: {
        userId: {
          objectId: userId,
          string: userIdStr,
          objectIdType: typeof userId,
          stringType: typeof userIdStr
        },
        counts: {
          asObjectId: asObjectId.length,
          asString: asString.length,
          unique: uniqueNotifications.length,
          withCorrectModel: withModel.length
        },
        distinctModels,
        specificNotification: specific,
        notifications: uniqueNotifications.map(n => ({
          id: n._id,
          recipient: n.recipient,
          recipientType: typeof n.recipient,
          recipientModel: n.recipientModel,
          title: n.title,
          type: n.type,
          createdAt: n.createdAt,
          isRead: n.isRead
        }))
      }
    });
  } catch (error) {
    console.error("❌ Debug route error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});

// ==================== POST ROUTE ====================

/**
 * @route   POST /api/notifications
 * @desc    Create a new notification (for testing)
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    console.log("\n📝 ===== POST NOTIFICATION =====");
    console.log("Request body:", req.body);
    
    // ✅ Convert recipient to ObjectId if it's a valid string
    let recipientId = req.body.recipient || req.user._id;
    
    if (typeof recipientId === 'string' && mongoose.Types.ObjectId.isValid(recipientId)) {
      recipientId = new mongoose.Types.ObjectId(recipientId);
    }
    
    console.log("✅ Using recipient:", recipientId);
    console.log("✅ Recipient type:", typeof recipientId);
    
    const notification = await createNotification({
      type: req.body.type,
      recipient: recipientId,
      recipientModel: req.body.recipientModel || 'User',
      title: req.body.title,
      message: req.body.message,
      reference: req.body.reference || {},
      priority: req.body.priority || 'normal'
    });
    
    console.log("✅ Notification created:", notification._id);
    
    res.status(201).json({ 
      success: true, 
      data: notification 
    });
  } catch (error) {
    console.error("❌ POST error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== GET ROUTES ====================

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notifications count
 * @access  Private
 */
router.get('/unread-count', getUnreadCount);

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for current user
 * @access  Private
 */
router.get('/', getNotifications);

/**
 * @route   GET /api/notifications/:id
 * @desc    Get single notification by ID
 * @access  Private
 */
router.get('/:id', getNotificationById);

// ==================== UPDATE ROUTES ====================

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.patch('/:id/read', markAsRead);

/**
 * @route   PATCH /api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch('/mark-all-read', markAllAsRead);

// ==================== DELETE ROUTES ====================

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', deleteNotification);

// ==================== BULK OPERATIONS ====================

/**
 * @route   POST /api/notifications/bulk
 * @desc    Send bulk notifications to a role
 * @access  Private (Admin only)
 */
router.post('/bulk', protect, async (req, res) => {
  try {
    console.log("\n📢 ===== BULK NOTIFICATION =====");
    console.log("Request body:", req.body);
    
    const { role, type, title, message, reference, priority } = req.body;
    
    // Import controller function dynamically to avoid circular dependency
    const { sendBulkNotification } = await import('../controllers/notification.controller.js');
    
    const result = await sendBulkNotification({
      role,
      type,
      title,
      message,
      reference,
      priority
    });
    
    res.json({
      success: true,
      message: `Sent ${result.length} notifications`,
      count: result.length
    });
  } catch (error) {
    console.error("❌ Bulk notification error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;