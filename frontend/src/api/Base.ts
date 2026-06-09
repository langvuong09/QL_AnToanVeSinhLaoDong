import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";

interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    message?: string;
    data?: T;
}

export class Base {
    private api: AxiosInstance;

    constructor(config: CreateAxiosDefaults = {}) {
        this.api = axios.create(config);
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.api.interceptors.request.use(
            (config) => {
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
            (error) => {
                // Handle error later
                /**
                 * - Unauthenticate
                 * - Forbiden
                 * - ...
                 */
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
            const axiosError = error as AxiosError;

            return {
                success: false,
                code: 0,
                message: "",
                data: null
            }
        }
    }
}