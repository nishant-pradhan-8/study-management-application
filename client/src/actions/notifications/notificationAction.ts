import apiCall from "@/utils/backEndApiHandler";
export const getNotification = async () => {
    const {data} = await apiCall("/api/notification/getNotifications","GET",null)
    return data
 
};

export const markNotificationRead = async () => {
    const {data} = await apiCall("/api/notification/markNotificatonsRead","PATCH",{read:true})
    return data
};

