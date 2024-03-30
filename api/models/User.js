import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true, //     puja, to avoid extra space at beigin
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    address: {
      type: String,
      trim: true,
    },
    role: { // admin, customer
      type: Number,
      default: 0, // 0 by default for customer 
    },
  },
  { timestamps: true } // created and updated date, automatically
);

export default mongoose.model("User", userSchema);

