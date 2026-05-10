const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// All admin routes require both authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.get('/trips', adminController.getTrips);
router.get('/activities', adminController.getActivities);
router.get('/reports', adminController.getReports);

router.patch('/users/:userId/block', adminController.blockUser);
router.delete('/users/:userId', adminController.deleteUser);

// Analytics
router.get('/analytics/users', adminController.getUserAnalytics);
router.get('/analytics/trips', adminController.getTripAnalytics);
router.get('/analytics/cities', adminController.getCityAnalytics);
router.get('/analytics/revenue', adminController.getRevenueAnalytics);

module.exports = router;
