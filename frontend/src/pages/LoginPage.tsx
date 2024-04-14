import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {TextInput, PasswordInput, Button, Paper, Title, Container, Text} from '@mantine/core';
import { useNavigate} from "react-router-dom";
import loginUser from "../services/api/login";
import {showErrorNotification, showSuccessfullNotificaiton} from "../services/notifications";

const validationSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export const LoginPage = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,

        onSubmit: async (values) => {
            try {
                const response = await loginUser(values);
                sessionStorage.setItem('authToken', response.data.token);
                sessionStorage.setItem('username', response.data.user.username)
                sessionStorage.setItem('currentUserId', response.data.user._id);
                sessionStorage.setItem('isAdmin', response.data.user.isAdmin);
                sessionStorage.setItem('phoneNumber', response.data.user.phoneNumber);

                showSuccessfullNotificaiton(response.data.message);
                navigate('/profile');
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }
        },
    });

    return (
        <Container size={420} my={40}>
            <Title style={{ textAlign: 'center' }} mb={12}>
                Login
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius={15}>
                <form onSubmit={formik.handleSubmit}>
                    <TextInput
                        label="Email"
                        placeholder="Your email"
                        id="email"
                        name="email"
                        type="email"
                        data-testid="email-input"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && formik.errors.email}
                        mb={12}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        id="password"
                        name="password"
                        data-testid="password-input"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && formik.errors.password}
                        mb={12}
                    />

                    <Button fullWidth mt="xl" type="submit">
                        Login
                    </Button>

                    <Text style={{cursor: "pointer"}} c="blue" mt="md" onClick={() => { navigate("/send-reset-password") }}>Forgot password?</Text>
                </form>
            </Paper>
        </Container>
    );
};
