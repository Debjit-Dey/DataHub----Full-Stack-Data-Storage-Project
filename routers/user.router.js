const express = require("express");
const userModel = require("../models/user.models");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("test route");
});

router.get("/", (req, res) => {
  res.render("register");
});

router.post(
  "/",
  body("email").isEmail().withMessage("Please enter valid email"),
  body("username")
    .isLength({ min: 6 })
    .withMessage("Username should be atleast 6 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    // console.log(errors.array());
    const { email, username, password } = req.body;
    const alreadyUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (alreadyUser) {
      return res.status(400).render("messages//registerError", {
        errors: errors.array(),
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!errors.isEmpty()) {
      return res.status(400).render("messages//registerError", {
        errors: errors.array(),
        message: "Invalid data",
      });
    } else {
      const newUser = await userModel.create({
        email,
        username,
        password: hashedPassword,
      });
      // console.log(newUser);
      res.status(201).render("messages//registerSuccess", {});
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  body("username")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Username should be atleast 6 characters long"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 characters long"),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const errors = validationResult(req);
      if (!errors?.isEmpty()) {
        return res.status(400).render("messages//loginError", {
          errors: errors?.array(),
          message: "Invalid data",
        });
      }
      const user = await userModel.findOne({
        username,
      });
      if (!user) {
        return res.status(400).render("messages//loginError", {
            errors: errors?.array(),
            message: "Username or password is incorrect",
          });
      } else {
        const passValidation = await bcrypt.compare(password, user.password);
        if (!passValidation) {
            return res.status(400).render("messages//loginError", {
                errors: errors?.array(),
                message: "Username or password is incorrect",
              });
        }
      }

      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });

      res.status(200).render("home",{
        files: user?.files || []
      });
    } catch (error) {
        return res.status(400).render("messages//uploadError", {
            errors: error?.array(),
            message: error.message,
          });
        
    }
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });
  res.redirect("/login");
});

module.exports = router;
