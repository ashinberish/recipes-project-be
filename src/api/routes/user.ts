import Router from "express";
import { RAResponse } from "../../utils/RAresponse";
import asyncHandler from "../middlewares/api-utils";
import * as UserController from "../controllers/user";

const router = Router();

// Not important! Used for testing purposes
router.get(
  "/test",
  asyncHandler(async () => new RAResponse("Backend Works!"))
);

router.post("/create-user", asyncHandler(UserController.createNewUser));

router.post("/login", asyncHandler(UserController.login));

export default router;
