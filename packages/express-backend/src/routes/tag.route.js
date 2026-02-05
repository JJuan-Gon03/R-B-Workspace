import express from "express";
import {
  postTag,
  getTagsForUser,
  deleteTag,
} from "../controllers/tag.controller.js";

const router = express.Router();

router.post("/", postTag);

router.get("/:user_id", getTagsForUser);

router.delete("/:tagId", deleteTag);

export default router;
