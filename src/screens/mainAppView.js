import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import AccountScreen from './accountScreen';
import ActiveChallenges from './activeChallenges';
import ChallengeSearch from './challengeSearch';
import { accentColor, white } from '../utils/globalStyles';

const Tab = createBottomTabNavigator();

export default function MainAppView({ route }) {
    const { user } = route.params ? route.params : {};
    const accountScreenName = 'Accounts';
    const activeChallengesScreenName = 'My Challenges';
    const challengeSearchScreenName = 'All Challenges';

    function tabBarIconFunction(routes, color, size) {
        let iconName;

        if (routes.name === accountScreenName) {
            iconName = 'person-outline';
        } else if (routes.name === activeChallengesScreenName) {
            iconName = 'trending-up-outline';
        } else if (routes.name === challengeSearchScreenName) {
            iconName = 'barbell-outline';
        }

        return <Ionicons name={iconName} color={color} size={size} />;
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => tabBarIconFunction(route, color, size),
                headerShown: false,
                tabBarActiveTintColor: accentColor,
                tabBarInactiveTintColor: 'grey',
                tabBarActiveBackgroundColor: white,
                tabBarInactiveBackgroundColor: white,
            })}
        >
            <Tab.Screen
                name={activeChallengesScreenName}
                children={() => <ActiveChallenges user={user} />}
            />
            <Tab.Screen
                name={challengeSearchScreenName}
                children={() => <ChallengeSearch user={user} />}
            />
            <Tab.Screen name={accountScreenName} children={() => <AccountScreen user={user} />} />
        </Tab.Navigator>
    );
}
