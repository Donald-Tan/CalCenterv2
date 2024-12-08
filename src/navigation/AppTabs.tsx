import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CalendarScreen from '../screens/CalendarScreen';
import CalorieGainedScreen from '../screens/CalorieGainedScreen';
import CalorieLossScreen from '../screens/CalorieLossScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    return (
        <Tab.Navigator initialRouteName="Calendar">
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{ title: 'Calendar' }}
            />
            <Tab.Screen
                name="Calorie Gain"
                component={CalorieGainedScreen}
                options={{ title: 'Calorie Gain' }}
            />
            <Tab.Screen
                name="Calorie Loss"
                component={CalorieLossScreen}
                options={{ title: 'Calorie Loss' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
}