import {User} from "@/types/types"
import apiCall from "@/utils/backEndApiHandler";
import { RegistrationInfo } from "@/components/registration-form";
import { LoginInfo } from "@/components/login-form";
export const registerUser = async(registrationInfo:RegistrationInfo)=>{
    const {data} = await apiCall("/api/auth/register","POST",{registrationInfo})
    return data
}
export const loginUser = async(loginInfo:LoginInfo)=>{
    const {data} = await apiCall("/api/auth/login","POST",{loginInfo})
    return data
}


export const getUserDetails = async () => {
    const {data} = await apiCall("/api/users/userDetails","GET",null)
   
    return data
};

export const updateProfile = async (changedFields: Partial<User>) => {
    const {data} = await apiCall("/api/users/updateUserInfo","PATCH",{changedFields})
    return {status:data.status}
};

export const sendFriendRequest = async (receiverEmail:string) => {
    const {data} = await apiCall("/api/users/sendFriendRequest","POST",{receiverEmail})
    return data
}

export const getFriendList = async () => {
    const {data} = await apiCall("/api/users/friends","GET",null)
    return data
};

export const removeFriend = async(friendUserId:string)=>{
    const {data} = await apiCall("/api/users/removeFriend","DELETE",{friendUserId})
    return data
}

export const getSentRequests = async () => {
    const {data} = await apiCall("/api/users/sentFriendRequests","GET",null)
    return data
 
};

export const getPendingRequests = async () => {
    const {data} = await apiCall("/api/users/pendingFriendRequests","GET",null)
    return data
};
