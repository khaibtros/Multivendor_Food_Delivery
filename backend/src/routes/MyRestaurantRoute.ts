import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.get(
  "/order",
  jwtCheck,
  jwtParse,
  MyRestaurantController.getMyRestaurantOrders
);

// router.patch(
//   "/order/:orderId/status",
//   jwtCheck,
//   jwtParse,
//   MyRestaurantController.updateOrderStatus
// );

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.any(),
  validateMyRestaurantRequest,
  MyRestaurantController.createMyRestaurant
);

router.put(
  "/",
  jwtCheck,
  jwtParse,
  upload.any(),
  validateMyRestaurantRequest,
  MyRestaurantController.updateMyRestaurant
);

export default router;
