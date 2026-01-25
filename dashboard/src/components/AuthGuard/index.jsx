import { useEffect } from "react";
import { useFetchInfoQuery } from "../../store/features/admin/adminApiSlice";
import { useNavigate } from "react-router-dom";
import { setAuthData } from "../../store/features/config/configSlice";
import { useDispatch } from "react-redux";
import { Loader } from "lucide-react";

const AuthGuard = ({ children, reverse = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: authResponse, isLoading, isError } = useFetchInfoQuery({});

    useEffect(() => {
        if (isLoading) return;

        if (!authResponse?.data) {
            navigate("/login", { replace: true });
        } else {
            if (reverse) {
                navigate("/", { replace: true });
            }

            dispatch(setAuthData(authResponse.data.profile));
        }
    }, [authResponse, isLoading, navigate, dispatch]);

    if (isLoading || !authResponse) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
                <Loader className="animate-spin text-blue-600" size={48} />
                <p className="mt-4 text-gray-600 text-sm">Loading…</p>
            </div>
        );
    }

    return children;
};

export default AuthGuard;
