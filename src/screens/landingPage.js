import React, { useState } from 'react';
//The AsyncStorage warning is reference in App.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';
import {
    StyleSheet, Text, TextInput, View, Button
} from 'react-native';
import {
    primaryColor, white, black
} from '../../assets/globalStyles';

export default function LandingPage() {
    const [state, setState] = useState({
        email: "",
        password: ""
    });

    const auth = getAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

    function handleChange(e, name) {
        setState({
            ...state,
            [name]: e
        });
	}

    async function onSubmit(e) {
        console.log('Starting sign in');
        try {
            await signInWithEmailAndPassword(auth, state.email, state.password);
            console.log('sign in successful');
        } catch (error) {
            console.log(error);
        }
	}

    return (
        <View style={styles.inputFormContainer}>
            <View style={styles.headerWrapper}>
                <Text style={styles.headerText}>Fitness Challenge App</Text>
            </View>
            <View style={styles.signInFields}>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        value={state.email}
                        onChangeText={e => handleChange(e, 'email')}
                    />
                </View>
                <View style={styles.textInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Password"
                        value={state.password}
                        onChangeText={e => handleChange(e, 'password')}
                    />
                </View>
                <View style={styles.signInButtonWrapper}>
                    <Button
                        style={styles.signInButton}
                        title="Sign In"
                        accessibilityLabel="Sign in button"
                        color={white}
                        onPress={onSubmit}
                    />
                </View>
                <View style={styles.signUpWrapper}>
                    <Text style={styles.signUpPreText}>
                        Don&apos;t already have an account?
                    </Text>
                    <View style={styles.signUpButtonWrapper}>
                        <Button
                            style={styles.signUpButton}
                            title="Sign Up"
                            accessibilityLabel="Sign up button"
                            color={black}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        marginTop: 100,
        marginBottom: 100
    },
    headerText: {
        fontSize: 40
    },
    inputFormContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: primaryColor
    },
    textInput: {
        textAlign: 'center',
        height: '100%',
        width: '100%',
        borderWidth: 2,
        borderRadius: 5,
    },
    textInputWrapper: {
        backgroundColor: white,
        width: '80%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
    },
    signInFields: {
        width: '100%',
        alignItems: 'center',
    },
    signInButtonWrapper: {
        margin: 5,
        width: 200,
        backgroundColor: black
    },
    signUpButtonWrapper: {
        margin: 5,
        width: 200,
        backgroundColor: white,
    },
    signUpWrapper: {
        marginTop: 100,
        alignItems: 'center'
    },
    signUpPreText: {
        color: white,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10
    },
    signUpButton: {
        width: 200,
    }
});
