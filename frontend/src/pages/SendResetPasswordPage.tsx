import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextInput, Button, Paper, Title, Container } from '@mantine/core';
import {sendResetTokenRequest} from "../services/api/user";
import {showErrorNotification, showSuccessfullNotificaiton} from "../services/notifications";

const validationSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
});

const SendResetPasswordPage = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,

        onSubmit: async (values) => {
            try {
                const response = await sendResetTokenRequest(values.email);
                showSuccessfullNotificaiton(response.data.message);
            } catch (error: any) {
                showErrorNotification(error.response?.data?.error?.message);
            }
        },
    });

    return (
        <Container size={420} my={40}>
            <Title style={{ textAlign: 'center' }} mb={12}>
                Reset Password
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

                    {/* Przycisk wysyłający żądanie resetowania hasła */}
                    <Button fullWidth mt="xl" type="submit">
                        Send Reset Email
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default SendResetPasswordPage;
