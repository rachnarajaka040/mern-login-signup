const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser=require("../middleware/fetchuser");
const JWT_SECRET = "jj";

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          error: "Please enter a unique value for email",
        });
      }
      //const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, 12);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json({ authtoken });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("internal some error");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          error: "USer not found",
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          error: "Invalid email or password",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);



router.post('/getuser',fetchuser,async(req, res) => {
  try {
  const userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.status(200).send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal Server Error");
  }

})
module.exports = router;
