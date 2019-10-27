import { createMuiTheme } from '@material-ui/core/styles';
import {
    deepPurple,
    amber,
    red,
} from '@material-ui/core/colors'

const theme = createMuiTheme({
    palette: {
        primary: deepPurple, // Deep purple and amber play nicely together.
        secondary: {
            ...amber,
            A400: '#FFC400',
        },
        error: red,
    },
    typography: {
        useNextVariants: true,
    },
});

export default theme;
