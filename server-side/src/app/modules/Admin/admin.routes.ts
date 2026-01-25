import { Router } from "express";
import AdminControllers from "./admin.controllers";
import { AdminProductsRoutes } from "../AdminProducts/adminProducts.routes";
import { AdminOrdersRoutes } from "../AdminOrders/adminOrders.routes";
import auth from "../../middlewares/cookieAuth";

const router = Router();

// Inject Product Routes
router.use("/products", auth("ADMIN"), AdminProductsRoutes);

// Inject Order Routes
router.use("/orders", auth("ADMIN"), AdminOrdersRoutes);

router.get("/statistics", auth("ADMIN"), AdminControllers.getStatistics);

router.post("/login", AdminControllers.login);

export const AdminRoutes = router;
