import { Router } from "express";
import UsersControllers from "./me.controllers";
import { upload } from "../../../helpers/file/upload";
import { uploadToImgbb } from "../../../helpers/image/uploadToImgbb";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = Router();

router.get("/", UsersControllers.getCurrentUser);

router.patch("/profile", UsersControllers.updateProfile);

router.patch(
    "/avatar",
    upload.single("avatar"),
    uploadToImgbb,
    UsersControllers.updateAvatar,
);

export const MeRoutes = router;
