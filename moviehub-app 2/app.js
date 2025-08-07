const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const movieRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");

const app = express();

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1/moviesdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// View engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "superSecureSessionKey",
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/movies", movieRoutes);

// Redirect home page to /movies
app.get("/", (req, res) => {
  res.redirect("/movies");
});

// Catch-all 404
app.get("*", (req, res) => {
  res.status(404).render("error", { message: "Page not found" });
});

// Server start
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
