import { notifications } from '@mantine/notifications';

export const showSuccessfullNotificaiton = (message: string | undefined) => {
    notifications.show({
        withBorder: true,
        autoClose: 6000,
        color: 'blue',
        title: 'Success!',
        message: message ? message : "",
    });
}

export const showErrorNotification = (message: string | undefined) => {
    notifications.show({
        withBorder: true,
        autoClose: 6000,
        color: 'red.9',
        title: 'There was and error.',
        message: message ? message : "",
    });
}
