const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const { isLoggedIn, isMovieOwner } = require("../middleware/auth");

// View all movies (protected)
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.render("index", { movies });
  } catch (err) {
    console.error("Error loading movies:", err);
    res.render("error", { message: "Failed to load movies." });
  }
});

// Show form to add a movie
router.get("/add", isLoggedIn, (req, res) => {
  res.render("add");
});

// Handle movie creation with validation
router.post("/add", isLoggedIn, async (req, res) => {
  const { name, description, year, genres, rating } = req.body;

  if (!name || !description || !year || !genres || !rating) {
    return res.render("error", { message: "All fields are required" });
  }

  if (rating < 1 || rating > 10) {
    return res.render("error", { message: "Rating must be between 1 and 10" });
  }

  try {
    await Movie.create({
      name,
      description,
      year,
      genres,
      rating,
      createdBy: req.session.user
    });

    res.redirect("/movies");
  } catch (err) {
    console.error("Error saving movie:", err);
    res.render("error", { message: "Something went wrong while saving the movie." });
  }
});

router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.render("error", { message: "Movie not found" });
    }
    res.render("details", { movie });
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.render("error", { message: "Failed to fetch movie details." });
  }
});

// Show edit form (owner only)
router.get("/:id/edit", isLoggedIn, isMovieOwner, async (req, res) => {
  res.render("edit", { movie: req.movie });
});

// Handle movie update
router.post("/:id/edit", isLoggedIn, isMovieOwner, async (req, res) => {
  const { name, description, year, genres, rating } = req.body;

  if (!name || !description || !year || !genres || !rating) {
    return res.render("error", { message: "All fields are required" });
  }

  if (rating < 1 || rating > 10) {
    return res.render("error", { message: "Rating must be between 1 and 10" });
  }

  try {
    await Movie.findByIdAndUpdate(req.params.id, {
      name,
      description,
      year,
      genres,
      rating
    });

    res.redirect(`/movies/${req.params.id}`);
  } catch (err) {
    console.error("Error updating movie:", err);
    res.render("error", { message: "Failed to update movie." });
  }
});

// Handle delete movie
router.post("/:id/delete", isLoggedIn, isMovieOwner, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect("/movies");
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.render("error", { message: "Failed to delete movie." });
  }
});

module.exports = router;
