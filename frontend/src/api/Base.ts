import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { getRefresh, setRefresh, getAccessToken } from "./common/Refresh";

interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    message?: string;
    data?: T;
}

export class Base {
    private api: AxiosInstance;

    constructor(config: CreateAxiosDefaults = {}) {
        this.api = axios.create({
            withCredentials: true,
            ...config
        });
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.api.interceptors.request.use(
            (config) => {
                // Khi data là FormData, xóa Content-Type để browser tự set
                // multipart/form-data với boundary đúng
                if (config.data instanceof FormData) {
                    delete config.headers['Content-Type'];
                }

                // Send token in each request
                const local = localStorage.getItem("accessToken") || null;
                const session = sessionStorage.getItem("accessToken") || null;
                const stored = local ? local : session;
                if (stored) {
                    config.headers.Authorization = `Bearer ${stored}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        this.api.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                // Handle error later
                /**
                 * - Unauthenticate
                 * - Forbiden
                 * - ...
                 */
                const origin: any = error.config;
                if (error.response?.status === 401 && !origin._retry) {
                    origin._retry = true;

                    if (!getRefresh()) {
                        const promise = getAccessToken().finally(() => setRefresh(null));
                        setRefresh(promise);
                    }

                    const newToken = await getRefresh();
                    if (!newToken) {
                        alert("Phiên đăng nhập hết hạn, đăng nhập lại");
                        window.location.href = "/login";
                        return;
                    }

                    const local = localStorage.getItem("accessToken") !== "";
                    if (local) {
                        localStorage.setItem("accessToken", newToken);
                    } else {
                        sessionStorage.setItem("accessToken", newToken);
                    }
                    origin.headers.Authorization =
                        `Bearer ${newToken}`;

                    return this.api(origin);

                }

                return Promise.reject(error);
            }
        );
    }

    protected async execute<T>(config: AxiosRequestConfig): Promise<ApiResponse<T | null>> {
        try {
            const response = await this.api.request<ApiResponse<T>>(config);

            return {
                success: true,
                code: response.data.code,
                message: response.data.message,
                data: response.data.data,
            }

        } catch (error: any) {
            const axiosError = error as AxiosError<ApiResponse>;
            const serverMessage = (axiosError.response?.data as any)?.message;

            return {
                success: false,
                code: axiosError.response?.status ?? 0,
                message: typeof serverMessage === 'string' ? serverMessage : (Array.isArray(serverMessage) ? serverMessage[0] : "Có lỗi xảy ra. Vui lòng thử lại sau"),
                data: null
            }
        }
    }
}