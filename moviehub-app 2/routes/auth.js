const express = require("express");
const router = express.Router();

const users = [];

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("error", { message: "All fields are required" });
  }

  const existing = users.find(u => u.username === username);
  if (existing) {
    return res.render("error", { message: "Username already exists" });
  }

  users.push({ username, password });
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.render("error", { message: "Invalid login credentials" });
  }

  req.session.user = username;
  res.redirect("/movies/add"); 
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
