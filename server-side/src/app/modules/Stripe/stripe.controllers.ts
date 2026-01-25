import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import StripeServices from "./stripe.services";
import Stripe from "stripe";
import stripe from "../../../helpers/stripe/stripe";
import config from "../../../config";

export const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event | null;
    try {
        event = stripe.webhooks.constructEvent(
            payload,
            sig,
            config.stripe.webhook_secret!,
        );
        console.log("Webhook verified:", event.type);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        res.status(400).send(
            `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        return;
    }

    const response = await StripeServices.webhook(event);
    res.send(response);
});
