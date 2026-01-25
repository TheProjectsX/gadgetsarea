import type { Metadata } from "next";
import "./globals.css";
import ApplicationWrapper from "@/components/ApplicationWrapper";

export const metadata: Metadata = {
    title: "Gadgets Area",
    description: "Your one-stop shop for the latest gadgets and electronics",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/png" href="/logo.png" />
            </head>
            <body className={`flex flex-col light min-h-screen font-ubuntu`}>
                <ApplicationWrapper>{children}</ApplicationWrapper>
            </body>
        </html>
    );
}
