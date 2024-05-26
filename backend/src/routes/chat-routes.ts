import { Router } from "express";
import { verifyToken } from "../utils/jwt-token-genrator.js";
import { chatCompletionValidator, validate } from "../utils/data-validators.js";
import {
  deleteChats,
  generateChatCompletion,
  sendChatsToUser,
  suggestion,
} from "../controllers/chat-controllers.js";

//Protected API
const chatRoutes = Router();
chatRoutes.post(
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);
chatRoutes.post("/suggestion", verifyToken, suggestion);

export default chatRoutes;