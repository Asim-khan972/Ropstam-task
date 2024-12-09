import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail";
import { generateRandomPassword } from "../utils/randomPassword";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateJWT";

/**
 * Registers a new user by checking if the user already exists,
 * generating a random password, and sending a welcome email.
 *
 * @param {Request} req - The request object containing the user's details.
 * @param {Response} res - The response object used to send the response.
 */

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: "Name and email are required" });
      return;
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Generate a random password
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create the user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    await sendEmail(email, name, randomPassword);

    res
      .status(201)
      .json({ message: "User registered successfully, email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User registration failed" });
  }
};

/**
 * Logs in the user by checking the provided email and password.
 * If valid, generates a JWT token for authentication.
 *
 * @param {Request} req - The request object containing the user's credentials.
 * @param {Response} res - The response object used to send the response.
 */

export const login = async (req: Request, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !email) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", token: "token" });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
