import { Router } from "express";
import OrdersControllers from "./orders.controllers";
import OrdersValidations from "./orders.validations";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.post(
    "/",
    validateRequest(OrdersValidations.createOrdersSchema),
    OrdersControllers.createOrder,
);

router.get("/", OrdersControllers.getMyOrders);

router.get("/:orderId", OrdersControllers.getSingleOrder);

router.patch("/:orderId/cancel", OrdersControllers.cancelOrder);

export const OrdersRoutes = router;
