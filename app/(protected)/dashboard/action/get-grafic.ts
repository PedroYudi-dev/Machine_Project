import { api } from "@/lib/api_python";

export async function getResumeDashBoardRisc() {
    const response  = await api.get("/dashboard/resumo")
    try {
        return response
    } catch (error) {
        console.error("Error fetching dashboard data:", error)
        throw error
    }
} 