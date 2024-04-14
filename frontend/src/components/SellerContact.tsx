import { IconMail, IconUser, IconPhone, IconCar } from "@tabler/icons-react";
import {Center, List, Text, rem, ThemeIcon, Title, Flex} from "@mantine/core";
import { IUser } from "../services/api/listing";

const SellerContact = ({ username, email, phoneNumber }: IUser) => {
    const listItems = [
        { title: "Username", value: username, icon: IconUser },
        { title: "Email", value: email, icon: IconMail},
        { title: "Phone number", value: phoneNumber, icon: IconPhone}
    ];

    return (
        <Flex direction="column" gap="lg"  align="center" px="lg" pb="lg">
            <IconCar style={{ color: "black", width: rem(80), height: rem(80)}}/>
            <List
                spacing="md"
                size="xl"
                center
            >
                {listItems.map(item => (
                    <List.Item
                        key={item.title}
                        icon={
                            <ThemeIcon color="blue" size={36} radius="xl">
                                <item.icon style={{ width: rem(24), height: rem(24) }} />
                            </ThemeIcon>
                        }
                    >
                        <Flex gap="sm" justify="center" align="center">
                            <Text fw={600} size="xl">{item.title}: </Text>
                            <Text size="xl" >{item.value ? item.value : "Not given"}</Text>
                        </Flex>

                    </List.Item>
                ))}
            </List>
        </Flex>
    )
}

export default SellerContact;