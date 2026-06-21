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
        if (!stored) return;
        const jwt = parseAccessToken(stored) || null;
        console.log(jwt)
        if (!jwt) return;
        const cls = new User();
        const result = await cls.GetUserDetailById(jwt.id);
        setState(result);
        setIsFetch(false);
    }

    useEffect(() => {
        fetchState();
    }, [])

    return (
        <AuthenticateContext.Provider value={{ state, isFetch, refreshAuth: fetchState }}>
            {children}
        </AuthenticateContext.Provider>
    )
}

export { AuthenticateContext, AuthenticateProvider }