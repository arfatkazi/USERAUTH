import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age must be a positive number"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

//generating hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (err) {
    next(err);
  }
});

//comapring the password
userSchema.methods.comparePassWord = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// gnerate reset token

userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = token;

  this.resetPasswordTokenExpiresAt = Date.now() + 3600000;

  return token;
};
//generate Verification Token
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.verificationToken = token;
  this.verificationTokenExpiresAt = Date.now() + 3600000;

  return token;
};

// is token expired

userSchema.methods.isTokenExpired = function (tokenType) {
  const now = Date.now();

  return this[`${tokenType}ExpiresAt`] < now;
};

const User = mongoose.model("User", userSchema);

export default User;
