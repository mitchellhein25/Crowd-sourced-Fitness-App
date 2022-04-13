import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import AccountScreen from './accountScreen';
import ActiveChallenges from './activeChallenges';
import ChallengeSearch from './challengeSearch';
import { accentColor, white } from '../../assets/globalStyles';

const Tab = createBottomTabNavigator();

export default function MainAppView({ route }) {

    const { user } = route.params;
    const accountScreenName = 'Accounts';
    const activeChallengesScreenName = 'My Challenges';
    const challengeSearchScreenName = 'All Challenges';

    function tabBarIconFunction(screenRoute, color, size) {
        let iconName;

        if (screenRoute.name === accountScreenName) {
            iconName = 'person-outline';
        } else if (screenRoute.name === activeChallengesScreenName) {
            iconName = 'trending-up-outline';
        } else if (screenRoute.name === challengeSearchScreenName) {
            iconName = 'barbell-outline';
        }

        return <Ionicons name={iconName} color={color} size={size} />;
    }

    return (
        <Tab.Navigator
            screenOptions={({ screenRoute }) => ({
                tabBarIcon: ({ color, size }) => tabBarIconFunction(screenRoute, color, size),
                headerShown: false,
                tabBarActiveTintColor: accentColor,
                tabBarInactiveTintColor: 'grey',
                tabBarActiveBackgroundColor: white,
                tabBarInactiveBackgroundColor: white,
            })}
        >
            <Tab.Screen name={challengeSearchScreenName} component={ChallengeSearch} />
            <Tab.Screen name={activeChallengesScreenName} component={ActiveChallenges} />
            <Tab.Screen name={accountScreenName} children={() => <AccountScreen user={user} />} />
        </Tab.Navigator>
    );
}
