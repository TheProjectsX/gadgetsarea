import { Router } from "express";
import ProductsControllers from "./products.controllers";

const router = Router();

router.get("/filters/:name", ProductsControllers.getProductFilters);

router.get("/", ProductsControllers.getProducts);

router.get("/:productId", ProductsControllers.getSingleProduct);

export const ProductsRoutes = router;
