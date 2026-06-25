'use client'

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthenticateContext } from "@/src/contexts/authenticate/authenticate";
import TopHero from "@/src/components/TopHero";

const DashboardPage = () => {
    const router = useRouter();
    const authenticate = useContext(AuthenticateContext);

    useEffect(() => {
        if (!authenticate?.isFetch) {
            if (authenticate?.state?.role?.code === 'business') {
                router.replace('/business-info');
            } else {
                router.replace('/accounts');
            }
        }
    }, [authenticate?.isFetch, authenticate?.state, router]);

    return null;
}

export default DashboardPage;
