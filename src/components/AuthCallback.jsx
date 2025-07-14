// components/AuthCallback.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AuthCallback() {
    const { isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            const returnTo = localStorage.getItem("auth_return_to") || "/movie";
            localStorage.removeItem("auth_return_to");
            navigate(returnTo, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const error = query.get('error');
        const error_description = query.get('error_description');

        if (error === "access_denied" && error_description?.includes("verify your email")) {
            navigate("/check-email");
        } else {
            // Handle other cases or continue the login flow
            // E.g., call handleRedirectCallback from Auth0 if no error
        }
    }, [location, navigate])    
    return null;
}