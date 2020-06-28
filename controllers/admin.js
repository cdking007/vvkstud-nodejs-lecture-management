const Post = require("../models/post");
const User = require("../models/user");

exports.getAddPost = (req, res, next) => {
  res.render("admin/addpost");
};

exports.postAddPost = async (req, res, next) => {
  const { title, subjects, div, day, videoUrl } = req.body;
  try {
    const post = await new Post({
      videoUrl,
      subjects,
      div,
      date: day,
      title,
    });
    await post.save();
    res.status(201).redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getUsersList = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.render("admin/user-list", { users });
  } catch (err) {
    console.log(err);
  }
};

exports.postRejectUser = async (req, res, next) => {
  const { userid } = req.body;
  try {
    const user = await User.findOne({ _id: userid });
    if (!user) {
      req.flash("error", "No user found!");
      return res.redirect("/admin/users");
    }
    user.status = "rejected";
    await user.save();
    req.flash("success", "user rejected successfully!");
    req.session.save((err) => {
      return res.redirect("/admin/users");
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postApproveUser = async (req, res, next) => {
  const { userid } = req.body;
  try {
    const user = await User.findOne({ _id: userid });
    if (!user) {
      req.flash("error", "No user found!");
      return res.redirect("/admin/users");
    }
    user.status = "approve";
    await user.save();
    req.flash("success", "user approved successfully!");
    req.session.save((err) => {
      return res.redirect("/admin/users");
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteUser = async (req, res, next) => {
  const { userid } = req.body;
  try {
    const user = await User.findOne({ _id: userid });
    if (!user) {
      req.flash("error", "No user found!");
      return res.redirect("/admin/users");
    }
    await user.remove();
    req.flash("success", "user deleted successfully!");
    req.session.save((err) => {
      return res.redirect("/admin/users");
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUserEdit = async (req, res, next) => {
  const userid = req.params.userid;

  try {
    const user = await User.findOne({ _id: userid });

    if (!user) {
      return res.status(404).render("404");
    }

    return res.render("admin/Edit-user", { user });
  } catch (err) {
    console.log(err);
  }
};

exports.postUserEdit = async (req, res, next) => {
  const { username, email, fname, lname, status, role, div, userid } = req.body;

  // console.log(username, email, fname, lname, status, role, div, userid);

  if (!username || !email || !fname || !lname || !status || !role || !div) {
    req.flash("error", "all field are required!");
    return req.session.save((err) => {
      return res.status(422).redirect("/admin/user/edit/" + userid);
    });
  }

  try {
    const user = await User.findOne({ email, username });
    if (!user) {
      req.flash("error", "something is Wrong!");
      return res.status(500).redirect("/admin/users");
    }
    user.email = email;
    user.username = username;
    user.fname = fname;
    user.lname = lname;
    user.status = status;
    user.role = role;
    user.class = div;

    await user.save();
    req.flash("success", user.username + " updated!");
    return res.redirect("/admin/users");
  } catch (err) {
    console.log(err);
  }
};
