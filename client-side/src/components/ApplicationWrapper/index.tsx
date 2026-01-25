"use client";

import React from "react";
import Navbar from "../Navbar";
import { Provider } from "react-redux";
import store from "@/store/app/store";
import { Bounce, ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
// import Auth from "../Auth";
import Footer from "../Footer";

const ProviderWrapped = ({ children }: { children: React.ReactNode }) => {

    


    return (
        <>
            <NextTopLoader showSpinner={false} />
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
            {/* <Auth /> */}
            {/* Navbar */}
            <Navbar />

            {/* Main Section */}
            <main className="flex-1 grow flex justify-center w-full px-5 py-10">
                <div className="w-full space-y-10 mb-10">{children}</div>
            </main>

            <Footer />
        </>
    );
};

const ApplicationWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Provider store={store}>
                <ProviderWrapped>{children}</ProviderWrapped>
            </Provider>
        </>
    );
};

export default ApplicationWrapper;
