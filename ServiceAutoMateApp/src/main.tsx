import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/home'
import GlobalStyle from './styles/globalStyles'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <Home title="ServiceAutoMateApp" />
  </StrictMode>,
)
