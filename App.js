import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { StyleSheet } from 'react-native';
import LandingPage from './src/screens/landingPage';
import { black, white } from './assets/globalStyles';

const AppNavigator = createStackNavigator(
    {
        Home: LandingPage,
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: black,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                color: white,
            },
            headerTintColor: white,
        },
    },
    {
        initialRouteName: 'Landing Page',
    }
);

const Navigator = createAppContainer(AppNavigator);

export default function App() {
    return (
        <Navigator style={styles.container}>
            <LandingPage />
        </Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
