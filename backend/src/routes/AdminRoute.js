"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = __importDefault(require("../controllers/admin/AdminController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/verify", auth_1.jwtCheck, auth_1.jwtParse, AdminController_1.default.verifyAdminAccess);
exports.default = router;
