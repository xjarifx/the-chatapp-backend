import dotenv from "dotenv";
dotenv.config();

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// sign-in & SMART sign-up (auto acc creation then auto sign-in)
export const auth = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (username.length < 1 || username.length > 16) {
    return res.status(400).json({
      message: "Username must be between 1 and 16 characters",
    });
  }

  if (password.length < 1 || password.length > 16) {
    return res.status(400).json({
      message: "Password must be between 1 and 16 characters",
    });
  }

  try {
    const isUserExist = await User.findOne({ username });
    if (isUserExist) {
      const isPasswordValid = await bcrypt.compare(
        password,
        isUserExist.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credential" });
      }
      // TODO: let user in
      const token = jwt.sign(
        {
          userId: isUserExist._id,
          username: isUserExist.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIMIT,
        }
      );

      const { password: _, ...userData } = isUserExist.toObject();
      return res
        .status(200)
        .json({ message: "Login successful", user: userData, token });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      // TODO: let user in
      const token = jwt.sign(
        {
          userId: newUser._id,
          username: newUser.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIMIT,
        }
      );
      const { password: _, ...userData } = newUser.toObject();
      return res
        .status(201)
        .json({ message: "User created and logged in", user: userData, token });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
