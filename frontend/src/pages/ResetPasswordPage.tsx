import React, {useEffect, useState} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {PasswordInput, Button, Paper, Title, Container, TextInput, Center} from '@mantine/core';
import { useParams, useNavigate } from "react-router-dom";
import {getUserIdByToken, resetPassword } from "../services/api/user";
import {showErrorNotification, showSuccessfullNotificaiton} from "../services/notifications";

const validationSchema = yup.object({
    password: yup.string().required('Password is required'),
    confirmPassword: yup.string()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match')
});

const ResetPasswordPage = () => {
    const [ userId, setUserId ] = useState<string | undefined>(undefined)
    const { token } = useParams();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (!userId) {
                showErrorNotification("User not found")
                return navigate("/search");
            }
            if(!token) {
                showErrorNotification("Reset token not found");
                return navigate("/search");
            }
            try {
                const response = await resetPassword(userId, formik.values.password, token);
                showSuccessfullNotificaiton(response?.data?.message);
                navigate('/login')
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }
        },
    });

    useEffect(() => {
        if(!token) {
            showErrorNotification("Reset token not found");
            return navigate("/search");
        }
        const fetchUser = async () => {
            try {
                const response = await getUserIdByToken(token);
                setUserId(response.data?.userId);
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }
        };
        fetchUser();
    }, []);

    if (!token) {
        return <Center>
            <h2>Token not found.</h2>
        </Center>
    }

    if (!userId) {
        return <Center>
            <h2>User with this token was not found.</h2>
        </Center>
    }

    return (
        <Container size={420} my={40}>
            <Title style={{ textAlign: 'center' }} mb={12}>
                Reset Password
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius={15}>
                <form onSubmit={formik.handleSubmit}>
                    <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && formik.errors.password}
                        mb={12}
                    />

                    <PasswordInput
                        label="Confirm New Password"
                        placeholder="Confirm your new password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        mb={12}
                    />

                    <Button fullWidth mt="xl" type="submit">
                        Reset Password
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default ResetPasswordPage;
