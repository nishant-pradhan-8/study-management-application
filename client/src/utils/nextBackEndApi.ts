import axios from "axios";
const nextBackendApi = axios.create({
    baseURL:"http://localhost:3000",
    headers:{
        "Accept": "application/json",
    }
})

nextBackendApi.interceptors.request.use((config)=>{
    if(config.data instanceof FormData){
        config.headers["Content-Type"] = "multipart/form-data";
    }else{
        config.headers["Content-Type"] = "application/json"
    }
    return config
},(error)=>{
    console.log(error)
})


const nextBackEndApiCall = async(url:string,method:"GET" | "POST" | "PATCH" | "PUT" | "DELETE", body: object | null | FormData)=>{
    try{
        const res = await nextBackendApi({url,method,data:body})
    
        return { status: "success", data: res.data, error: null }
    
    }catch(e){
        return { 
            status: "error", 
            error: e instanceof Error ? e.message : "An error occurred", 
            data: null 
          };
    }
    }
export default nextBackEndApiCall