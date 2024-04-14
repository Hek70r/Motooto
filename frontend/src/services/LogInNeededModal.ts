import {modals} from "@mantine/modals";
import {NavigateFunction} from "react-router-dom";

export const openLoginNeededModal = (navigate: NavigateFunction) => modals.openConfirmModal({
    title: 'You need to log in in order to do that',
    labels: { confirm: 'Log in', cancel: 'Cancel' },
    onCancel: () => {
        return;
    },
    onConfirm: () => navigate("/login"),
});