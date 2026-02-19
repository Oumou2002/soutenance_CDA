import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");
document.documentElement.lang = "fr";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

