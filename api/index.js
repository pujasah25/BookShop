import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import cors from "cors";

dotenv.config(); // to access the value from env file
const app = express(); // execute express
// db
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to mongoDB."))
  .catch((err) => console.log("DB ERROR", err));

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// router middleware
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

const port = process.env.PORT || 8800;

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
