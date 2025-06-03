import User from "../model/usermodel.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokenAndSaveCookies } from "../jwt/token.js";

const userSchema = z.object({
  email: z.string().email({ message: "invalid email address" }),
  username: z
    .string()
    .min(3, { message: "username atleast 3 characters long" }),
  password: z.string().min(6, { message: "password atleat 6 characters long" }),
});

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validation = userSchema.safeParse({ email, username, password });

    if (!validation.success) {
      const errorMessage = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ errors: errorMessage });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, username, password: hashPassword });
    await newUser.save();
    if (newUser) {
      const token = await generateTokenAndSaveCookies(newUser._id, res);
      res
        .status(201)
        .json({ message: "user registered successfully", newUser, token });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(200).json({ message: " Invalid email or password" });
    }
    const token = await generateTokenAndSaveCookies(user._id, res);
    res
      .status(200)
      .json({ message: "User logged in successfully", user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error logging user" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      path: "/",
    });
    res.status(200).json({ message: "user logout succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error while logout" });
  }
};
