const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct,createProductReview, getProductReviews, getAdminProducts, getSellerProducts, deleteReview,productSales } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.get('/products', getProducts);

router.get('/product/:id', getSingleProduct);
router.put('/review',isAuthenticatedUser, createProductReview);
router.get('/reviews',isAuthenticatedUser, getProductReviews)

router.get('/admin/products', isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router.post('/add/product/new', isAuthenticatedUser, authorizeRoles('admin','seller'), upload.array('images', 10),newProduct);
router.route('/U&D/product/:id').put(isAuthenticatedUser, authorizeRoles('admin','seller'), updateProduct).delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.route('/U&D/product/:id').put(isAuthenticatedUser, authorizeRoles('admin','seller'), upload.array('images', 10), updateProduct)
router.route('/reviews').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteReview)

router.get('/seller/products', isAuthenticatedUser, authorizeRoles('seller'), getSellerProducts);
// router.post('/seller/product/new', isAuthenticatedUser, authorizeRoles('seller'), upload.array('images', 10),newProduct);
// router.route('/seller/product/:id').put(isAuthenticatedUser, authorizeRoles('seller'), updateProduct).delete(isAuthenticatedUser, authorizeRoles('seller'), deleteProduct);
// router.route('/seller/product/:id').put(isAuthenticatedUser, authorizeRoles('seller'), upload.array('images', 10), updateProduct)
router.get('/products/sales', productSales);
module.exports = router;