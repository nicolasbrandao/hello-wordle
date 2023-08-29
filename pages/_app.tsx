import type { AppProps } from "next/app";
import { ThemeProvider, DefaultTheme } from "styled-components";
import GlobalStyle from "../components/globalstyles";

export const theme: DefaultTheme = {
  colors: {
    primary: "#111",
    secondary: "#0070f3",
    background: "#333",
    text: "#f0f0f0",
    white: "#f0f0f0",
    error: "#ba4d34",
    warning: "#b59f3b",
    success: "#538d4e",
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
