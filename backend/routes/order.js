const express = require("express");

const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  allSellerOrders,
  updateOrder,
  deleteOrder,
  totalOrders,
  totalSales,
  customerSales,
  salesPerMonth,
} = require("../controllers/orderController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

router.route('/admin/orders/').get(isAuthenticatedUser, authorizeRoles('admin'), allOrders);
router.route('/U&D/order/:id').put(isAuthenticatedUser, authorizeRoles('admin','seller'), updateOrder)
router.route('/admin/order/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

router.route('/seller/orders/').get(isAuthenticatedUser, authorizeRoles('seller'), allSellerOrders);
router.get('/orders/total-orders', totalOrders);
router.get('/orders/total-sales', totalSales);
router.get('/orders/customer-sales', customerSales);
router.get('/orders/sales-per-month', salesPerMonth);
module.exports = router;
