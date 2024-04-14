import {useWindowScroll} from "@mantine/hooks";
import {Affix, Button, rem, Transition} from "@mantine/core";
import {IconArrowUp} from "@tabler/icons-react";

const ScrollButton = () => {
    const [scroll, scrollTo] = useWindowScroll();

    return (
        <>
            <Affix position={{ bottom: 20, right: 10 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftSection={<IconArrowUp style={{  width: rem(20), height: rem(20) }} />}
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            Scroll to top
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    );
}

export default ScrollButton;