import axios from 'axios';
import {SERVER_URL} from "../../constans/constans";

export interface UserProfile {
    _id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    listings: any[];
    likedListings: any[];
    themeMode: string;
    __v: number;
}

export interface UserProfileResponse {
    success: boolean;
    data: {
        user: UserProfile;
        message: string | undefined
    };
}

export interface UserIdResponse {
    success: boolean;
    data?: {
        userId: string;
    };
    error?: {
        code: number;
        message: string;
    };
}

export interface GenerateTokenResponse {
    success: boolean;
    data: {
        message: string;
    };
    error: {
        code: number;
        message: string;
    };
}

export interface ResetPasswordResponse {
    success: boolean;
    data?: {
        message: string | undefined
    };
    error?: {
        code: number;
        message: string;
    };
}

const API_URL = `${SERVER_URL}/api/user`;

export const getUserProfile = async (): Promise<UserProfileResponse> => {
    const token = sessionStorage.getItem('authToken'); // Pobieranie tokena z sessionStorage
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
        const response = await axios.get(API_URL, { headers } );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserFavoriteListings = async (): Promise<any> => {
    const token = sessionStorage.getItem('authToken'); // Pobieranie tokena z sessionStorage
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
        const response = await axios.get(`${API_URL}/favourites`, { headers} );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserListings = async (): Promise<any> => {
    const token = sessionStorage.getItem('authToken'); // Pobieranie tokena z sessionStorage
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
        const response = await axios.get(`${API_URL}/listings`, { headers } );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserIdByToken = async (token: string): Promise<UserIdResponse> => {
    try {
        const response = await axios.get(`${API_URL}/_id/${token}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendResetTokenRequest = async (email: string): Promise<GenerateTokenResponse> => {
    try {
        const response = await axios.post(`${API_URL}/generate-token`, { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (userId: string, newPassword: string, resetToken: string): Promise<ResetPasswordResponse> => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, { userId, newPassword, resetToken });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editUser = async (username: string | undefined, phoneNumber: string | undefined): Promise<any> => {
    const token = sessionStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log(username)
    console.log(phoneNumber)
    let data: {username?: string, phoneNumber?: string} = {};
    if (username) {
        data.username = username;
    }
    if (phoneNumber) {
        data.phoneNumber = phoneNumber;
    }
    try {
        const response = await axios.put(API_URL, data, { headers } );
        return response.data;
    } catch (error) {
        throw error;
    }
};
