import { Router } from "express";

import AdminProductsControllers from "./adminProducts.controllers";
import AdminProductsValidations from "./adminProducts.validations";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../../helpers/file/upload";
import { uploadToImgbb } from "../../../helpers/image/uploadToImgbb";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = Router();

router.post(
    "/",
    upload.array("images", 5),
    uploadToImgbb,
    parseBodyData,
    validateRequest(AdminProductsValidations.createProductsSchema),
    AdminProductsControllers.createProduct,
);

router.patch(
    "/:productId",
    upload.array("images", 5),
    uploadToImgbb,
    parseBodyData,
    validateRequest(AdminProductsValidations.updateProductsSchema),
    AdminProductsControllers.updateProduct,
);

router.post(
    "/variations",
    validateRequest(AdminProductsValidations.productVariationsSchema),
    AdminProductsControllers.insertProductVariations,
);

router.post(
    "/specs",
    validateRequest(AdminProductsValidations.productSpecsSchema),
    AdminProductsControllers.insertProductSpecs,
);

router.post(
    "/description",
    upload.single("banner"),
    uploadToImgbb,
    parseBodyData,
    validateRequest(AdminProductsValidations.productDescriptionSchema),
    AdminProductsControllers.insertProductDescription,
);

router.patch(
    "/:productId/status",
    AdminProductsControllers.changeProductStatus,
);

router.patch("/:productId/tags", AdminProductsControllers.changeProductStatus);

router.delete("/:productId", AdminProductsControllers.deleteProduct);

router.get("/", AdminProductsControllers.getProducts);

router.get("/:productId", AdminProductsControllers.getSingleProduct);

export const AdminProductsRoutes = router;
