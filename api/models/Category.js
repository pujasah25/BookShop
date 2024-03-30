import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
  slug: { // react js => slug: react-js
    type: String,
    unique: true,
    lowercase: true,
  },
});

export default mongoose.model("Category", categorySchema);
