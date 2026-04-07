import { api } from "@/lib/api_python"
import { FormValues } from "@/types/formClient"

export async function createForm(data: FormValues) {
    const response = await api.post("/prever", data)
    try{
        return response
    }catch(error){
        console.error("Error creating form:", error)
        throw error
    }
}