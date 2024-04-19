import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {Tabs, rem} from '@mantine/core';
import { IconHeart, IconUser, IconSettings } from '@tabler/icons-react';
import { getUserProfile, UserProfile,} from "../services/api/user";
import Settings from "../components/ProfilePage/Settings";
import PersonalListings from "../components/ProfilePage/PersonalListings";
import FavouriteListings from "../components/ProfilePage/FavouriteListings";
import classes from "../components/ProfilePage/tabLabel.module.css";
import {showErrorNotification} from "../services/notifications";
import NotLoggedInInfo from "../components/NotLoggedInInfo";
import CustomLoader from "../components/CustomLoader";


export const ProfilePage = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const currentUserId = sessionStorage.getItem('currentUserId');

    useEffect(() => {
        if (!currentUserId) {
            return;
        }
        const fetchData = async () => {
            try {
                const userProfileResponse = await getUserProfile();
                setUserData(userProfileResponse.data.user);
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }

        };
        fetchData();
        setIsLoading(false);
    }, [currentUserId]);


    const iconStyle = { width: rem(40), height: rem(40) };

    if (!currentUserId) {
        return <NotLoggedInInfo/>
    }

    if (isLoading) {
        return <CustomLoader/>
    }

    return (
        <>
            <Tabs defaultValue="settings" classNames={{ tabLabel: classes.tabLabel }}>
                <Tabs.List>
                    <Tabs.Tab value="settings" leftSection={<IconSettings style={iconStyle} />}>
                        Account setting
                    </Tabs.Tab>
                    <Tabs.Tab value="personalListings" leftSection={<IconUser style={iconStyle} />}>
                        Your listings
                    </Tabs.Tab>
                    <Tabs.Tab value="favouriteListings" leftSection={<IconHeart style={iconStyle} />}>
                        Favourite listings
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="settings">
                    <Settings />
                </Tabs.Panel>

                <Tabs.Panel value="personalListings">
                    <PersonalListings />
                </Tabs.Panel>

                <Tabs.Panel value="favouriteListings">
                    <FavouriteListings />
                </Tabs.Panel>
            </Tabs>
        </>
    );
};

