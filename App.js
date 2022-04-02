import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TestScreen from './src/screens/testScreen';

export default function App() {
    return (
        <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text>Hello World, Crowd-sourced Fitness App!</Text>
            <StatusBar />
            <TestScreen />
        </View>
    );
}

const white = '#fff';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
