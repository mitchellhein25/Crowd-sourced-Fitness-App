import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function LandingPage() {
    return (
        <View style={styles.inputFormContainer}>
            
            <Text>Landing Page</Text>
            <View style={styles.textInputWrapper}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const inputBackgroundColor = '#ffe4e0';

const styles = StyleSheet.create({
    inputFormContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%'
    },
    textInput: {
        
    },
    textInputWrapper: {
        backgroundColor: inputBackgroundColor,
        borderRadius: 20,
        width: '50%',
        height: 40,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
	}
});
