import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    return {success: true, message: "Connection successful!"};
  } catch (error) {
    throw new Error("Connection failed!");
  }
};

export default connectDB;
