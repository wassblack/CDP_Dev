//To check if the user is authenticated must add to every ressource page
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
          // req.user is available for use here
          return next(); }
      
        // denied. redirect to login
        res.redirect('/users/login')
      }
}