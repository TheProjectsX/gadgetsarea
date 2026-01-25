import { Router } from "express";
import AdminOrdersControllers from "./adminOrders.controllers";

const router = Router();

router.get("/", AdminOrdersControllers.getAllOrders);

router.get("/:id", AdminOrdersControllers.getSingleOrder);

router.patch("/:id/status", AdminOrdersControllers.changeOrderStatus);

router.delete("/:id", AdminOrdersControllers.deleteOrder);

export const AdminOrdersRoutes = router;
