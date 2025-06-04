import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const DEFAULT_BACKGROUND = 'defaultGradient'; // Define a default background key

interface SettingsContextType {
  selectedBackground: string;
  setSelectedBackground: (backgroundKey: string) => void;
  // Future settings can be added here, e.g.:
  // themeMode: 'light' | 'dark';
  // setThemeMode: (mode: 'light' | 'dark') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [selectedBackground, setSelectedBackgroundState] = useState<string>(() => {
    try {
      const storedBackground = localStorage.getItem('selectedBackground');
      // Add a check to ensure storedBackground is not null or empty if needed,
      // or validate against a list of known backgrounds.
      return storedBackground || DEFAULT_BACKGROUND;
    } catch (error) {
      console.error('Error reading selectedBackground from localStorage:', error);
      return DEFAULT_BACKGROUND;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('selectedBackground', selectedBackground);
      // Optionally, dispatch a custom event to notify other tabs/windows of the change
      // window.dispatchEvent(new CustomEvent('settings-changed', { detail: { selectedBackground } }));
    } catch (error)      {
      console.error('Error saving selectedBackground to localStorage:', error);
    }
  }, [selectedBackground]);

  const setSelectedBackground = (backgroundKey: string) => {
    // Add validation here if backgroundKey should be one of a predefined set
    setSelectedBackgroundState(backgroundKey);
  };

  const value = {
    selectedBackground,
    setSelectedBackground,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
