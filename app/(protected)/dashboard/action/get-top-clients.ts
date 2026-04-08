import { api } from "@/lib/api_python";

export async function getTopClients() {
    const response = await api.get("/dashboard/top10");
    try{
        return response
    }catch(error){
        console.error("Error fetching top clients data:", error)
        throw error
    }
}