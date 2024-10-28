import User from "../models/user.model.js";
import { generateTokenAndCookie } from "../utils/generateTokenAndCookie.js";
import { sendVerificationEmail } from "../nodeMailer/email.js";
export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const alreadyExists = await User.findOne({ email });

    if (alreadyExists) {
      return res
        .status(409)
        .json({ success: false, message: "User Already Exists." });
    }

    const min = 100000; // minimum 6-digit number
    const max = 999999; // maximum 6-digit number
    const verificationToken = Math.floor(Math.random() * (max - min + 1)) + min;
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    generateTokenAndCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);
    return res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your email.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  res.send(`login controller`);
};

export const logout = async (req, res) => {
  res.send(`logout controller`);
};
