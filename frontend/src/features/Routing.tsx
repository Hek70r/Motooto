import {RouteObject, useRoutes} from "react-router-dom";
import {Layout} from "../components/Layout";
import {CarListPage} from "../pages/CarListPage";
import React from "react";
import {ListingAddNew} from "../pages/ListingAddNew";
import {ErrorPage} from "../pages/ErrorPage";
import {LoginPage} from "../pages/LoginPage";
import {ProfilePage} from "../pages/ProfilePage";
import {RegisterPage} from "../pages/RegisterPage";
import {CarDetailsPage} from "../pages/CarDetailsPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import SendResetPasswordPage from "../pages/SendResetPasswordPage";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                path: '/search',
                element: <CarListPage/>
            },
            {
                path: '/addnew',
                element: <ListingAddNew/>
            },
            {
                path: '/login',
                element: <LoginPage/>
            },
            {
                path: '/register',
                element: <RegisterPage/>
            },
            {
                path: '/profile',
                element: <ProfilePage/>
            },
            {
                path: '/reset-password/:token',
                element: <ResetPasswordPage/>
            },
            {
                path: '/send-reset-password',
                element: <SendResetPasswordPage/>
            },
            {
                path: '/car/:carId',
                element: <CarDetailsPage/>
            },
            {
                path: '*',
                element: <ErrorPage/>
            }
        ]
    }
]

export const Routing = () => {
    return useRoutes(routes);
}