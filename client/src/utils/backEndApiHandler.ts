import axios from "axios";
//import { accessToken } from "./utils"

const backEndApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
const apiCall = async (
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  body: object | null
) => {
  try {
    let res = await backEndApi({ url, method, data: body });

    if (res.status === 204) {
      return { data: { status:"success",data: [] }};
    }

    return {data: res.data};
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status;
      if (status === 401 && url !== "/api/auth/login") {
        try {
          await backEndApi({
            url: "/api/auth/refresh",
            method: "POST",
            data: {},
          });
          const res = await backEndApi({ url, method, data: body });
          return { data: res.data};
        } catch (refreshError) {
          return { data: {status:"error",message:"Unexpected Error Occurred. Please Try Again", data:null} };
        }
      }

      const message =
        e.response?.data?.message || "An error occurred";

      return { data: {status:"error",message:message, data:null}};
    } else if (e instanceof Error) {
      return {data: {status:"error",message:"Unexpected Error Occurred. Please Try Again", data:null}};
    } else {
      console.error("Unknown error:", e);
      return {
        data: {data:{status:"error",message:"Unexpected Error Occurred. Please Try Again", data:null}},
      };
    }
  }
};

export default apiCall;
