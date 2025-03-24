import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GlobalStyle from './styles/globalStyles'
import AppRoutes from "./routes";
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <ToastContainer />
    <AppRoutes />
  </StrictMode>,
)
