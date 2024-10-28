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
      min: [0, "Age must be a positive number"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
      index: true,
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

// userSchema.index({ email: 1 });

// GENERATING THE HASH PASSWORD
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
    console.log(`error : ${err.message}`);
  }
});

// COMPARING THE PASSWORD

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// GENERATE RESET TOKEN
userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = token;
  this.resetPasswordTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

// GENERATE VERIFICATION TOKEN
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = token;
  this.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

// Check if token is expired
userSchema.methods.isTokenExpired = function (tokenType) {
  const now = Date.now();
  if (tokenType === "resetPasswordToken") {
    return this.resetPasswordTokenExpiresAt < now;
  } else if (tokenType === "verificationToken") {
    return this.verificationTokenExpiresAt < now;
  }
  throw new Error(`Invalid token type: ${tokenType}`);
};

const User = mongoose.model("User", userSchema);

export default User;
