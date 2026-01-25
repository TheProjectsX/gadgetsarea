import { CheckCircle } from "lucide-react";

const CheckoutSuccess = () => {
    return (
        <div className="min-h-full flex items-center justify-center">
            <div className="bg-linear-to-br from-blue-500 to-blue-800 rounded-xl shadow-xl p-10 max-w-md w-full text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-white" />
                <h1 className="text-2xl font-semibold text-white mb-2">
                    Payment Successful
                </h1>
                <p className="text-gray-200">
                    Your payment has been completed successfully.
                </p>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
