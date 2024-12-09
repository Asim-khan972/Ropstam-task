import express from "express";
import {
  createCar,
  getCars,
  updateCar,
  deleteCar,
  getCarById,
} from "../controllers/carController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
router.get("/", getCars);
router.post("/", authMiddleware, createCar);
router.get("/:id", authMiddleware, getCarById);
router.put("/:id", authMiddleware, updateCar);
router.delete("/:id", authMiddleware, deleteCar);

export const carRouter = router;
