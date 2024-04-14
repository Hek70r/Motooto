import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";

import { IconHeart, IconShare, IconX} from "@tabler/icons-react";
import { Button, Center, CopyButton, Flex, Image, NumberFormatter, rem, Stack, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { modals } from "@mantine/modals";

import { toggleFavourite} from "../services/api/listing";
import { showErrorNotification, showSuccessfullNotificaiton } from "../services/notifications";
import { getListingById, Listing, removeListing} from '../services/api/listing';
import { openLoginNeededModal} from "../services/LogInNeededModal";
import SellerContact from "../components/SellerContact";
import CustomLoader from "../components/CustomLoader";
import {NO_IMAGE_SRC} from "../constans/constans";


export const CarDetailsPage = () => {
    const [listing, setListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [notFound, setNotFound ] = useState<boolean>(false);
    const [isFavourited, setIsFavourited ] = useState<boolean>(false)
    const [isOwner, setIsOwner] = useState(false);

    const currentUserId = sessionStorage.getItem("currentUserId");
    const { carId } = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const currentUrl = window.location.origin + location.pathname + location.search;

    useEffect(() => {
        if (!carId) {
            return
        }
        const fetchData = async () => {
            try {
                const response = await getListingById(carId);
                const listing = response.data.listing;
                setListing(listing);
                const isCurrentlyFavorited = listing.likedByUsers.some((user) => user._id === currentUserId);
                setIsFavourited(isCurrentlyFavorited);
                setIsOwner(listing.seller._id === currentUserId);
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
                setNotFound(true);
            }
        };
        fetchData();
        setIsLoading(false);
    }, [currentUserId]);

    const toggleFavoriteHandler = async () => {
        if (!listing) {
            return
        }
        if (!currentUserId) {
            openLoginNeededModal(navigate);
        }
        try {
            const response = await toggleFavourite(listing._id)
            setIsFavourited(!isFavourited);
            showSuccessfullNotificaiton(response.data.message);
        } catch (error: any) {
            showErrorNotification(error.response?.data?.error?.message);
        }
    }



    const handleRemoveListing = async () => {
        try {
            const response = await removeListing(listing?._id);
            showSuccessfullNotificaiton(response.data.message);
            navigate('/search')
        } catch (error: any) {
            showErrorNotification(error.response?.data?.error?.message);
        }
    }

    const openRemoveWarning = () => modals.openConfirmModal({
        title: 'Are you sure you want to delete this listing?',
        labels: { confirm: 'DELETE', cancel: "Cancel" },
        confirmProps: { color: 'red' },
        children: (
            <Text size="sm">
                Removing this listing will be permanent, without any possibility to restore it.
            </Text>
        ),
        onCancel: () => {
            console.log("Removing listing cancelled")
        },
        onConfirm: () => {
            handleRemoveListing();
        }
    });

    const openSellerContact = () => {
        if (!listing) {
            return;
        }
        modals.open({
            children: (<SellerContact {...listing.seller}/>),
        });
    }


    if (notFound) {
        return <Center>
            <Text fw={700} size="xl">Couldn't find this listing</Text>
        </Center>
    }

    if(isLoading || !listing) {
        return <CustomLoader />;
    }
    
    return (
        <Center>
            <Flex mt="xl" direction="column" justify="center" gap="xl" w="80%">
                    <Flex direction={{base: "column", lg: "row"}}  justify="center">
                        <Carousel withIndicators
                                  slideSize="100%"
                                  style={{
                                      border: "1px solid var(--mantine-color-gray-4)",
                                      borderRadius: rem(10)
                                  }}
                                  w={{ base: "100%", lg: 750}}
                                  height={450}
                                  align="center">
                            {
                                listing.images.length > 0 ?
                                    (
                                        listing.images.map((image, index) =>{
                                    return (
                                        <Carousel.Slide key={index}>
                                            <Image fit="contain"
                                                   w="100%"
                                                   h="100%"
                                                   src={image}
                                            />
                                        </Carousel.Slide>
                                    )})
                                    )
                                    :
                                    (
                                        <Carousel.Slide>
                                            <Image fit="contain"
                                                   w="100%"
                                                   h="100%"
                                                    src={NO_IMAGE_SRC}
                                            />
                                        </Carousel.Slide>
                                    )
                            }
                        </Carousel>
                        <Stack pb="sm" px={{base: 0, lg: "md"}} style={{ flexGrow: 1}} justify="space-between">
                            <Stack>
                                <Text size="xl" fw={700}>{listing.car.brand.name} {listing.car.carModel}</Text>
                                <Text size="lg">{listing.title}</Text>
                                <Text size="xl" fw={700} c={"red.9"}>
                                    <NumberFormatter suffix=" PLN" value={listing.car.price} thousandSeparator />
                                </Text>
                            </Stack>
                            <Stack w="100%">
                                <Button h={50} onClick={toggleFavoriteHandler} mt="md" variant={isFavourited ? "filled" : "outline"} color="red.7" leftSection={<IconHeart/>}>
                                    {isFavourited ? 'Remove from favourites' : 'Add to favourites'}
                                </Button>
                                <Button onClick={openSellerContact} h={50} >Contact with the seller</Button>
                            </Stack>
                        </Stack>
                    </Flex>
                    <CopyButton value={currentUrl}>
                        {({ copied, copy }) => (
                            <Button
                                w={{base: "100%", sm: "50%", md: "40%", lg:"30%"}}
                                color={copied ? 'teal' : 'blue'} onClick={copy}
                                variant={copied ? 'filled': 'outline'}
                                leftSection={<IconShare/>}
                            >
                                {copied ? 'Copied to clipborad' : 'Share this listing'}
                            </Button>
                        )}
                    </CopyButton>
                    {isOwner &&
                        <Button
                            w={{base: "100%", sm: "50%", md: "40%", lg:"30%"}}
                            leftSection={<IconX/>}
                            color="red.9"
                            onClick={openRemoveWarning}
                        >
                            Delete listing
                        </Button>
                    }
                <Stack gap="xs">
                    <Text size="xl" fw={700}>Details</Text>
                    <Text>Brand: {listing.car.brand.name}</Text>
                    <Text>Model: {listing.car.carModel}</Text>
                    <Text>Production year: {listing.car.year}</Text>
                    <Text>Mileage: {listing.car.mileage} km</Text>
                    <Text>Engine type: {listing.car.engineType}</Text>
                    <Text>Engine size: {listing.car.engineSize} cm³</Text>
                    <Text size="md" fw={700} >
                        <span>Price</span> <NumberFormatter suffix=" PLN" value={listing.car.price} thousandSeparator />
                    </Text>
                    <Text mt="md" size="xl" fw={700} >Description</Text>
                    <Text>{listing.description}</Text>
                </Stack>
            </Flex>
        </Center>
    );
};