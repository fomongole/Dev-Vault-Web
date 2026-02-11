import { jwtDecode } from "jwt-decode";

// The shape of JWT payload based on the NestJS backend
interface JwtPayload {
    sub: string;    // The User UUID (Subject)
    email: string;  // User Email
    exp: number;    // Expiration timestamp
    iat: number;    // Issued at timestamp
}

/**
 * Extracts the user ID (sub) from the stored JWT token.
 * Validates expiration before returning.
 */
export const getUserIdFromToken = (): string | null => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);

        // Check if the token is already expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            // Clean up if expired
            localStorage.removeItem("token");
            return null;
        }

        return decoded.sub;
    } catch (error) {
        // If token is malformed
        console.error("Failed to decode token:", error);
        return null;
    }
};