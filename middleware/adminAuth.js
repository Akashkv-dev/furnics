
const adminAuth = function (req, res, next) {
    if (req.session.adminloggedIn) {
      next();
    } else {
      res.render("admin/admin");
    }
  };
  module.exports = adminAuth;