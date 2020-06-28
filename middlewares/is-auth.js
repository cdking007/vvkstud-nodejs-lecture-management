exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  if (!req.user) {
    req.session.destroy((err) => {
      return res.status(422).redirect("/auth/login");
    });
  }

  // if (req.user.status === "rejected" || !req.user.status) {
  //   req.session.destroy((err) => {
  //     return res.status(422).redirect("/auth/login");
  //   });
  // }

  if (req.user) {
    if (req.user.status === "rejected") {
      return req.session.destroy((err) => {
        return res.status(422).redirect("/auth/login");
      });
    }
  }

  return res.redirect("/auth/login");
};

exports.isNotLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  console.log("not admin");
  return res.render("404");
};
