import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GlobalStyle from "./styles/globalStyles";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <StrictMode>
      <GlobalStyle />
      <ToastContainer />
      <AppRoutes />
    </StrictMode>
  </ThemeProvider>
);
