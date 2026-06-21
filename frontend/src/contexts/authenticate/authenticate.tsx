'use client'

import { createContext, useEffect, useState } from "react";
import { AuthenticateContextType } from "./type";
import { UserDetail } from "@/src/api/types/user";
import { User } from "@/src/api/User";
import { parseAccessToken } from "@/src/utils/jwt-parser";

const AuthenticateContext = createContext<AuthenticateContextType | undefined>(undefined);

const AuthenticateProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<UserDetail | null>(null);
    const [isFetch, setIsFetch] = useState<boolean>(true);

    const fetchState = async () => {
        setIsFetch(true);
        const stored = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || null;
        if (!stored) {
            setState(null);
            setIsFetch(false);
            return;
        }
        const jwt = parseAccessToken(stored) || null;
        if (!jwt) {
            setState(null);
            setIsFetch(false);
            return;
        }

        try {
            const cls = new User();
            const result = await cls.GetUserDetailById(jwt.id);
            setState(result);
        } catch {
            setState(null);
        } finally {
            setIsFetch(false);
        }
    }

    const clearAuth = () => {
        setState(null);
        setIsFetch(false);
    }

    useEffect(() => {
        fetchState();
    }, [])

    return (
        <AuthenticateContext.Provider value={{ state, isFetch, refreshAuth: fetchState, clearAuth }}>
            {children}
        </AuthenticateContext.Provider>
    )
}

export { AuthenticateContext, AuthenticateProvider }
