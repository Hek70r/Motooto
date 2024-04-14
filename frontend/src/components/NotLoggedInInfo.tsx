import {Button, Center, Stack, Text} from "@mantine/core";
import React from "react";
import {useNavigate} from "react-router-dom";

const NotLoggedInInfo = () => {
    const navigate = useNavigate();
    return (
        <Center mt="xl">
            <Stack>
                <Text fw={700} size="xl">Nie jesteś zalogowany</Text>
                <Button onClick={() => navigate("/login")}>Zaloguj się</Button>
            </Stack>
        </Center>
    );
}

export default NotLoggedInInfo;