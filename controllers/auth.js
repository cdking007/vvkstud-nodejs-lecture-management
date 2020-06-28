const User = require("../models/user");
const bcryptjs = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("login");
};

exports.getSignup = (req, res, next) => {
  res.render("signup");
};

exports.postSignup = async (req, res, next) => {
  const { fname, lname, username, email, password } = req.body;

  if (!fname || !lname || !username || !email || !password) {
    req.flash("error", "All fields are required!");
    return res.redirect("/auth/signup");
  }
  try {
    const ucheck = await User.findOne({ username });
    if (ucheck) {
      req.flash("error", "username is already in use");
      return req.session.save((err) => {
        return res.status(422).redirect("/auth/signup");
      });
    }

    const ucheck2 = await User.findOne({ email });
    if (ucheck2) {
      req.flash("error", "email is already in use");
      return req.session.save((err) => {
        return res.status(422).redirect("/auth/signup");
      });
    }
    if (!username.match(/^[^a-zA-Z0-9]+$/)) {
      req.flash("error", "special character in username is not allowed!");
      return req.session.save((err) => {
        return res.status(422).redirect("/auth/signup");
      });
    }
    const hashedPw = await bcryptjs.hash(password, 8);
    const user = await new User({
      fname,
      lname,
      email,
      password: hashedPw,
      username,
    });
    await user.save();
    req.flash("success", "signup successfully");
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      req.flash("error", "Credential details are wrong!");
      return req.session.save((err) => {
        return res.status(422).redirect("/auth/login");
      });
    }

    const pwIsValid = await bcryptjs.compare(password, user.password);

    if (!pwIsValid) {
      req.flash("error", "Credential details are wrong!");
      return req.session.save((err) => {
        return res.status(422).redirect("/auth/login");
      });
    }

    if (user.status === "rejected" && user.role === "prof") {
      req.flash("error", "we Did not allowed Proffesors sorry!");
      //   req.flash("error", "chal professor nikal pehli fursat me nikal!");
      return req.session.save((err) => {
        return res.status(422).redirect("/auth/login");
      });
    }

    if (user.status === "pending") {
      req.flash(
        "error",
        "We reviewing your account! please contact admin to approve the id!"
      );
      return req.session.save((err) => {
        return res.status(422).redirect("/auth/login");
      });
    }

    if (user.status === "rejected") {
      req.flash("error", "Your Account has beed Rejected!");
      return req.session.save((err) => {
        return res.status(422).redirect("/auth/login");
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      return res.redirect("/");
    });
  } catch (err) {
    req.flash("error", "Something went wrong! please contact adminitrator!");
    console.log(err);
    return req.session.save((err) => {
      return res.redirect("/auth/login");
    });
  }
};
