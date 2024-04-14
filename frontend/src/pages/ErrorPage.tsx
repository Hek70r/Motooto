import React from 'react';
import { Container, Text, Button } from '@mantine/core';

export const ErrorPage = () => {
    return (
        <Container size="xs" style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h1 >404 - Page Not Found</h1>
            <Text size="lg" style={{ marginTop: '20px', marginBottom: '30px' }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Text>
            <Button component="a" href="/search" size="lg" variant="outline" style={{ marginRight: '10px' }}>
                Go to Home
            </Button>
        </Container>
    );
}
