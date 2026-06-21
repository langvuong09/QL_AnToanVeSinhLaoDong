import axios from "axios";

let promiseRefresh: Promise<string> | null = null;

const getRefresh = () => {
    return promiseRefresh;
}

const setRefresh = (promise: Promise<string> | null) => {
    promiseRefresh = promise;
}

const getAccessToken = async (): Promise<string> => {
    const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";

    const result = await axios.request({
        url: END_POINT + "/api/v1/auth/refresh-token",
        method: "POST",
        withCredentials: true
    });

    const newToken = result.data?.data?.accessToken || "";
    if (!newToken) {
        return "";
    }

    return newToken;
}

export { getRefresh, setRefresh, getAccessToken };