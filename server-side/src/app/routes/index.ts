import express, { RequestHandler } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { ProductsRoutes } from "../modules/Products/products.routes";
import { CartRoutes } from "../modules/Cart/cart.routes";
import { OrdersRoutes } from "../modules/Orders/orders.routes";
import auth from "../middlewares/cookieAuth";
import { MeRoutes } from "../modules/Me/me.routes";
import { CategoryRoutes } from "../modules/Category/category.routes";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { UsersRoutes } from "../modules/Users/users.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        handlers: [AuthRoutes],
    },
    {
        path: "/me",
        handlers: [auth(), MeRoutes],
    },
    {
        path: "/admin",
        handlers: [AdminRoutes],
    },
    {
        path: "/users",
        handlers: [auth("ADMIN"), UsersRoutes],
    },

    {
        path: "/categories",
        handlers: [CategoryRoutes],
    },
    {
        path: "/products",
        handlers: [ProductsRoutes],
    },
    {
        path: "/carts",
        handlers: [auth("CUSTOMER"), CartRoutes],
    },
    {
        path: "/orders",
        handlers: [auth("CUSTOMER"), OrdersRoutes],
    },
] satisfies {
    path: string;
    handlers: RequestHandler[];
}[];

moduleRoutes.forEach((route) => router.use(route.path, ...route.handlers));

export default router;
