import { useState } from "react";

export default function usePopUpMessage(){
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>("")
    return{
        loading,
        setLoading,
        error,
        setError,
        message, setMessage
    }
}