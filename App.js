import React from 'react';
import { StyleSheet, View } from 'react-native';
import LandingPage from './src/screens/landingPage';

export default function App() {
    return (
        <View style={styles.container}>
            <LandingPage />
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
