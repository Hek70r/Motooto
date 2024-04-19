import {Outlet, useNavigate} from "react-router-dom";
import {AppNavbar} from "./AppNavbar";
import {AppShell, Burger, Flex, Group, Image, Title} from "@mantine/core";
import React from "react";
import {useDisclosure} from "@mantine/hooks";
import '../styles/Layout.css';


export const Layout = () => {

    const [opened, {toggle}] = useDisclosure();
    const navigate = useNavigate();
    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'md', collapsed: {mobile: !opened}}}
            padding="md"
            h="100%"
        >
            <AppShell.Header>
                <Flex align="center" h="100%" px="md" gap="lg">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm"/>
                    <Flex direction="row" style={{cursor: "pointer"}} onClick={() => navigate("/")}>
                        <Image src="../motootologo.png" alt="Logo MOTOOTO" width={45} height={45}></Image>
                        <Title>MOTOOTO</Title>
                    </Flex>
                </Flex>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <AppNavbar toggle={toggle}/>
            </AppShell.Navbar>
            <AppShell.Main
            h="100%"
            ><Outlet/></AppShell.Main>
        </AppShell>
    )
}