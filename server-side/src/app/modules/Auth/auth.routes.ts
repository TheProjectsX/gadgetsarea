import express from "express";
import auth from "../../middlewares/cookieAuth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controllers";
import { AuthValidation } from "./auth.validations";
import { passport } from "../../../config/passportSetup";
import config from "../../../config";

const router = express.Router();

router.post(
    "/register",
    validateRequest(AuthValidation.userRegisterSchema),
    AuthController.register,
);

router.post("/login", AuthController.loginWithEmail);
router.post("/logout", AuthController.logoutUser);

router.put(
    "/change-password",
    auth(),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    AuthController.changePassword,
);

// We don't have SMTP to use this
// router.post("/forgot-password", AuthController.forgotPassword);
// router.post("/reset-password", AuthController.resetPassword);

router.post(
    "/refresh-token",
    validateRequest(AuthValidation.refreshTokenValidationSchema),
    AuthController.refreshToken,
);

// // Google Login Routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${config.url.frontend}/login`,
        successRedirect: `${config.url.frontend}/`,
    }),
);
export const AuthRoutes = router;
