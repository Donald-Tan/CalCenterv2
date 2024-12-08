import React, { createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';

export const AuthContext = createContext({
    signIn: () => {},
    signOut: () => {},
});

export default function App() {
    const [isSignedIn, setIsSignedIn] = useState(false);

    const authContextValue = {
        signIn: () => setIsSignedIn(true),
        signOut: () => setIsSignedIn(false),
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            <NavigationContainer>
                <RootNavigator isSignedIn={isSignedIn} />
            </NavigationContainer>
        </AuthContext.Provider>
    );
}