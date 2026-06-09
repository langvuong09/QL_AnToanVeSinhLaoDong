'use client'

import { createContext, JSX, useState } from "react";
import { Notificate, type NotificateContextType } from "./type";
import { v4 as uuidv4 } from "uuid";    

const NotificateContext = createContext<NotificateContextType | undefined>(undefined);

const NotificateProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notificate[]>([]);

    const showNotification = (
        noti: {
            type: "success" | "warning" | "error";
            message: string;
        }) => {
        const id = uuidv4();

        setNotifications(prev => [...prev, { id: id, type: noti.type, message: noti.message }]);

        setTimeout(() => {
            closeNotification(id);
        }, 3000);
    }

    const closeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    const getBgColor = (type: "success" | "warning" | "error"): string => {
        return type === "success" ? "bg-green-200" : type === "error" ? "bg-red-200" : "bg-yellow-200";
    }

    const getTextColor = (type: "success" | "warning" | "error"): string => {
        return type === "success" ? "text-green-700" : type === "error" ? "text-red-700" : "text-yellow-700";
    }

    const getIcon = (type: "success" | "warning" | "error"): JSX.Element => {
        return type === "success" ? (<i className="fa-solid fa-circle-check text-xl"></i>) : (<i className="fa-solid fa-circle-exclamation text-xl"></i>);
    }

    return (
        <NotificateContext.Provider value={{ showNotification, closeNotification }}>
            <div className="fixed space-y-5 top-4 left-1/2 -translate-x-1/2">
                {notifications && notifications.map((noti, idx) => (
                    <div key={idx} className={`flex px-4 py-2 min-w-100 justify-between ${getBgColor(noti.type)} ${getTextColor(noti.type)} rounded-lg gap-10`}>
                        <div className="flex items-center gap-2 text-sm">
                            {getIcon(noti.type)}
                            <span>{noti.message}</span>
                        </div>
                        <button className="text-sm font-semibold" onClick={() => closeNotification(noti.id)}>
                            x
                        </button>
                    </div>
                ))}
            </div>

            {children}
        </NotificateContext.Provider>
    )
}

export { NotificateContext, NotificateProvider }
