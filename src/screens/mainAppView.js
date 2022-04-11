import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import AccountScreen from './accountScreen';
import ActiveChallenges from './activeChallenges';
import ChallengeSearch from './challengeSearch';
import { accentColor } from '../../assets/globalStyles';

const Tab = createBottomTabNavigator();

export default function MainAppView() {

    const accountScreenName = "Accounts";
    const activeChallengesScreenName = "My Challenges";
    const challengeSearchScreenName = "All Challenges";

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === accountScreenName) {
                        iconName = 'person-outline';
                    } else if (route.name === activeChallengesScreenName) {
                        iconName = 'trending-up-outline';
                    } else if (route.name === challengeSearchScreenName) {
                        iconName = 'barbell-outline';
                    }

                    // You can return any component that you like here!
                     return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: accentColor,
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name={challengeSearchScreenName} component={ChallengeSearch} />
            <Tab.Screen name={activeChallengesScreenName} component={ActiveChallenges} />
            <Tab.Screen name={accountScreenName} component={AccountScreen} />
        </Tab.Navigator>
    );
}
