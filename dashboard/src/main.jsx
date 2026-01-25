import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./routes/dashboard/index.jsx";
import UsersList from "./routes/users/index.jsx";
import UserDetailsPage from "./routes/users/Details/index.jsx";
import ProductsList from "./routes/products/index.jsx";
import EditProductPage from "./routes/products/edit/index.jsx";
import OrdersList from "./routes/orders/index.jsx";
import OrderDetailsPage from "./routes/orders/Details/index.jsx";
import CategoriesPage from "./routes/categories/index.jsx";
import { Provider } from "react-redux";
import store from "./store/app/store.js";
import Login from "./routes/login/index.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import baseApiSlice from "./store/app/baseApi/baseApiSlice.js";
import AuthGuard from "./components/AuthGuard/index.jsx";
import NotFound from "./routes/not-found/index.jsx";

const demoUserData = {
    email: "john.doe@example.com",
    status: "ACTIVE",
    verified: true,
    profile: {
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        phone: "+1 (555) 123-4567",
    },
    createdAt: "2024-03-15T10:30:00Z",
    totalOrders: 12,
    totalPayments: 2450.0,
    totalCarts: 3,
};

const demoProduct = {
    id: "prod_123",
    name: "Wireless Headphones Pro",
    price: 149.99,
    purchasePrice: 89.99,
    brand: "TechSound",
    availability: "IN_STOCK",
    categoryId: "cat_electronics",
    stock: 50,
    variations: [
        { name: "Color", values: ["Black", "White", "Blue"] },
        { name: "Size", values: ["Small", "Medium", "Large"] },
    ],
    specs: [
        { name: "Battery Life", value: "30 hours" },
        { name: "Bluetooth Version", value: "5.0" },
        { name: "Weight", value: "250g" },
    ],
    description: {
        banner: "https://via.placeholder.com/800x400",
        description: {
            content: "High-quality wireless headphones with premium sound",
        },
        video: "https://example.com/video.mp4",
    },
};

const demoOrderData = {
    id: "ORD-12345",
    totalAmount: 849.97,
    status: "PROCESSING",
    createdAt: "2025-01-20T10:30:00Z",
    customer: {
        user: {
            email: "john.doe@example.com",
            profile: {
                name: "John Doe",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
                phone: "+1 (555) 123-4567",
            },
        },
    },
    orderItems: [
        {
            id: "item_1",
            quantity: 2,
            price: 149.99,
            product: {
                id: "prod_1",
                name: "Wireless Headphones Pro",
                price: 149.99,
                purchasePrice: 89.99,
                images: ["https://placehold.co/600x400"],
            },
        },
        {
            id: "item_2",
            quantity: 1,
            price: 549.99,
            product: {
                id: "prod_2",
                name: "Smart Watch Ultra",
                price: 549.99,
                purchasePrice: 349.99,
                images: ["https://placehold.co/600x400"],
            },
        },
    ],
    payment: {
        status: "COMPLETED",
    },
};

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthGuard>
                <App />
            </AuthGuard>
        ),
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/users",
                element: <UsersList />,
            },
            {
                path: "/users/:id",
                element: <UserDetailsPage />,
                loader: async ({ params }) => {
                    return (
                        await store.dispatch(
                            baseApiSlice.endpoints.fetchSingleUser.initiate({
                                id: params.id,
                            }),
                        )
                    ).data;
                },
            },
            {
                path: "/products",
                element: <ProductsList />,
            },
            {
                path: "/products/edit",
                element: <EditProductPage />,
            },
            {
                path: "/products/edit/:id",
                element: <EditProductPage />,
                loader: async ({ params }) => {
                    return (
                        await store.dispatch(
                            baseApiSlice.endpoints.fetchSingleProduct.initiate({
                                id: params.id,
                            }),
                        )
                    ).data;
                },
            },
            {
                path: "/orders",
                element: <OrdersList />,
            },
            {
                path: "/orders/:id",
                element: <OrderDetailsPage />,
                loader: async ({ params }) => {
                    return (
                        await store.dispatch(
                            baseApiSlice.endpoints.fetchSingleOrder.initiate({
                                id: params.id,
                            }),
                        )
                    ).data;
                },
            },
            {
                path: "/categories",
                element: <CategoriesPage />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
        />

        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>,
);
