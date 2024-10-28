import mongoose from "mongoose";
import debug from "debug";
const log = debug("app:database");
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log(`"Database connected properly!"`);
  } catch (err) {
    log(`"Database not connected!"`);
    log(`Error: ${err.message}`);
    process.exit(1);
  }
};
