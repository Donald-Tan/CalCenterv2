import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <AuthStack.Navigator initialRouteName="SignIn">
            <AuthStack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ headerShown: false }}
            />
            <AuthStack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ title: 'Sign Up' }}
            />
        </AuthStack.Navigator>
    );
}
