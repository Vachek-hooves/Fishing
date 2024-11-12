import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_LOCATION = {
  latitude: 37.7749, // San Francisco coordinates
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Create the context
const AppContext = createContext();

// Create a provider component
export function AppProvider({ children }) {
    // Define your state values here
    const [spots, setSpots] = useState([]);
    const [location, setLocation] = useState(null);
    const [usingDefaultLocation, setUsingDefaultLocation] = useState(true);
    
    // Load saved location on app start
    useEffect(() => {
        loadSavedLocation();
    }, []);

    const loadSavedLocation = async () => {
        try {
            const savedLocation = await AsyncStorage.getItem('userLocation');
            if (savedLocation) {
                const parsedLocation = JSON.parse(savedLocation);
                setLocation(parsedLocation);
                setUsingDefaultLocation(false);
            } else {
                setLocation(DEFAULT_LOCATION);
                setUsingDefaultLocation(true);
            }
        } catch (error) {
            console.error('Error loading location:', error);
            setLocation(DEFAULT_LOCATION);
            setUsingDefaultLocation(true);
        }
    };

    const updateLocation = async (newLocation, isDefault = false) => {
        try {
            if (!isDefault) {
                await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));
            }
            setLocation(newLocation);
            setUsingDefaultLocation(isDefault);
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    const deleteSpot = async (spotId) => {
        try {
            const updatedSpots = spots.filter(spot => spot.id !== spotId);
            await AsyncStorage.setItem('fishingSpots', JSON.stringify(updatedSpots));
            setSpots(updatedSpots);
            return true;
        } catch (error) {
            console.error('Error deleting spot:', error);
            return false;
        }
    };

    // Add function to update spots
    const updateSpots = async (newSpots) => {
        try {
            await AsyncStorage.setItem('fishingSpots', JSON.stringify(newSpots));
            setSpots(newSpots);
        } catch (error) {
            console.error('Error saving spots:', error);
        }
    };

    // Create an object with all values and functions you want to share
    const value = {
        spots,
        updateSpots,
        deleteSpot,
        location,
        usingDefaultLocation,
        updateLocation,
        loadSavedLocation,
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
