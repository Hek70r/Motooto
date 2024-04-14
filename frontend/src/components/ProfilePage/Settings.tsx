import {Button, Center, Text, Flex, Paper, Select, TextInput} from "@mantine/core";
import React, {ReactNode, useEffect, useState} from "react";
import { modals } from '@mantine/modals';
import {editUser, getUserProfile, sendResetTokenRequest} from "../../services/api/user";
import {useFormik} from "formik";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {showErrorNotification, showSuccessfullNotificaiton} from "../../services/notifications";
import CustomLoader from "../CustomLoader";

const handleResetPassword = async () => {
    try {
        const response = await getUserProfile();
        const email = response.data.user.email;
        await sendResetTokenRequest(email);
        alert("Reset email sent successfully");
    } catch (error) {
        alert("Couldn't send reset email");
    }
}
const openResetPasswordWarning = () => modals.openConfirmModal({
    title: 'Resetowanie hasła',
    children: (
        <Text size="sm" >
            Na twój adres e-mail zostanie wysłany link z możliwością zresetowania hasła
        </Text>
    ),
    labels: { confirm: 'Potwierdź', cancel: 'Anuluj' },
    onCancel: () => {},
    onConfirm: () => {
        handleResetPassword();
    }
});

const Settings = () => {
    const [currentUsername, setCurrentUsername] = useState<string>("");
    const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const username = sessionStorage.getItem("username");
        const phoneNumber = sessionStorage.getItem("phoneNumber");
        if (username) {
            setCurrentUsername(username);
        }
        if (phoneNumber) {
            setCurrentPhoneNumber(phoneNumber);
        }
    }, []);

    const usernameFormik= useFormik({
        initialValues: {
            username: '',
        },
        validationSchema: yup.object({
            username: yup.string().required("Username is required").min(3, "Username has to be at least 3 characters long"),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const response = await editUser(values.username, undefined);
                sessionStorage.setItem("username", response.data.user.username);
                setCurrentUsername(response.data.user.username);
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message)
            }
            setIsLoading(false);
        },
    });
    const phoneNumberFormik = useFormik({
        initialValues: {
            phoneNumber: '',
        },
        validationSchema: yup.object({
            phoneNumber: yup.string().required("Phone number is required").matches(/^[0-9]{9}$/, 'Phone number must be 9 digits long'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await editUser(undefined, values.phoneNumber);
                sessionStorage.setItem("phoneNumber", response.data.user.phoneNumber);
                setCurrentPhoneNumber(response.data.user.phoneNumber);
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message)
            }
        },
    });

    const handleLogout = () => {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("isAdmin");
        sessionStorage.removeItem("currentUserId");
        sessionStorage.removeItem("phoneNumber");
        navigate("/search");
    }
    const openLogoutWarning = () => modals.openConfirmModal({
        title: 'Czy na pewno chcesz się wylogować?',
        labels: { confirm: 'Potwierdź', cancel: 'Anuluj' },
        onCancel: () => {
            console.log("Logout cancelled")
        },
        onConfirm: () => {
            handleLogout();
        }
    });

    const phoneNumber = currentPhoneNumber ? currentPhoneNumber : "None"

    if (isLoading) {
        return <CustomLoader />
    }

    return (
        <Center>
            <Flex direction="column" gap="xl" h="90%" my={40}>
                <Paper withBorder shadow="md" p={30} mt={30} radius={15}>
                    <SettingsSection title="Change your password">
                        <Button onClick={openResetPasswordWarning} variant="filled">Reset password with email</Button>
                    </SettingsSection>

                    <form onSubmit={usernameFormik.handleSubmit}>
                        <SettingsSection title="Change your username">
                            <Text>Current username: {currentUsername}</Text>
                            <TextInput
                                placeholder="Enter new username"
                                name="username"
                                id="username"
                                value={usernameFormik.values.username}
                                onChange={usernameFormik.handleChange}
                                error={usernameFormik.touched.username && usernameFormik.errors.username}
                            />
                            <Button type="submit" variant="filled">Change</Button>
                        </SettingsSection>
                    </form>

                    <form onSubmit={phoneNumberFormik.handleSubmit}>
                        <SettingsSection title="Change your phone number">
                            <Text>Current phone number: {phoneNumber}</Text>
                            <TextInput
                                placeholder="Enter new phone number"
                                name="phoneNumber"
                                id="phoneNumber"
                                value={phoneNumberFormik.values.phoneNumber}
                                onChange={phoneNumberFormik.handleChange}
                                error={phoneNumberFormik.touched.phoneNumber && phoneNumberFormik.errors.phoneNumber}
                            />
                            <Button type="submit" variant="filled">Change</Button>
                        </SettingsSection>
                    </form>

                    <SettingsSection title="Logout section">
                        <Button variant="filled" color="red" onClick={openLogoutWarning}>Logout</Button>
                    </SettingsSection>
                </Paper>
            </Flex>
        </Center>
    );
}

interface SettingsSectionProps {
    title: string;
    children: ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
    return (
        <Paper p="md" shadow="xs" radius="md" style={{ marginBottom: 10 }}>
            <Flex direction="column" gap="md">
                <h2 style={{ marginBottom: 10 }}>{title}</h2>
                {children}
            </Flex>
        </Paper>
    );
};


export default Settings;