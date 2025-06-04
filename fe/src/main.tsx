import React from 'react'; // Added React for completeness, though StrictMode might come from here too
import ReactDOM from 'react-dom/client'; // Standard way to import createRoot
import App from './App'; // .tsx is optional in imports
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext'; // Import SettingsProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider> {/* Wrap with SettingsProvider */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
