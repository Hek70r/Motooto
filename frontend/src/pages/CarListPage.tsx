import {getListings, Listing} from "../services/api/listing";
import React, {useEffect, useState} from "react";
import {CarListItem} from "./CarListItem";
import {
    Button, Center,
    Container,
    Flex,
    Group,
    NumberInput,
    Select, Text
} from "@mantine/core";
import {getBrands, Brand} from "../services/api/brand";
import {useFormik} from "formik";
import {IListingFilters} from "../types/IListingFilters";
import * as yup from "yup";
import {showErrorNotification, showSuccessfullNotificaiton} from "../services/notifications";
import CustomLoader from "../components/CustomLoader";
import ScrollButton from "../components/ScrollButton";
import CustomSkeletonLoader from "../components/CustomSkeletonLoader";
import {log} from "util";

const initialValues: IListingFilters = {
    brandId: "",
    carModel: "",
    priceFrom: "",
    priceTo: "",
    engineType: "",
    yearFrom: "",
    yearTo: "",
}
const validationSchema = yup.object({
    brandId: yup.string(),
    carModel: yup.string(),
    priceFrom: yup.number().min(0, "Niepoprawna cena"),
    priceTo: yup.number().min(1, "Niepoprawna cena"),
    engineType: yup.string(),
    yearFrom: yup.number().min(1900, "Niepoprawny rok").max((new Date().getFullYear())),
    yearTo: yup.number().min(1900, "Niepoprawny rok").max((new Date().getFullYear())),
})

const engineTypes = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Eletric' },
    { value: 'hybrid', label: 'Hybrid' },
];

export const CarListPage = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const currentUserId = sessionStorage.getItem('currentUserId');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await getBrands();
                setBrands(response.data.brands);
            } catch (error: any) {
                setBrands([]);
                showErrorNotification(error.response?.data?.error?.message);
            }
            setIsLoading(false);
        };
        const fetchListings = async () => {
            try {
                const response = await getListings();
                if (response.success) {
                    setListings(response.data.listings);
                }
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }
        };

        fetchBrands();
        fetchListings();
    }, [currentUserId]);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const response = await getListings(formik.values);
                if (response.success) {
                    setListings(response.data.listings);
                }
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }
            setIsLoading(false);
        },
        validateOnBlur: true,
        validateOnChange: true
    })

    return (
        <>
            <Container size="sm">
            <form onSubmit={formik.handleSubmit}>
                <Select
                    label="Brand"
                    name="brandId"
                    data-testid="brand-input"
                    value={formik.values.brandId}
                    onChange={(value) => {
                        const brand = brands.find(b => b._id === value);
                        setModels(brand ? brand.carModels : []);
                        formik.setFieldValue("brandId", value);
                        formik.setFieldValue("carModel", '');
                    }}
                    onBlur={() => formik.setFieldTouched("brandId", true)}
                    error={formik.touched.brandId && formik.errors.brandId}
                    data={brands.map(brand => ({ value: brand._id, label: brand.name }))}
                    required
                />
                <Select
                    label="Model"
                    name="carModel"
                    data-testid="model-input"
                    value={formik.values.carModel}
                    onChange={(value) => formik.setFieldValue("carModel", value)}
                    onBlur={formik.handleBlur}
                    data={models.map(model => ({ value: model, label: model }))}
                    disabled={!formik.values.brandId}
                    required
                />
                <Flex justify="space-between" wrap="wrap">
                    <NumberInput
                        w={{base: "100%", xs:"45%"}}
                        label="Price from [ PLN ]"
                        value={formik.values.priceFrom}
                        onChange={(value) => {formik.setFieldValue("priceFrom", value)}}
                        error={formik.touched.priceFrom && formik.errors.priceFrom}
                    />
                    <NumberInput
                        w={{base: "100%", xs:"45%"}}
                        label="Price to [ PLN ]"
                        value={formik.values.priceTo}
                        onChange={(value) => {formik.setFieldValue("priceTo", value)}}
                        error={formik.touched.priceTo && formik.errors.priceTo}
                    />
                    <NumberInput
                        w={{base: "100%", xs:"45%"}}
                        label="Year from"
                        value={formik.values.yearFrom}
                        onChange={(value) => {formik.setFieldValue("yearFrom", value)}}
                        error={formik.touched.yearFrom && formik.errors.yearFrom}
                    />
                    <NumberInput
                        w={{base: "100%", xs:"45%"}}
                        label="Year to"
                        value={formik.values.yearTo}
                        onChange={(value) => {formik.setFieldValue("yearTo", value)}}
                        error={formik.touched.yearTo && formik.errors.yearTo}
                    />
                </Flex>
                <Select
                    label="Engine type"
                    name="Silnik"
                    value={formik.values.engineType}
                    onChange={(value) => {formik.setFieldValue('engineType', value)}}
                    onBlur={formik.handleBlur}
                    data={engineTypes}
                    error={formik.touched.engineType && formik.errors.engineType}
                    required
                />
                <Group mt="md">
                    <Button type="submit">Filter</Button>
                </Group>
            </form>
            </Container>
            <Center><Text mt="xl" fw={600}>{listings.length} results.</Text></Center>
                <Flex
                    direction={{ base: "column", sm: "row"}}
                    justify="center"
                    wrap="wrap"
                    p="xl"
                    my="xl"
                    gap="md"
                >
                    {
                        !isLoading ? (
                            listings.length > 0 &&
                            <>
                                {listings.map(listing => (
                                    <CarListItem
                                        key={listing._id}
                                        {...listing}
                                    />
                                ))}
                            </>
                        ) : (
                                <CustomLoader />
                        )
                    }
                </Flex>
            <ScrollButton />
        </>
    );
};
