import express from "express";
const router = express.Router();
import { requireSignin, isAdmin } from "../middlewares/auth.js"; // middlewares
import { create, update, remove, list, read, productsByCategory } from "../controllers/category.js"; // controllers

router.post("/category", requireSignin, isAdmin, create);
router.put("/category/:categoryId", requireSignin, isAdmin, update);
router.delete("/category/:categoryId", requireSignin, isAdmin, remove);
router.get("/categories", list);
router.get("/category/:slug", read);

router.get("/products-by-category/:slug", productsByCategory);


export default router;

