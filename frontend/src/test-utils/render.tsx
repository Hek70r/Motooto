// ./test-utils/render.tsx
import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
// Import your theme object
export function render(ui: React.ReactNode) {
    return testingLibraryRender(<Router>{ui}</Router>, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
            <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
        ),
    });
}
