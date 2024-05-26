import { Router } from "express";
import { verifyToken } from "../utils/jwt-token-genrator.js";
import { getQRCode } from "../controllers/whatsapp-controllers.js";

const whatsappRoutes = Router();

whatsappRoutes.get("/get-qrcode", verifyToken, getQRCode);

export default whatsappRoutes;