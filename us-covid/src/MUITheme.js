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
        h4: {
            fontSize: "1.5rem"
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
        // MuiDialog: {
        //     root: {
        //         backgroundColor: "#121212"
        //     }
        // },
        MuiDialogTitle: {
            root: {
                fontSize: "1.6rem"
            }
        },
        MuiInputBase: {
            root: {
                color: "444"
            }
        },
        // MuiFormLabel: {
        //     root: {
        //         color: "444"
        //     }
        // },
        MuiInputLabel: {
            root: {
                color: "444"
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
            },
            head: {
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: "0.75rem"
            }
        },
        MuiFormControlLabel: {
            root: {
                marginLeft: "0",
                marginRight: "0"
            }
        },
        MuiTablePagination:{
            selectRoot: {
                marginLeft: "4px",
                marginRight: "8px"
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