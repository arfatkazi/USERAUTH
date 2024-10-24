import User from "../models/user.model.js";

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

    const verificationToken = Math.floor(
      10000 + Math.random() + 90000
    ).toString();

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      verificationToken,
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
