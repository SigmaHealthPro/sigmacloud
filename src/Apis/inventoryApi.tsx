import axios from "axios";
const baseURI = 'https://localhost:7155';

export const inventoryApi = async (url: String, type: String, data?: any) => {
    try {
        switch (type) {
            case "POST":
                const postResponse = await axios.post(`${baseURI}${url}`, data)
                return postResponse;
            case "GET":
                const response = await axios.get(`${baseURI}${url}`)
                return response;
            default:
                break;
        }
    }
    catch (error: any) {
        console.log("API ERRROR", error)
        return error
    }
}