import { createMuiTheme } from '@material-ui/core';

const styles = createMuiTheme({
    palette: {
        type: "light",
        primary: { main: "#1F77B4" },
        secondary: { main: '#03DAC6' },
        background: {
            default: "#FFFFFF"
        }
    },
    typography: {
        useNextVariants: true,
        //color: "blue",
        body1: {
            color: "white",
        },
        body2: {
            color: "white"
        }
    },
    overrides: {
        MuiAppBar: {
            root: {
                position: 'relative'
            }
        },
        MuiToolbar: {
            root: {
                display: 'flex',
                justifyContent: 'space-between'
            }
        },
        MuiCard: {
            root: {
                backgroundColor: "#1E1E1E"
            }
        },
        MuiDialog: {
            root: {
                backgroundColor: "#121212"
            }
        },
        MuiInputBase: {
            root: {
                color: "white"
            }
        },
        MuiFormLabel: {
            root: {
                color: "white"
            }
        },
        MuiInputLabel: {
            root: {
                color: "white"
            }
        },
        MuiPaper: {
            root: {
                backgroundColor: "#121212"
            }
        },
        MuiButton: {
            root: {
                fontWeight: "500"
            }
        }
    }
});

export default styles;