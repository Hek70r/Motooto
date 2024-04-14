import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {Button, Container, Paper, PasswordInput, TextInput, Title} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {registerUser} from "../services/api/register";
import { showErrorNotification, showSuccessfullNotificaiton } from "../services/notifications";

const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
});


export const RegisterPage = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const { confirmPassword, ...userData } = values;
            try {
                const response = await registerUser(userData);
                showSuccessfullNotificaiton(response.data.message);
                navigate('/login');
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }
        },
    });

    return (
        <Container size={420} my={40}>
            <Title style={{ textAlign: 'center' }} mb={12}>
                Registration
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius={15}>
                <form onSubmit={formik.handleSubmit}>
                    <TextInput
                        label="Username"
                        placeholder="Your username"
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && formik.errors.username}
                        mb={12}
                    />

                    <TextInput
                        label="Email"
                        placeholder="Your email"
                        id="email"
                        name="email"
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
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && formik.errors.password}
                        mb={12}
                    />

                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        mb={12}
                    />

                    <Button fullWidth mt="xl" type="submit">
                        Register
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};
