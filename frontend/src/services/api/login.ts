import axios from 'axios';
import {SERVER_URL} from "../../constans/constans";
export interface LoginData {
    email: string;
    password: string;
}

const loginUser = async (data: LoginData): Promise<any> => {
    try {
        const response = await axios.post(`${SERVER_URL}/api/login`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export default loginUser;
