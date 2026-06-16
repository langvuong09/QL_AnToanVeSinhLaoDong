import { UserDetail } from "@/src/api/types/user"

export type AuthenticateContextType = {
    state: UserDetail | null;
    isFetch: boolean;
    refreshAuth: () => void;
}