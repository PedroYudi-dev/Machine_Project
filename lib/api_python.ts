import axios from "axios";

export const api = axios.create({
    baseURL: process.env.PYTHON_API_URL,
})