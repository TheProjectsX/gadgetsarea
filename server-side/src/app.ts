import express, { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import { stripeWebhook } from "./app/modules/Stripe/stripe.controllers";
// import { UserJwtPayload } from "./app/middlewares/cookieAuth";

const app: Application = express();

export const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173", "https://gadgetsarea.vercel.app", "https://gadgetsarea-dashboard.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

// Webhook Setup
app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook,
);

// Middleware setup
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Route handler for the root endpoint
app.get("/", (req: Request, res: Response) => {
    res.send({
        success: true,
        message: "Server running! 🏃‍♂️",
        server_name: "gadgets_area_backend",
        server_type: "WEB",
    });
});

// Setup API routes
app.use("/api", router);

// Error handling middleware
app.use(GlobalErrorHandler);

// 404 Not Found handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            method: req.method,
            message: "Your requested path is not found!",
        },
    });
});

export default app;
