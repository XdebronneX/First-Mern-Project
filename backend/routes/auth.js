const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googlereactLogin ,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const upload = require("../utils/multer");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/me", isAuthenticatedUser, getUserProfile);

// router.route('/register').post(registerUser);
router.post("/register", upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/googlereactLogin").post(googlereactLogin); //GoogleLogin Route
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, upload.single("avatar"), updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
