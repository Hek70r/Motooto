
import React, {useEffect, useState} from "react";
import {Listing} from "../../services/api/listing";
import {getUserListings} from "../../services/api/user";
import {notifications} from "@mantine/notifications";
import {CarListItem} from "../../pages/CarListItem";
import {Flex} from "@mantine/core";
import {Center} from "@mantine/core";
import CustomLoader from "../CustomLoader";
import ScrollButton from "../ScrollButton";

const PersonalListings = () => {
    const [personalListings, setPersonalListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPersonalListings = async () => {
            try {
                const response = await getUserListings();
                setPersonalListings(response.data.listings);
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
        fetchPersonalListings();
        setIsLoading(false)
    }, []);

    if (isLoading) {
        return <CustomLoader/>
    }

    if (personalListings.length < 1) {
        return <Center my="200px"><h2>You dont have any listings yet</h2></Center>
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
            {   personalListings.length > 0
                &&
                personalListings.map(listing =>
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

export default PersonalListings;