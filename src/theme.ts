import { createTheme, adaptV4Theme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme(adaptV4Theme({
  palette: {
    mode: "light",
    // primary: {
    //   main: "#61dafb",
    //   light: "#61dafb",
    //   dark: "#21a1c4",
    // },
    secondary: {
      main: "#A7A9DA",
      light: "#61dafb",
      dark: "#B1B1B1",
    },
    // error: {
    //   main: red.A400,
    // },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: 'Inter'
  },
  overrides: {
    MuiPaper: {
      root: {
        margin: "10px",
        backgroundColor: "#fff", // 5d737e
      },
    },
    MuiButton: {
      root: {
        margin: "5px",
      },
    },
  },
}));

export default theme;
