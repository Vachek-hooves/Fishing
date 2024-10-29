import { createContext, useContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Create a provider component
export function AppProvider({ children }) {
    // Define your state values here
    const [someValue, setSomeValue] = useState('default value');
    
    // Create an object with all values and functions you want to share
    const value = {
        someValue,
        setSomeValue,
        // Add more state and functions as needed
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// Create a custom hook to use the context
export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
