import React from 'react';
import {Text, Button, rem} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";

function HomePage() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, x: 1000 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
                width: "100%",
                height: "100%",
                display: 'flex',
                position: "relative",
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'start',
                color: 'black',
                background: 'rgba(255, 255, 255, 0.55) url(background.png) no-repeat center center',
                backgroundSize: 'cover',
                backgroundBlendMode: 'lighten',
                paddingLeft: "5%",
                paddingTop: "10%"
        }}>

            <Text
                component={motion.p}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 1 }}
                size={rem(70)} mb={50}
            >
                Find your perfect car.
            </Text>
            <Button component={motion.button}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 1 }}
                    variant="filled"
                    color="orange"
                    w={ rem(250)}
                    mb={25}
                    onClick={() => navigate("/search")}
            >
                Search
            </Button>
            <Button component={motion.button}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 1 }}
                    variant="filled"
                    w={ rem(250)}
                    mb={25}
                    onClick={() => navigate("/login")}
            >
                Login
            </Button>
        </motion.div>
    );
}

export default HomePage;
