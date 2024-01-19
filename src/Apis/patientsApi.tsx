import axios from "axios";
const baseURI = 'https://localhost:7155';

export const patientApi = async (url: String, type: String, data?: any) => {
    debugger
    try {
        switch (type) {

            case "POST":
                const postResponse = await axios.post(`${baseURI}${url}`, data)
                debugger;
                return postResponse;

            case "GET":
                const response = await axios.get(`${baseURI}${url}`)
                debugger;
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