import express from "express";
import { getSaved, postSaved, deleteSaved } from "../controllers/saved.controller.js";

const router = express.Router();

router.get("/:user_id", getSaved);
router.post("/", postSaved);
router.delete("/:user_id/:listing_id", deleteSaved);

export default router;
