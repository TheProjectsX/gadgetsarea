import { Router } from "express";
import UsersControllers from "./users.controllers";

const router = Router();

router.get("/", UsersControllers.getAllUsers);

router.get("/:id", UsersControllers.getSingleUser);

router.patch("/:id/status", UsersControllers.changeUserStatus);

router.delete("/:id", UsersControllers.deleteUser);

router.get("/:id/orders", UsersControllers.getUserOrders);

export const UsersRoutes = router;
