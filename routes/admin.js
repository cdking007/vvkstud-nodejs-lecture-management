const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/is-auth");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/addpost", isLoggedIn, isAdmin, adminController.getAddPost);
router.post("/addpost", isLoggedIn, isAdmin, adminController.postAddPost);

router.get("/users", isLoggedIn, isAdmin, adminController.getUsersList);
router.post(
  "/user/reject",
  isLoggedIn,
  isAdmin,
  adminController.postRejectUser
);
router.post(
  "/user/approve",
  isLoggedIn,
  isAdmin,
  adminController.postApproveUser
);
router.post(
  "/user/delete",
  isLoggedIn,
  isAdmin,
  adminController.postDeleteUser
);

router.get(
  "/user/edit/:userid",
  isLoggedIn,
  isAdmin,
  adminController.getUserEdit
);
router.post("/user/edit", isLoggedIn, isAdmin, adminController.postUserEdit);
module.exports = router;
