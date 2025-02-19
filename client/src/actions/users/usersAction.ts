import {User} from "@/types/types"
import apiCall from "@/utils/backEndApiHandler";

export const getUserDetails = async () => {
    const {data} = await apiCall("/api/users/userDetails","GET",null)
    return data
};

export const updateProfile = async (changedFields: Partial<User>) => {
    const {data,status} = await apiCall("/api/users/updateUserInfo","PATCH",{changedFields})
    return {data,status}
};

export const sendFriendRequest = async (receiverId: string) => {
    const {data} = await apiCall("/api/users/sendFriendRequest","POST",{receiverId})
    return data
}

export const getFriendList = async () => {
    const {data} = await apiCall("/api/users/friends","GET",null)
    return data
};

export const getSentRequests = async () => {
    const {data} = await apiCall("/api/users/sentFriendRequests","GET",null)
    return data
 
};

export const getPendingRequests = async () => {
    const {data} = await apiCall("/api/users/pendingFriendRequests","GET",null)
    return data
};
