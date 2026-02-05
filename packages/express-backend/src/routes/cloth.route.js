import express from "express";
import {
  postCloth,
  getClothes,
  deleteCloth,
} from "../controllers/cloth.controller.js";

const router = express.Router();

router.post("/", postCloth);

router.get("/:user_id", getClothes);

router.delete("/:clothId", deleteCloth);

export default router;
