
const adminAuth = function (req, res, next) {
    if (req.session.adminloggedIn) {
      next();
    } else {
      res.redirect("/admin/admin");
    }
  };
  module.exports = adminAuth;