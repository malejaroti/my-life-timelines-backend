import express from "express"
import { Request, Response, NextFunction, Router} from 'express';
import validateToken from "../middlewares/auth.middleware";
const router = Router();
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.model"

//POST "/api/auth/signup" -> Register information about the user (including credentials)
router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);

  const { name, username, email, password } = req.body;

  //validation
  // all the info is received or is not empty (email, password, username)
  if (!username || !email || !password) {
    res.status(400).json({ errorMessage: "Username , email and passwords are mandatory" });
    return; // stop the execution of the route
  }
  // Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one digit, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ errorMessage: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character." });
    return;
  }

  // Email validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ errorMessage: "Provide a valid email address." });
    return;
  }

  try {
    // Check if there isn't another user with that same email
    const foundUser = await User.findOne({ email: email });
    if (foundUser !== null) {
      res.status(409).json({ errorMessage: "An account with this email already exists" });
      return;
    }

    // hash the password 
    const hashPassword = await bcrypt.hash(password, 12); 

    const response = await User.create({
      name,
      username,
      email,
      password: hashPassword,
      profilePicture: ""
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// POST "/api/auth/login" => verify the credentials of the user and send a token
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    res.status(400).json({ errorMessage: "Email and passwords are mandatory" });
    return; // stop the execution of the route
  }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser === null) {
      res.status(400).json({ errorMessage: "No user registered with that email" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ errorMessage: "the password is not correct" });
      return;
    } else {
      // res.status(200).json({errorMessage: "Password correct"})
      // Deconstruct the user object to omit the password
      const { _id, email } = foundUser;
      console.log("foundUser:", foundUser);

      // Create an object that will be set as the token payload
      const payload = { _id, email };
      // console.log("payload:",payload)

      // const payload = {
      //     _id: foundUser._id,
      //     email: foundUser.email
      // };
      // console.log("payload:",payload)

      // Ensure TOKEN_SECRET is defined
      const tokenSecret = process.env.TOKEN_SECRET;
      if (!tokenSecret) {
        throw new Error("TOKEN_SECRET environment variable is not defined");
      }
      // Create and sign the token
      const authToken = jwt.sign(payload, tokenSecret, { algorithm: "HS256", expiresIn: "2w" });

      // Send the token as the response
      res.status(200).json({ authToken: authToken });
    }
    // res.json{foundUser}
    // res.send("testin, all good")
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => Validate the token and send the info of the user who logged in (functionality only for the frontend)
router.get("/verify", validateToken, (req: Request, res: Response) => {
  console.log("req.payload", req.payload);
  res.status(200).json(req.payload);
});

const authRouter = router
export default authRouter
// module.exports = authRouter;
