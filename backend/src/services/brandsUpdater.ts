// Interface only with needed fields.
import axios, {AxiosResponse} from "axios";
import Brand from "../models/Brand"
import {IBrand} from "../models/Brand"

interface IVehicleData {
    make: string,
    basemodel: string
}

export const brandsUpdater = async () => {
    try {
        const dataApiUrl = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/exports/json?lang=en&timezone=Europe%2FBerlin';
        const data = await axios.get<IVehicleData[]>(dataApiUrl);
        const formatedBrands = formatVehiclesData(data.data);
        console.log(formatedBrands);
        saveBrandsToDb(formatedBrands)
    } catch (error) {
        console.error("Error has appeared when trying do fetch vehicle data from opendatasoft.com!\n", error);
    }

}

const formatVehiclesData = (data: IVehicleData[]) : IBrand[] => {
    const resultBrands: IBrand[] = [];
    data.forEach(vehicle => {
        const existingBrand = resultBrands.find(brand => brand.name ===vehicle.make);
        if (existingBrand) {
            if(!existingBrand.carModels.includes(vehicle.basemodel)) {
                existingBrand.carModels.push(vehicle.basemodel);
            }
        } else {
            const newBrand: IBrand = {
                name: vehicle.make,
                carModels: [vehicle.basemodel]
            }
            resultBrands.push(newBrand)
        }
    })
    return resultBrands;
}

const saveBrandsToDb = async (brands: IBrand[]) => {
    for( const brand of brands )  {
        try {
            const existingBrand = await Brand.findOne({ name: brand.name});
            if (existingBrand) {
                existingBrand.carModels = [...new Set([...existingBrand.carModels, ...brand.carModels])]
                await existingBrand.save();
            } else {
                // Jeżeli marka nie istnieje w bazie danych, tworzony jest nowy dokument
                const newBrand = new Brand({
                    name: brand.name,
                    carModels: brand.carModels
                });
                await newBrand.save();
            }
        } catch (error) {
            console.error("Error has appeared when trying to update brands in db. Brand: ",  brand.name, "caused it\n", error);
        }
    }
}