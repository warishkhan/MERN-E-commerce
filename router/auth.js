const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

//mongod db connection routes
require("../database/conn");

//schema routes
const User = require("../model/schema");

//router object
const router = express.Router();
router.use(cookieParser());
const authenticate = require("../middleware/middleware");

// CREATE POST || POST
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(401).json({ message: "All fields are required" });
  }
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "User already exist with this" });
    } else if (password !== cpassword) {
      return res.status(409).json({ message: "Passwords do not match" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      const register = await user.save();
      res.status(201).json({ message: "user registered successfull" });
    }
  } catch (error) {
    console.log(error + "Error in finding the email");
  }
});

//login post
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(403)
      .json({ message: "Please provide both Email and password" });
  }

  const userLogin = await User.findOne({ email: email });
  try {
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        return res.status(401).json({ message: " invalid login detaild" });
      } else {
        res.status(201).json({ message: "login succesfull" });
      }
    } else {
      return res.status(500).json({ error: "something went wrong" });
    }
  } catch (error) {
    throw error;
  }
});

//get user post
router.get("/account", authenticate, (req, res) => {
  res.send(req.rootUser);
});

//get user post
router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

//logout 
router.get("/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.status(200).send("User logout");
});

module.exports = router;
