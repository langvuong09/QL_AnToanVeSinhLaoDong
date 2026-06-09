export type Notificate = {
    id: string;
    type: "success" | "warning" | "error";
    message: string;
}

export type NotificateContextType = {
    showNotification: (noti: {
        type: "success" | "warning" | "error";
        message: string;
    }) => void;
    closeNotification: (id: string) => void;
}