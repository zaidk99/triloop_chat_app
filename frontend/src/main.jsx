import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux';
import {store} from "./redux/store";
import './index.css'
import App from './App.jsx'
// import Footer from './components/footer.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import Navbar from './components/Navbar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <SocketProvider>
  <Provider store = {store}>
      <App />
  </Provider>
  </SocketProvider>
  </StrictMode>,
)


