import { XCircle } from "lucide-react";

const CheckoutFailed = () => {
    return (
        <div className="min-h-full flex items-center justify-center">
            <div className="bg-linear-to-br from-blue-500 to-blue-800 rounded-xl shadow-xl p-10 max-w-md w-full text-center">
                <XCircle className="mx-auto mb-4 h-16 w-16 text-white" />
                <h1 className="text-2xl font-semibold text-white mb-2">
                    Payment Failed
                </h1>
                <p className="text-gray-200">
                    We couldn’t process your payment. Please try again.
                </p>
            </div>
        </div>
    );
};

export default CheckoutFailed;
