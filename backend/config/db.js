import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`database connected properly!`);
  } catch (err) {
    console.log(`database not connected!`);
    console.log(err.message);
    process.exit(1);
  }
};
