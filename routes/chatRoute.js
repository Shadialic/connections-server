import { Router } from "express";

import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controller/chatController.js";
import { upload } from "../utils/Multer/multer.js";
const chatRouter = Router();

// GET
chatRouter.get("/", fetchChats);
// POST
chatRouter.post("/users", accessChat);
chatRouter.post("/group", upload.single("image"), createGroupChat);
//PUT
chatRouter.put("/rename", renameGroup);
chatRouter.put("/groupremove", removeFromGroup);
chatRouter.put("/groupadd", addToGroup);

export default chatRouter;
