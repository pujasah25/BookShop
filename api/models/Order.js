import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {// set the product id, while creating order
    products: [{ type: ObjectId, ref: "Product" }], // each order will have the array of products
    payment: {},
    buyer: { type: ObjectId, ref: "User" }, // buyer from logged in user
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
