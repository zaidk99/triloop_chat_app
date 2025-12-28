import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {generateUniqueSuggestion} from '../utils/generateUniqueSuggestion.js';

export const signUp = async (req, res) => {
  try {
    let errors = [];
    const { fullName, username, email, password } = req.body;
    const existingEmailofUser = await User.findOne({ email });
    if (existingEmailofUser) {
       errors.push({field:"email",message:"Email already Registered ! Please Login or Use another email"})
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      const suggestions = [];
      const countOfSuggestions = 2;
      let attempts = 0;
      while(suggestions.length<countOfSuggestions && attempts <10){
        const newUsername = generateUniqueSuggestion(username);
        const existingNewUseraname = await User.findOne({username:newUsername});
        if(!existingNewUseraname && !suggestions.includes(newUsername)){
          suggestions.push(newUsername);
        }
        attempts++;
      }
      errors.push({
        field: "username",
        message: "Username already Taken",
        suggestions,
      });
    }

    if(errors.length>0){
      return res.status(400).json({errors});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    //   maxAge: 1 * 24 * 60 * 60 * 1000,
    // });

    res.status(201).json({
      message: "User registered",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "server error ", 
      error: process.env.NODE_ENV === "development" ? err.message: undefined });
  }
};


export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    //   maxAge: 1 * 24 * 60 * 60 * 1000,
    // });

    res.status(200).json({
      message: "Login successful",
      token,
      user:{
        id:user._id,
        username:user.username,
        email:user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: process.env.NODE_ENV === "development" && process.env.DEBUG_MODE === "true" ? err.message : undefined });
  }
};

// export const logOut = (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//   });
//   res.status(200).json({ message: "Logged out successfully" });
// };
