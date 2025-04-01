import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Create user route
router.post("/register", UserController.createUser);

// Login user
router.post("/login", UserController.loginUser);

// Get single user - protected route
router.get("/:id", auth(), UserController.getSingleUser);

// Change password - protected route
router.post("/change-password", auth(), UserController.changePassword);

//send otp for reset password
router.post("/reset-password-otp", UserController.sendCodeToEmailForForgetPassword);

// Reset password
router.post("/reset-password", UserController.resetPassword);

// Email verification
router.post("/verify-email", UserController.verifyEmail);
router.post("/verify-login", UserController.verifyLogin);
export const UserRoutes = router;
