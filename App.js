import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { StyleSheet } from 'react-native';
import LandingPage from './src/screens/landingPage';
import { black, white } from './assets/globalStyles';
import './firebase';

//Had to ignore a known warning for firebase auth with expo
// https://github.com/firebase/firebase-js-sdk/issues/1847
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core and will be removed in a future release']); 

const AppNavigator = createStackNavigator(
    {
        Home: LandingPage
    },
    {
        initialRouteName: 'Home',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: black,
            },
            headerTintColor: white,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

const Navigator = createAppContainer(AppNavigator);

export default function App() {
    return (
        <Navigator style={styles.container}/>
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

