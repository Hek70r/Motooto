import {BrowserRouter} from "react-router-dom";
import {Routing} from "./features/Routing";
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from '@mantine/modals';
import { mainTheme } from "./mantineUtils/mainTheme";
import { Notifications } from '@mantine/notifications';



function App() {

  return(
        <MantineProvider defaultColorScheme="light" theme={mainTheme}>
            <Notifications />
            <ModalsProvider labels={{ confirm: 'Submit', cancel: 'Cancel' }}>
                 <BrowserRouter>
                     <Routing/>
                 </BrowserRouter>
            </ModalsProvider>
          </MantineProvider>
  );
}

export default App;
