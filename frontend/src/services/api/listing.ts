import {ListingFormData} from "../../pages/ListingAddNew";
import {IListingFilters} from "../../types/IListingFilters";
import axios from "axios";
import {SERVER_URL} from "../../constans/constans";

export interface IBrand {
    _id: string;
    name: string;
}

export interface IUser {
    _id: string;
    username: string;
    email: string;
    phoneNumber: string | null | undefined;
}

export interface ICar {
    _id: string,
    brand: IBrand;
    carModel: string;
    year: number;
    mileage: number;
    engineType: "diesel" | "gasoline" | "electric" | "hybrid";
    engineSize: number;
    price: number;
}

export interface Listing {
    _id: string;
    title: string;
    description: string;
    car: ICar;
    images: string[];
    seller: IUser;
    likedByUsers: IUser[];
    __v: number;
}

export interface PlainResponse {
    success: boolean;
    data: {
        message?: string;
    };
}

export interface ListingsResponse {
    success: boolean;
    data: {
        listings: Listing[];
    };
}

export interface  ListingResponse {
    success: boolean;
    data: {
        listing: Listing
    };
}

export const getListings = async (filters:IListingFilters | null = null): Promise<ListingsResponse> => {
    const token = sessionStorage.getItem('authToken');
    let API_URL = `${SERVER_URL}/api/listings`
    const headers = {'Authorization': `Bearer ${token}`}

    if (filters) {
        const params = new URLSearchParams(filters as any);
        API_URL += `?${params.toString()}`;
    }

    try {
        const response = await axios.get(API_URL, { headers } );
        return response.data;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
};

export const toggleFavourite = async (listingId: string):Promise<PlainResponse> => {
    const token = sessionStorage.getItem('authToken');
    const API_URL = `${SERVER_URL}/api/listings/toggle-favourite/${listingId}`;
    const headers = {'Authorization': `Bearer ${token}`}
    try {
        const response = await axios.put(API_URL, {},{ headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export  const addListing = async (listingData: ListingFormData) => {
    const API_URL = `${SERVER_URL}/api/listings`;
    const token = sessionStorage.getItem('authToken');
    const headers = {'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data'};

    const formData = new FormData();
    formData.append('title', listingData.title);
    formData.append('description', listingData.description);
    formData.append('carModel', listingData.carModel ?? '');
    formData.append('carYear', String(listingData.carYear));
    formData.append('carMileage', String(listingData.carMileage));
    formData.append('carEngineType', listingData.carEngineType ?? '');
    formData.append('carEngineSize', String(listingData.carEngineSize));
    formData.append('carPrice', String(listingData.carPrice));
    formData.append('brandId', listingData.brandId ?? '');
    listingData.images.forEach((file, index) => {
        formData.append(`images`, file);
    });

    try {
        const response = await axios.post(API_URL, formData, { headers } );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getListingById = async (listingId: string): Promise<ListingResponse> => {
    const API_URL = `${SERVER_URL}/api/listings/${listingId}`;

    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeListing = async (listingId: string | undefined): Promise<PlainResponse> => {
    const API_URL = `${SERVER_URL}/api/listings/${listingId}`;
    const token = sessionStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}`}

    try {
        const response = await axios.delete(API_URL, { headers } );
        return response.data;
    } catch (error) {
        throw error;
    }
};
