import { Router } from "express";
import CartControllers from "./cart.controllers";
import CartValidations from "./cart.validations";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.post(
    "/",
    validateRequest(CartValidations.createCartSchema),
    CartControllers.createCart,
);

router.get("/", CartControllers.getAllCarts);

router.patch(
    "/:cartId",
    validateRequest(CartValidations.updateCartSchema),
    CartControllers.updateCart,
);

router.delete("/:cartId", CartControllers.deleteCart);

export const CartRoutes = router;
