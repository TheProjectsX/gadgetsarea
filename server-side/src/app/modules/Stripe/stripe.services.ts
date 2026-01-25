import prisma from "../../../shared/prisma";
import Stripe from "stripe";

export const webhook = async (event: Stripe.Event) => {
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;
            const metadata = session?.metadata as {
                userId: string;
                email: string;
                customerId: string;
                orderId: string;
            };

            if (
                !metadata.userId ||
                !metadata.email ||
                !metadata.customerId ||
                !metadata.orderId
            ) {
                console.error("Missing metadata in session");
                return { received: true, acknowledged: false };
            }

            const user = await prisma.user.findUnique({
                where: { id: metadata.userId },
            });

            if (!user) {
                console.error("User not found:", metadata.userId);
                return { received: true, acknowledged: false };
            }

            const order = await prisma.order.findUnique({
                where: {
                    id: metadata.orderId,
                },
            });
            if (!order) {
                console.error("Order not found:", metadata.orderId);
                return { received: true, acknowledged: false };
            }

            if (order.customerId !== metadata.customerId) {
                console.log(
                    "Customer ID mismatch for order:",
                    metadata.orderId,
                );
                return { received: true, acknowledged: false };
            }

            const payment = await prisma.payment.create({
                data: {
                    orderId: order.id,
                    amount: order.totalAmount,
                    transactionId: session.id,
                    status: "COMPLETED",
                    customerId: metadata.customerId,
                },
            });

            await prisma.order.update({
                where: {
                    id: order.id,
                },
                data: {
                    status: "PROCESSING",
                },
            });

            console.log(
                "Payment recorded for order:",
                order.id,
                " | payment:",
                payment.id,
            );
            return { received: true, acknowledged: true };

        case "payment_intent.succeeded":
            break;

        case "payment_intent.payment_failed":
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
            break;
    }
    return { received: true, acknowledged: false };
};

export default { webhook };
