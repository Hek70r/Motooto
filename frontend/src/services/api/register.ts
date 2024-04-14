import axios from 'axios';
import {SERVER_URL} from "../../constans/constans";

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData): Promise<any> => {
    const API_URL = `${SERVER_URL}/api/register`;
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(API_URL, data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};
