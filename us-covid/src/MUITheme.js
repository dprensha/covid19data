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
        fontFamily: [
            "Open Sans",
            "Helvetica",
            "Arial",
            "sans-serif"
        ],
        useNextVariants: true,
        //color: "blue",
        body1: {
            color: "#444",
        },
        body2: {
            color: "#444"
        },
        h5: {
            fontSize: "1.3rem"
        },
        h6: {
            fontSize: "1.1rem"
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
                backgroundColor: "white"
            }
        },
        MuiButton: {
            root: {
                fontWeight: "500"
            }
        },
        MuiIconButton: {
            root: {
                color: "#444"
            }
        },
        MuiTableCell: {
            root: {
                padding: "8px"
            }
        },
        MuiFormControlLabel: {
            root: {
                marginLeft: "0",
                marginRight: "0"
            }
        },
        MuiTableRow: { root: {
            '&:last-child td': {
              borderBottom: 0,
            },
            '&:last-child th': {
                borderBottom: 0,
              },
          },
        },
    }
});

export default styles;