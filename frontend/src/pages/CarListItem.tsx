import {Button, Card, Text, Image, NumberFormatter} from "@mantine/core";
import {IconHeart} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {Listing, toggleFavourite} from "../services/api/listing";
import {useState} from "react";
import {showErrorNotification, showSuccessfullNotificaiton} from "../services/notifications";
import {openLoginNeededModal} from "../services/LogInNeededModal";
import {NO_IMAGE_SRC} from "../constans/constans";

export const CarListItem = ({_id, title, car, images, likedByUsers }: Listing) => {
    const navigate = useNavigate();
    const currentUserId = sessionStorage.getItem("currentUserId");
    const isCurrentlyFavourited = likedByUsers.some((user) => user._id===currentUserId);
    const [isFavourited, setIsFavorited] = useState<boolean>(isCurrentlyFavourited)


    const toggleFavoriteHandler = async  (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (!currentUserId) {
            openLoginNeededModal(navigate);
        }
        try {
            const response = await toggleFavourite(_id)
            setIsFavorited(!isFavourited);
            showSuccessfullNotificaiton(response.data.message);
        } catch (error: any) {
            showErrorNotification(error.response?.data?.error?.message);
        }
    };

    return (
        <Card
            w={400}
            shadow="sm"
            p="lg"
            radius="md"
            onClick={() =>  navigate(`/car/${_id}`)}
            data-testid="car-card"
            style={{
                boxShadow: "var(--mantine-shadow-xl)",
                background: "var(--mantine-color-gray-1)",
                cursor: "pointer"
            }}
        >
            <Card.Section>
                <Image src={images.length > 0 ? images[0] : NO_IMAGE_SRC} alt={title} height={210} />
            </Card.Section>
            <Text size="lg" fw={700} mt="sm">{car.brand.name} {car.carModel}</Text>
            <Text size="lg"  style={{ overflow: 'hidden', whiteSpace: 'nowrap' }} >{title}</Text>
            <Text size="sm">Production year: {car.year}</Text>
            <Text size="sm">Mileage: {car.mileage} km</Text>

            <Text size="xl" fw={700} c={"red.9"}>
                <NumberFormatter suffix=" PLN" value={car.price} thousandSeparator />
            </Text>
            <Button onClick={toggleFavoriteHandler} variant={isFavourited ? "filled" : "outline"} mt="sm" color="red.9" radius="sm" leftSection={<IconHeart/>}>
                {isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            </Button>
        </Card>
    );
};
