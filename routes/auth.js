const express = require("express");
const authController = require("../controllers/auth");

const { isNotLoggedIn } = require("../middlewares/is-auth");

const router = express.Router();

router.get("/auth/login", isNotLoggedIn, authController.getLogin);
router.get("/auth/signup", isNotLoggedIn, authController.getSignup);

router.post("/auth/signup", isNotLoggedIn, authController.postSignup);
router.post("/auth/login", isNotLoggedIn, authController.postLogin);

module.exports = router;
