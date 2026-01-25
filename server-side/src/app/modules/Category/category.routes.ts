import { Router } from "express";
import CategoryControllers from "./category.controllers";
import auth from "../../middlewares/cookieAuth";
import CategoryValidations from "./category.validations";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

// * ========== Admin Routes Start ==========

router.post(
    "/",
    auth("ADMIN"),
    validateRequest(CategoryValidations.createCategorySchema),
    CategoryControllers.createCategory,
);

router.get("/admin", auth("ADMIN"), CategoryControllers.getAllAdminCategories);

router.patch(
    "/:categoryId",
    auth("ADMIN"),
    validateRequest(CategoryValidations.updateCategorySchema),
    CategoryControllers.updateCategory,
);

router.delete(
    "/:categoryId",
    auth("ADMIN"),
    CategoryControllers.deleteCategory,
);

router.patch(
    "/:categoryId/toggle-status",
    auth("ADMIN"),
    CategoryControllers.toggleCategoryStatus,
);

// * ========== Admin Routes Start ==========

// * ========== Public Routes Start ==========

router.get("/", CategoryControllers.getAllCategories);

router.get("/:categoryId", CategoryControllers.getSingleCategory);

// * ========== Public Routes End ==========

export const CategoryRoutes = router;
