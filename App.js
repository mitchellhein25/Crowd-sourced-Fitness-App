import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, LogBox } from 'react-native';
import LandingPage from './src/screens/landingPage';
import SignUpScreen from './src/screens/signUpScreen';
import MainAppView from './src/screens/mainAppView';
import AddNewChallenge from './src/screens/addNewChallenge';
import ChallengeDetail from './src/screens/challengeDetail';
// import Chat from './src/screens/chatScreen';
import { black, white } from './src/utils/globalStyles';
import './firebase';

// Had to ignore a known warning for firebase auth with expo
// https://github.com/firebase/firebase-js-sdk/issues/1847
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core and will be removed in a future release']);

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: black,
                    },
                    headerTintColor: white,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerShown: false,
                }}
                style={styles.container}
            >
                <Stack.Screen name="Landing Page" component={LandingPage} />
                <Stack.Screen name="Sign-Up Screen" component={SignUpScreen} />
                <Stack.Screen name="Main App View" component={MainAppView} />
                <Stack.Screen name="Add New Challenge" component={AddNewChallenge} />
                <Stack.Screen name="Challenge Detail" component={ChallengeDetail} />
                {/* <Stack.Screen name="Chat Screen" component={Chat} /> */}
            </Stack.Navigator>
        </NavigationContainer>
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
