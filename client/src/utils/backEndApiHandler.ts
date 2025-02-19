import axios from "axios"
const backEndApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization":`Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
      },
})
const apiCall = async(url:string,method:"GET" | "POST" | "PATCH" | "PUT" | "DELETE", body: object | null)=>{
    try{
     
       const res = await backEndApi({url,method,data:body})
        return { status: "success", data: res.data, error: null };
    }catch(e){
        return { 
            status: "error", 
            error: e instanceof Error ? e.message : "An error occurred", 
            data: null 
          };
    }
}


export default apiCall