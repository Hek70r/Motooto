import axios from 'axios';
import {SERVER_URL} from "../../constans/constans";

export interface Brand {
    _id: string;
    name: string;
    carModels: string[];
}

export interface BrandResponse {
    success: boolean;
    data: {
        brands: Brand[];
        message: string | undefined;
    };
}

export interface AddBrandResponse {
    success: boolean;
    data?: {
        brands: Brand[];
        message: string | undefined;
    };
    error?: {
        code: number;
        message: string;
    };
}


const getBrands = async (): Promise<BrandResponse> => {
    const API_URL = `${SERVER_URL}/api/brands`;
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const addBrand = async (name: string): Promise<AddBrandResponse> => {
    const token = sessionStorage.getItem('authToken');
    const API_URL = `${SERVER_URL}/api/brands`;
    const headers = {
        'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
    }
    try {
        const newBrand = { name: name };
        const response = await axios.post(API_URL, newBrand, { headers } );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getBrands, addBrand };
