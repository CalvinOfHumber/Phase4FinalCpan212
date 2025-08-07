module.exports = {
  isLoggedIn: (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  },

  isMovieOwner: async (req, res, next) => {
    const Movie = require("../models/Movie");
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.createdBy !== req.session.user) {
      return res.status(403).render("error", { message: "Unauthorized access" });
    }
    req.movie = movie;
    next();
  }
};