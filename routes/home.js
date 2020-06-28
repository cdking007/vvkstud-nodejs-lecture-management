const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/is-auth");
const Post = require("../models/post");

router.get("/", isLoggedIn, async (req, res, next) => {
  if (!req.user) {
    return req.session.destroy((err) => {
      return res.status(422).redirect("/auth/login");
    });
  }
  try {
    const posts = await Post.find({ div: req.user.class });
    return res.render("index", { posts });
  } catch (err) {
    console.log(err);
  }
});
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    return res.status(422).redirect("/auth/login");
  });
});

router.get("/lecture/:lectureid", isLoggedIn, async (req, res, next) => {
  const postId = req.params.lectureid;

  try {
    const post = await Post.findOne({ div: req.user.class, _id: postId });
    if (!post) {
      return res.render("404");
    }
    return res.render("video", {
      post,
    });
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
