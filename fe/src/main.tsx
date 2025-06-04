import React from 'react'; // Added React for completeness, though StrictMode might come from here too
import ReactDOM from 'react-dom/client'; // Standard way to import createRoot
import App from './App'; // .tsx is optional in imports
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
