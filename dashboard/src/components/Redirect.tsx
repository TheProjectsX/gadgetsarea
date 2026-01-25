import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectProps {
    to: string;
}

const Redirect = ({ to }: RedirectProps) => {
    const navigate = useNavigate();

    console.log("Redirecting...")

    useEffect(() => {
        navigate(to);
    }, [navigate, to]);

    return null; // This component doesn't render anything itself
};

export default Redirect;
