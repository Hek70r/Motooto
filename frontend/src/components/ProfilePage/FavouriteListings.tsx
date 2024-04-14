import React, {useEffect, useState} from "react";
import {Listing} from "../../services/api/listing";
import {getUserFavoriteListings} from "../../services/api/user";
import {notifications} from "@mantine/notifications";
import {CarListItem} from "../../pages/CarListItem";
import {Flex, Center} from "@mantine/core";
import CustomLoader from "../CustomLoader";
import ScrollButton from "../ScrollButton";

const FavouriteListings = () => {
    const [favouriteListings, setFavouriteListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const fetchFavouriteListings = async () => {
            try {
                const response = await getUserFavoriteListings();
                setFavouriteListings(response.data.listings);
            } catch (error: any) {
                notifications.show({
                    withBorder: true,
                    autoClose: 6000,
                    color: 'red.9',
                    title: 'Wystąpił błąd',
                    message: error.response?.data?.error?.message,
                });
            }
        }
        fetchFavouriteListings();
        setIsLoading(false)
    }, []);

    if (isLoading) {
        return <CustomLoader />
    }

    if (favouriteListings.length < 1) {
        return <Center my="200px"><h2>You dont have any favourite listings yet</h2></Center>
    }

    return (
        <Flex
            direction={{ base: "column", sm: "row"}}
            justify="start"
            wrap="wrap"
            p="xl"
            my="xl"
            gap="md"
        >
            {   favouriteListings.length > 0
                &&
                favouriteListings.map(listing =>
                    <CarListItem
                        key={listing._id}
                        {...listing}
                    />
                )
            }
            <ScrollButton />
        </Flex>
    )
}

export default FavouriteListings;