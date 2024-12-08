import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import AppTabs from './AppTabs';

const RootStack = createNativeStackNavigator();

export default function RootNavigator({ isSignedIn }) {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {isSignedIn ? (
                <RootStack.Screen name="AppTabs" component={AppTabs} />
            ) : (
                <RootStack.Screen name="Auth" component={AuthNavigator} />
            )}
        </RootStack.Navigator>
    );
}