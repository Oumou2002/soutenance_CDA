import jwt_decode from "jwt-decode";
import Cookie from "js-cookie";
import { useAuthStore } from "../store/auth";
import axios from "./axios";

export const login = async (email, password) => {
    try {
        const payload = {
            email: (email || "").trim(),
            password,
        };
        const { data, status } = await axios.post("user/token/", payload);

        if (status === 200) {
            setAuthUser(data.access, data.refresh);
        }

        return { data, error: null };
    } catch (error) {
        let errorMessage = "Une erreur est survenue.";

        if (!error.response) {
            errorMessage =
                "Impossible de joindre le serveur. Verifiez que le backend est lance et que CORS est configure.";
        } else if (typeof error.response.data?.detail === "string") {
            errorMessage = error.response.data.detail;
            if (
                errorMessage.includes(
                    "No active account found with the given credentials"
                )
            ) {
                errorMessage = "Identifiants invalides. Verifiez votre e-mail et mot de passe.";
            }
        } else if (typeof error.response.data?.message === "string") {
            errorMessage = error.response.data.message;
        } else if (Array.isArray(error.response.data?.non_field_errors)) {
            errorMessage = error.response.data.non_field_errors.join(" ");
        }

        return { data: null, error: errorMessage };
    }
};

export const register = async (full_name, email, password, password2) => {
    try {
        const normalizedEmail = (email || "").trim().toLowerCase();
        const { data } = await axios.post("user/register/", {
            full_name: (full_name || "").trim(),
            email: normalizedEmail,
            password,
            password2,
        });

        await login(normalizedEmail, password);
        return { data, error: null };
    } catch (error) {
        let errorMessage = "Une erreur est survenue.";

        if (!error.response) {
            errorMessage =
                "Impossible de joindre le serveur. Verifiez que le backend est lance et que CORS est configure.";
        } else if (typeof error.response.data?.detail === "string") {
            errorMessage = error.response.data.detail;
        } else if (error.response.data && typeof error.response.data === "object") {
            const flatErrors = Object.values(error.response.data).flat().join(" ");
            if (flatErrors) {
                errorMessage = flatErrors;
            }
        }

        return { data: null, error: errorMessage };
    }
};

export const logout = () => {
    Cookie.remove("access_token");
    Cookie.remove("refresh_token");
    useAuthStore.getState().setUser(null);
};

export const setUser = async () => {
    const access_token = Cookie.get("access_token");
    const refresh_token = Cookie.get("refresh_token");

    if (!access_token || !refresh_token) {
        useAuthStore.getState().setLoading(false);
        return;
    }

    if (isAccessTokenExpired(access_token)) {
        const response = await getRefreshToken(refresh_token);
        setAuthUser(response.data.access, response.data.refresh);
        return;
    }

    setAuthUser(access_token, refresh_token);
};

export const setAuthUser = (access_token, refresh_token) => {
    if (access_token && refresh_token) {
        const isHttps = window.location.protocol === "https:";

        Cookie.set("access_token", access_token, {
            expires: 1,
            secure: isHttps,
            sameSite: "Lax",
        });

        Cookie.set("refresh_token", refresh_token, {
            expires: 7,
            secure: isHttps,
            sameSite: "Lax",
        });

        const user = jwt_decode(access_token) ?? null;
        if (user) {
            useAuthStore.getState().setUser(user);
        }
    }

    useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
    try {
        const refresh_token = Cookie.get("refresh_token");
        return await axios.post("user/token/refresh/", { refresh: refresh_token });
    } catch (error) {
        logout();
        throw error;
    }
};

export const isAccessTokenExpired = (access_token) => {
    try {
        const decodedToken = jwt_decode(access_token);
        return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
        return true;
    }
};
