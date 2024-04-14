import React, { useState, useEffect } from 'react';
import {TextInput, Textarea, Button, Group, FileInput, Select, Container, Text, Autocomplete} from '@mantine/core';
import { getBrands} from '../services/api/brand';
import { addListing } from "../services/api/listing";
import * as yup from 'yup';
import {useFormik} from "formik";
import { Brand } from "../services/api/brand"
import {showErrorNotification, showSuccessfullNotificaiton} from "../services/notifications";
import NotLoggedInInfo from "../components/NotLoggedInInfo";

export interface ListingFormData {
    title: string;
    description: string;
    brandId: string  | undefined;
    carModel: string | undefined;
    carYear: number;
    carMileage: number;
    carEngineType: string | null;
    carEngineSize: number;
    carPrice: number;
    images: File[];
}
const initialValues: ListingFormData = {
        title: '',
        description: '',
        brandId: '',
        carModel: '',
        carYear: 0,
        carMileage: 0,
        carEngineType: '',
        carEngineSize: 0,
        carPrice: 0,
        images: []
}
const validationSchema = yup.object({
    title: yup.string().trim().required('Tytuł jest wymagany'),
    description: yup.string().trim().required('Opis jest wymagany'),
    brandId: yup.string().required('Marka jest wymagana'),
    carModel: yup.string().required('Model jest wymagany'),
    carYear: yup.number().required('Rok produkcji jest wymagany').min(1900, 'Rok produkcji jest za niski').max(new Date().getFullYear(), 'Rok produkcji jest za wysoki'),
    carMileage: yup.number().required('Przebieg jest wymagany').min(0, 'Przebieg nie może być ujemny'),
    carEngineType: yup.string().required('Typ silnika jest wymagany'),
    carEngineSize: yup.number().required('Pojemność silnika jest wymagana').min(0, 'Pojemność silnika nie może być ujemna'),
    carPrice: yup.number().required('Cena jest wymagana').min(0, 'Cena nie może być ujemna'),
});

export const ListingAddNew = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const currentUserId = sessionStorage.getItem('currentUserId');

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, {resetForm}) => {
            values.brandId = brands.find(brand => brand.name === values.brandId)?._id;
            try {
                const response = await addListing(values);
                showSuccessfullNotificaiton(response.data.message);
                resetForm();
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }
        },
        validateOnBlur: true,
        validateOnChange: true,
    });

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await getBrands();
                setBrands(response.data.brands);
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }
        }
        fetchBrands();
    }, []);

    const engineTypes = [
        { value: 'gasoline', label: 'Gasoline' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'electric', label: 'Electric' },
        { value: 'hybrid', label: 'Hybrid' },
    ];

    if (!currentUserId) {
        return <NotLoggedInInfo/>
    }

    return (
            <Container size="sm">
                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                    <TextInput
                        label="Title"
                        name="title"
                        data-testid="title-input"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
                        required
                    />
                    <Autocomplete
                        label="Brand"
                        name="brandId"
                        value={formik.values.brandId}
                        onChange={(value) => {
                            const brand = brands.find(b => b.name === value);
                            setModels(brand ? brand.carModels : []);
                            formik.setFieldValue("brandId", brand?.name);
                            formik.setFieldValue("carModel", '');
                        }}
                        onBlur={() => formik.setFieldTouched("brandId", true) }
                        error={formik.touched.brandId && formik.errors.brandId}
                        data={brands.map(brand => brand.name)}
                        required
                    />
                    <Autocomplete
                        label="Model"
                        name="carModel"
                        data-testid="model-input"
                        value={formik.values.carModel}
                        onChange={(value) => formik.setFieldValue("carModel", value)}
                        onBlur={formik.handleBlur}
                        data={models.map(model => model )}
                        disabled={!formik.values.brandId}
                        required
                    />
                    <Textarea
                        label="Description"
                        name="description"
                        data-testid="description-input"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
                        required
                    />

                    <Text pt="xs" fw={500} c="red.9">Uploading files currently disabled due to server problems, sorry for inconvenience</Text>
                    <FileInput
                        label="Images of the vehicle"
                        placeholder="Choose files"
                        value={formik.values.images}
                        onChange={(event) => {
                            formik.setFieldValue('images', Array.from(event));
                            console.log(event);
                        }}
                        name="images"
                        disabled={false}
                        multiple
                    />
                    <TextInput
                        label="Production year"
                        name="carYear"
                        type="number"
                        value={formik.values.carYear}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.carYear && formik.errors.carYear}
                        required
                    />
                    <TextInput
                        label="Mileage (km)"
                        name="carMileage"
                        type="number"
                        value={formik.values.carMileage}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.carMileage && formik.errors.carMileage ? formik.errors.carMileage : undefined}
                        required
                    />
                    <Select
                        label="Engine type"
                        name="carEngineType"
                        value={formik.values.carEngineType}
                        onChange={(value) => formik.setFieldValue('carEngineType', value)}
                        onBlur={formik.handleBlur}
                        data={engineTypes}
                        error={formik.touched.carEngineType && formik.errors.carEngineType}
                        required
                    />
                    <TextInput
                        label="Engine size (cm³)"
                        name="carEngineSize"
                        type="number"
                        value={formik.values.carEngineSize}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.carEngineSize && formik.errors.carEngineSize ? formik.errors.carEngineSize : undefined}
                        required
                    />
                    <TextInput
                        label="Price (PLN)"
                        name="carPrice"
                        type="number"
                        data-testid="price-input"
                        value={formik.values.carPrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.carPrice && formik.errors.carPrice ? formik.errors.carPrice : undefined}
                        required
                    />
                    <Group mt="md">
                        <Button type="submit">Add listing</Button>
                    </Group>
                </form>
            </Container>
        );
};
