import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    exp: number;
    userId: number;
    [key: string]: any;
}

export const setToken = (token: string) => {
    localStorage.setItem("token", token);
}

export const getToken = (): string | null => {
    return localStorage.getItem("token");
}

export const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
}

export const isTokenExpired = (token: string): boolean => {
    const decoded: TokenPayload = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
        return true;
    }
    return false;
}

export const getUserIdFromToken = (): number | null => {
    const token = getToken();
    if (!token) {
        return null;
    }

    try {
        const decoded: TokenPayload = jwtDecode(token);
        return decoded.userId || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
