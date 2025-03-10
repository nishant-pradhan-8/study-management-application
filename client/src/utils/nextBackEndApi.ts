import axios from "axios";
const nextBackendApi = axios.create({
  baseURL: "https://study-management-web-app.onrender.com",
  headers: {
    Accept: "application/json",
  },
});

nextBackendApi.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    console.log(error);
  }
);

const nextBackEndApiCall = async (
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  body: object | null | FormData
) => {
  try {
    const res = await nextBackendApi({ url, method, data: body });

    return { status: "success", data: res.data, error: null };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message =
        e.response?.data?.message || e.message || "An error occurred";
      return { status: "error", error: message, data: null };
    } else if (e instanceof Error) {
      console.error("Standard error:", e.message);
      return { status: "error", error: e.message, data: null };
    } else {
      console.error("Unknown error:", e);
      return {
        status: "error",
        error: "An unknown error occurred",
        data: null,
      };
    }
  }
};
export default nextBackEndApiCall;
