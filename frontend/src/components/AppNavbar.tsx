import {
    IconKey,
    IconLogin2, IconLogout,
    IconPlus,
    IconSearch,
    IconUserCircle
} from "@tabler/icons-react";
import {NavLink, Text} from "@mantine/core";
import {useLocation, useNavigate} from "react-router-dom";
import { modals } from '@mantine/modals';

export const AppNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!sessionStorage.getItem('authToken');
    const isAdmin = !!sessionStorage.getItem('isAdmin');

    const handleLogout = () => {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("isAdmin");
        sessionStorage.removeItem("currentUserId");
        sessionStorage.removeItem("phoneNumber");
        navigate("/search");
    }
    const openLogoutWarning = () => modals.openConfirmModal({
        title: 'Are you sure you want to logout?',
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => {
            console.log("Logout cancelled")
        },
        onConfirm: () => {
            handleLogout();
        }
    });

    return (
        <div>
            <div style={{position: 'relative', height: '100vh'}}>

                {!isLoggedIn && (
                    <>
                        <NavLink
                            onClick={() => navigate('/login')}
                            label="Logowanie"
                            leftSection={<IconLogin2 size="2rem" stroke={1.5}/>}
                            active={location.pathname === '/moto/login'}
                        />
                        <NavLink
                            onClick={() => navigate('/register')}
                            label="Rejestracja"
                            leftSection={<IconKey size="2rem" stroke={1.5}/>}
                            active={location.pathname === '/register'}
                        />
                    </>
                )}

                {isLoggedIn && (
                    <>
                        <NavLink
                            onClick={openLogoutWarning}
                            label="Logout"
                            leftSection={<IconLogout size="2rem" stroke={1.5}/>}
                            active={location.pathname === '/search'}
                            c="red.9"
                        />
                    </>
                )}

                <NavLink
                    onClick={() => navigate('/search')}
                    label="Search listings"
                    leftSection={<IconSearch size="2rem" stroke={1.5}/>}
                    active={location.pathname === '/search'}
                />
                <NavLink
                    onClick={() => navigate('/addnew')}
                    label="Add listing"
                    leftSection={<IconPlus size="2rem" stroke={1.5}/>}
                    active={location.pathname === '/addnew'}
                />
            </div>
            <div style={{position: 'absolute', bottom: '0', width: '100%'}}>
                <NavLink
                    onClick={() => navigate('/profile')}
                    label="Account"
                    leftSection={<IconUserCircle size="2rem" stroke={1.5}/>}
                    active={location.pathname === '/profile'}
                />
            </div>
        </div>
    )
}
