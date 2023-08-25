import type { AppProps } from "next/app";
import { ThemeProvider, DefaultTheme } from "styled-components";
import GlobalStyle from "../components/globalstyles";

const theme: DefaultTheme = {
  colors: {
    primary: "#111",
    secondary: "#0070f3",
    background: "#333",
    text: "#f0f0f0",
    white: "#f0f0f0",
    error: "#ff0000",
    warning: "#ffae00",
    success: "#00ff00",
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
